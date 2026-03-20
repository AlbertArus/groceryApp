const {processWithGemini} = require("./geminiAPI.js");

async function compararPrecios(text, lista) {
  if (!text || text.trim() === "") {
    return {modified_items: [], new_items: [], error: "No hay texto válido para comparar"};
  }

  if (!lista?.categories) {
    return {modified_items: [], new_items: [], error: "Lista de productos inválida"};
  }

  const itemsToCompare = lista.categories.flatMap((category) =>
    category.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
    })),
  );

  try {
    const geminiResults = await processWithGemini(text, itemsToCompare);
    return geminiResults;
  } catch (error) {
    console.error("Error al procesar con Gemini:", error);
    throw error;
  }
}

module.exports = {compararPrecios};
