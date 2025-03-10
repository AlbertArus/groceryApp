const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

async function processWithGemini(ticketText, itemsToCompare) {
    try {
        // Obtener la instancia de vertexAI del ámbito global
        const vertexAI = global.vertexAI;
        
        if (!vertexAI) {
            throw new Error('Vertex AI no está configurado correctamente');
        }
        
        // Obtener el modelo generativo
        const generativeModel = vertexAI.getGenerativeModel({
            model: MODEL_NAME
        });
        
        const prompt = `
            Analiza el siguiente texto de un ticket de compra y compáralo con la lista de productos proporcionada.

            Texto del Ticket:
            ${ticketText}

            Lista de Productos:
            ${JSON.stringify(itemsToCompare)}

            Instrucciones:
            1. Identifica los items de la lista del ticket con su precio y agrupa los productos similares (ej., "1L Asturiana x2" y "1.5L Celta" como "leche").
            2. Suma los importes correspondientes para cada producto agrupado.
            3. Compara los items del ticket con los de la lista y modifica su precio devolviendo el id del item, el nombre del item y el precio con el valor modificado.
            4. Identifica los items del ticket que no existen en la lista de productos y añádelos con su precio.
            5. La respuesta debe tener EXACTAMENTE esta estructura, llamando a las propiedades exactamente así:
               {
                 "modified_items": [
                   { "id": "id_del_item", "name": "nombre_del_item", "price": precio_modificado }
                 ],
                 "new_items": [
                   { "name": "nombre_del_item_nuevo", "price": precio_del_item }
                 ]
               }
            6. Asegúrate de que las propiedades sean "modified_items" y "new_items" con guion bajo, NO "modifiedItems" o "newItems".
            7. NO INCLUYAS ningún texto adicional, comentarios, explicaciones o delimitadores como \`\`\`json o \`\`\`. SOLAMENTE el objeto JSON.
        `;

        const request = {
            contents: [{ 
                role: "user",
                parts: [{ text: prompt }] 
            }],
        };

        const response = await generativeModel.generateContent(request);
        let geminiResponse = response.response.candidates[0].content.parts[0].text.trim();
        
        // Intento 1: Parsear directamente si la respuesta ya es un JSON limpio
        try {
            return JSON.parse(geminiResponse);
        } catch (jsonError) {
            console.error('Error al parsear la respuesta JSON (intento 1):', jsonError);
            console.log('Respuesta raw inicial de Gemini:', geminiResponse.substring(0, 200) + '...');
            
            // Intento 2: Eliminar marcadores de código markdown
            let cleanedResponse = geminiResponse.replace(/```json|```/g, '').trim();
            
            try {
                return JSON.parse(cleanedResponse);
            } catch (jsonError2) {
                console.error('Error al parsear la respuesta JSON (intento 2):', jsonError2);
                
                // Intento 3: Extraer el JSON entre llaves
                try {
                    const jsonStart = geminiResponse.indexOf('{');
                    const jsonEnd = geminiResponse.lastIndexOf('}') + 1;
                    
                    if (jsonStart >= 0 && jsonEnd > jsonStart) {
                        const jsonString = geminiResponse.substring(jsonStart, jsonEnd);
                        return JSON.parse(jsonString);
                    }
                } catch (fallbackError) {
                    console.error('Error en intento 3 de parseo:', fallbackError);
                }
                
                // Intento 4: Reemplazar los backticks literales si están escapados
                try {
                    const escapedResponse = geminiResponse.replace(/\\`\\`\\`json|\\`\\`\\`/g, '').trim();
                    return JSON.parse(escapedResponse);
                } catch (escapedError) {
                    console.error('Error en intento 4 de parseo:', escapedError);
                }
                
                // Intento 5: Construir la estructura manualmente usando expresiones regulares
                try {
                    const modifiedItemsMatch = geminiResponse.match(/"modified_items"\s*:\s*\[(.*?)\]/s);
                    const newItemsMatch = geminiResponse.match(/"new_items"\s*:\s*\[(.*?)\]/s);
                    
                    const modified_items = modifiedItemsMatch ? parseItems(modifiedItemsMatch[1]) : [];
                    const new_items = newItemsMatch ? parseItems(newItemsMatch[1]) : [];
                    
                    return { modified_items, new_items };
                } catch (regexError) {
                    console.error('Error en intento 5 de parseo:', regexError);
                }
                
                // Si todo lo anterior falla, devolver una estructura vacía pero válida
                console.log('Respuesta raw completa de Gemini:', geminiResponse);
                return { 
                    modified_items: [], 
                    new_items: [],
                    error: 'No se pudo procesar la respuesta como JSON válido' 
                };
            }
        }
    } catch (error) {
        console.error('Error al llamar a la API de Gemini:', error);
        throw error;
    }
}

// Función auxiliar para parsear arrays de items desde texto
function parseItems(itemsText) {
    if (!itemsText || itemsText.trim() === '') {
        return [];
    }
    
    const items = [];
    
    // Patrón para capturar objetos individuales
    const itemPattern = /\{([^{}]*)\}/g;
    let match;
    
    while ((match = itemPattern.exec(itemsText)) !== null) {
        const itemObj = {};
        const itemContent = match[1];
        
        // Extraer propiedades
        const idMatch = itemContent.match(/"id"\s*:\s*"([^"]*)"/);
        const nameMatch = itemContent.match(/"name"\s*:\s*"([^"]*)"/);
        const priceMatch = itemContent.match(/"price"\s*:\s*([0-9.]*)/);
        
        if (idMatch) {
            itemObj.id = idMatch[1];
        }
        
        if (nameMatch) {
            itemObj.name = nameMatch[1];
        }
        
        if (priceMatch) {
            itemObj.price = parseFloat(priceMatch[1]);
        }
        
        if (Object.keys(itemObj).length > 0) {
            items.push(itemObj);
        }
    }
    
    return items;
}

module.exports = { processWithGemini };