const { VertexAI } = require('@google-cloud/aiplatform');

async function processTicketWithGemini(ticketText, itemList) {
    const PROJECT_ID = 'your-project-id'; // Reemplaza con tu ID de proyecto
    const LOCATION = 'your-location'; // Reemplaza con tu ubicación (ej., 'us-central1')
    const MODEL_NAME = 'gemini-pro';

    const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
    const model = vertexAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
    Analiza el siguiente texto de un ticket de compra y compáralo con la lista de productos proporcionada.

    Texto del Ticket:
    ${ticketText}

    Lista de Productos:
    ${JSON.stringify(itemList)}

    Instrucciones:
    1. Identifica y agrupa los productos similares (ej., "1L Asturiana x2" y "1.5L Celta" como "leche").
    2. Suma los importes correspondientes para cada producto agrupado.
    3. Indica los elementos del ticket que se han modificado respecto a la lista de productos.
    4. Identifica los productos del ticket que no existen en la lista de productos y añádelos con su precio.
    5. Devuelve un objeto JSON con los resultados.
    `;

    const request = {
        contents: [{ parts: [{ text: prompt }] }],
    };

    try {
        const response = await model.generateContent(request);
        const geminiResponse = response.response.candidates[0].content.parts[0].text;
        return JSON.parse(geminiResponse); // Intenta parsear la respuesta JSON
    } catch (error) {
        console.error('Error al llamar a la API de Gemini:', error);
        return null;
    }
}