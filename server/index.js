require('dotenv').config({ path: '../.env.development' });
const express = require('express');
const cors = require('cors');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const { VertexAI } = require('@google-cloud/vertexai');
// const { PredictionServiceClient } = require('@google-cloud/aiplatform');
const { processWithGemini } = require('./geminiAPI.js');
global.processWithGemini = processWithGemini;
const { parseTextToStructuredData } = require('./FormatTicket.js');
const { compararPrecios } = require('./compararPrecios.js');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Configurar clientes con las credenciales de Google Cloud
const credentialsFile = require("../groceryapp-dev-e8e3f-b12dda12e904.json");
const credentialsVertexAI = require("../groceryapp-dev-e8e3f-1adb2481b409_Gemini.json")
const visionClient = new ImageAnnotatorClient({ credentials: credentialsFile });

// Configurar Vertex AI
const PROJECT_ID = process.env.PROJECT_ID || 'groceryapp-dev-e8e3f';
const LOCATION = process.env.VERTEX_LOCATION || 'europe-west4';

// Inicializar Vertex AI correctamente
const vertexAI = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION,
    credentials: credentialsVertexAI
});

// Hacer disponible vertexAI globalmente
global.vertexAI = vertexAI;
global.processWithGemini = processWithGemini;

app.post('/api/ocr', async (req, res) => {
    try {
        if (!req.body.image) {
            return res.status(400).json({ error: 'Datos de imagen faltantes' });
        }

        const imageBase64 = req.body.image;
        const imageBuffer = Buffer.from(imageBase64, 'base64');

        // Realizar OCR con Vision API
        const [result] = await visionClient.textDetection({
            image: {
                content: imageBuffer,
            },
        });

        if (!result.textAnnotations || result.textAnnotations.length === 0) {
            console.log("No se detectó texto");
            return res.status(200).json({ text: '', geminiResults: null });
        }

        const extractedText = result.textAnnotations[0].description;
        const structuredData = parseTextToStructuredData(extractedText);
        console.log("Texto extraído:", extractedText.substring(0, 100) + "...");
        
        // Verificar la configuración de Vertex AI
        if (!global.vertexAI) {
            return res.status(500).json({ 
                text: extractedText,
                error: 'Vertex AI no está configurado correctamente'
            });
        }

        try {
            // Comparar precios usando Gemini
            const geminiResults = await compararPrecios(extractedText, req.body.lista);
            
            return res.status(200).json({ 
                text: extractedText, 
                structuredData: structuredData,
                geminiResults: geminiResults 
            });
        } catch (geminiError) {
            console.error('Error al procesar con Gemini:', geminiError);
            return res.status(200).json({ 
                text: extractedText,
                structuredData: structuredData,
                geminiResults: null,
                error: 'Error al analizar con IA: ' + geminiError.message
            });
        }

    } catch (error) {
        console.error('Error OCR:', error);
        return res.status(500).json({
            error: error.message || 'OCR falló',
            details: error.stack || 'No hay detalles adicionales disponibles'
        });
    }
});

// Endpoint específico para comparar precios
app.post('/api/compare-prices', async (req, res) => {
    try {
        const { text, lista } = req.body;
        
        if (!text || !lista) {
            return res.status(400).json({ error: 'Texto o lista de productos faltantes' });
        }
        
        const results = await compararPrecios(text, lista);
        return res.status(200).json(results);
    } catch (error) {
        console.error('Error al comparar precios:', error);
        return res.status(500).json({
            error: error.message || 'Error al comparar precios',
            details: error.stack || 'No hay detalles adicionales disponibles'
        });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});