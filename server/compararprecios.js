const { processWithGemini } = require('./geminiAPI.js');

async function compararPrecios(text, lista) {
    console.log("=== SERVER: Iniciando comparación de precios ===");
    console.log("1. Texto recibido:", text ? `${text.substring(0, 50)}...` : "null");
    console.log("2. Lista recibida:", lista ? "OK" : "null");

    // Verificar datos de entrada
    if (!text || text.trim() === '') {
        return { error: "No hay texto válido para comparar" };
    }

    if (!lista?.categories) {
        return { error: "Lista de productos inválida" };
    }

    // Preparar datos para la comparación
    const itemsToCompare = lista.categories.flatMap((category) =>
        category.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
        }))
    );
    console.log("3. Items para comparar:", itemsToCompare.length);

    try {
        // Verificar disponibilidad de la función global
        if (!processWithGemini) {
            throw new Error("La función processWithGemini no está disponible");
        }

        console.log("4. Llamando a processWithGemini...");
        const geminiResults = await global.processWithGemini(text, itemsToCompare);
        console.log("5. Resultados procesados correctamente");
        
        return geminiResults;
    } catch (error) {
        console.error('Error al procesar con Gemini:', error);
        throw error; // Propagar el error para un mejor manejo en index.js
    }
}

module.exports = { compararPrecios };