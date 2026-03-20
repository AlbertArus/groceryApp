// Importa triggers y módulos de Firebase Functions usando desestructuración
const {setGlobalOptions, https, logger} = require("firebase-functions");
const {onRequest} = https; // onRequest ahora se obtiene de https

// Importa módulos de Google Cloud y tus módulos auxiliares
const cors = require("cors")({origin: true}); // Middleware CORS
const {ImageAnnotatorClient} = require("@google-cloud/vision");
const {VertexAI} = require("@google-cloud/vertexai");

// Importa tus módulos auxiliares desde functions/src/
const {parseTextToStructuredData} = require("./src/FormatTicket");
const {compararPrecios} = require("./src/compararprecios");
// Nota: 'geminiAPI.js' probablemente es usado internamente por 'compararPrecios',
// por lo que no necesita un 'require' directo aquí a menos que se use explícitamente en este archivo.

// Para control de costos, puedes establecer el número máximo de instancias.
setGlobalOptions({maxInstances: 10});

// --- INICIALIZACIÓN DE CLIENTES DE GOOGLE CLOUD ---
// Se inicializan sin especificar 'credentials', lo que hace que utilicen la cuenta de servicio
// por defecto de la Cloud Function. Asegúrate de que esta cuenta de servicio tenga los
// roles 'Cloud Vision API User' y 'Vertex AI User' en Google Cloud IAM.

const visionClient = new ImageAnnotatorClient();

// Configuración para Vertex AI
// GCLOUD_PROJECT es una variable de entorno proporcionada automáticamente por Google Cloud Functions.
const PROJECT_ID = process.env.GCLOUD_PROJECT || "groceryapp-dev-e8e3f";
// VERTEX_LOCATION puede ser una variable de entorno configurada por ti en Firebase Console.
const LOCATION = process.env.VERTEX_LOCATION || "europe-west4"; // Ajusta la región si es necesario

const vertexAI = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
  // Las credenciales se gestionan a través de la cuenta de servicio por defecto
});

// Para mantener la compatibilidad si tu código auxiliar ('compararPrecios') espera 'global.vertexAI'
// Idealmente, deberías refactorizar tus módulos auxiliares para recibir 'vertexAI' como argumento.
global.vertexAI = vertexAI;

/**
 * Cloud Function HTTP para procesar OCR y comparar precios.
 * Esta función actúa como un enrutador para diferentes rutas POST.
 *
 * Endpoint principal: https://<region>-<project-id>.cloudfunctions.net/ocrApiHandler
 * Sub-rutas manejadas: /ocr y /compare-prices
 */
exports.ocrApiHandler = onRequest(async (req, res) => {
  return cors(req, res, async () => {
    // Registra la información de la petición
    logger.info(`Petición ${req.method} recibida en: ${req.path}`, {
      structuredData: true,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });

    if (req.method !== "POST") {
      logger.warn(`Método no permitido para ${req.path}: ${req.method}`);
      return res.status(405).send("Method Not Allowed");
    }

    try {
      // Manejo de la ruta /ocr (o /api/ocr)
      if (req.path === "/ocr" || req.path === "/api/ocr") {
        const {image, lista} = req.body;

        if (!image) {
          logger.error("Datos de imagen faltantes en /ocr");
          return res.status(400).json({error: "Datos de imagen faltantes"});
        }

        const imageBuffer = Buffer.from(image, "base64");
        const maxSizeBytes = 8 * 1024 * 1024; // Límite de 8 MB para la imagen
        if (imageBuffer.length > maxSizeBytes) {
          logger.error("Imagen demasiado grande en /ocr", {size: imageBuffer.length});
          return res.status(400).json({error: "Imagen demasiado grande. Usa una foto más pequeña o comprimida."});
        }

        // OCR con Vision API
        const [result] = await visionClient.textDetection({
          image: {
            content: imageBuffer,
          },
        });

        if (!result.textAnnotations || result.textAnnotations.length === 0) {
          logger.info("No se detectó texto en /ocr");
          return res.status(200).json({text: "", geminiResults: null});
        }

        const extractedText = result.textAnnotations[0].description;
        const structuredData = parseTextToStructuredData(extractedText);
        logger.info(`Texto extraído (parcial) en /ocr: ${extractedText.substring(0, 100)}...`, {
          extractedTextPreview: extractedText.substring(0, 100),
        });

        if (!global.vertexAI) {
          logger.error("Vertex AI no está configurado correctamente en /ocr");
          return res.status(500).json({
            text: extractedText,
            error: "Vertex AI no está configurado correctamente",
          });
        }

        try {
          // Comparar precios usando Gemini
          const geminiResults = await compararPrecios(extractedText, lista);

          return res.status(200).json({
            text: extractedText,
            structuredData: structuredData,
            geminiResults: geminiResults,
          });
        } catch (geminiError) {
          logger.error(`Error al procesar con Gemini en /ocr: ${geminiError.message}`, geminiError);
          return res.status(200).json({
            text: extractedText,
            structuredData: structuredData,
            geminiResults: null,
            error: "Error al analizar con IA: " + geminiError.message,
          });
        }
        // Manejo de la ruta /compare-prices (o /api/compare-prices)
      } else if (req.path === "/compare-prices" || req.path === "/api/compare-prices") {
        const {text, lista} = req.body;

        if (!text || !lista) {
          logger.error("Texto o lista de productos faltantes en /compare-prices");
          return res.status(400).json({error: "Texto o lista de productos faltantes"});
        }

        if (!global.vertexAI) {
          logger.error("Vertex AI no está configurado correctamente en /compare-prices");
          return res.status(500).json({
            error: "Vertex AI no está configurado correctamente",
          });
        }

        const results = await compararPrecios(text, lista);
        return res.status(200).json(results);
        // Si la ruta no coincide con ninguna de las anteriores
      } else {
        // Manejo de rutas no manejadas
        logger.warn(`Ruta no manejada: ${req.path}`);
        return res.status(404).send("Not Found");
      }
    } catch (error) {
      logger.error(`Error general en la función ocrApiHandler para ${req.path}: ${error.message}`, error);
      return res.status(500).json({
        error: error.message || "Error interno del servidor",
        details: error.stack || "No hay detalles adicionales disponibles",
      });
    }
  });
});
