const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";

async function processWithGemini(ticketText, itemsToCompare) {
  const vertexAI = global.vertexAI;

  if (!vertexAI) {
    throw new Error("Vertex AI no está configurado correctamente");
  }

  const generativeModel = vertexAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 2048,
    },
  });

  const prompt = `Eres un asistente que extrae productos y precios de tickets de compra y restaurantes en español, catalán o inglés.

TEXTO DEL TICKET (OCR):
${ticketText}

LISTA ACTUAL DE PRODUCTOS (id, name, price):
${JSON.stringify(itemsToCompare)}

INSTRUCCIONES:
1. Extrae cada línea de producto con su precio final. Ignora: cabeceras del establecimiento, fecha, hora, NIF/CIF, número de ticket, subtotal, total, IVA, forma de pago, puntos, descuentos globales y cualquier línea sin precio.
2. Cada producto del ticket es un item independiente. Si aparece con cantidad (ej. "2 x 1.50" o "LECHE x2 3.00"), usa el precio total de esa línea (3.00) y el nombre sin la cantidad.
3. El precio de cada item es el importe que aparece al final de su línea. Si hay precio unitario y total en la misma línea, usa el total.
4. Compara cada producto extraído con la lista existente por nombre similar (ignora mayúsculas, acentos y abreviaciones). Si coincide, ponlo en "modified_items" con su id y el nuevo precio. Si no coincide, ponlo en "new_items".
5. Los nombres deben ser legibles: elimina códigos numéricos, caracteres extraños y espacios extra, pero mantén el texto descriptivo del ticket.
6. Los precios deben ser números con máximo 2 decimales, nunca strings.

Responde ÚNICAMENTE con este JSON (sin texto adicional):
{
  "modified_items": [ { "id": "uuid-existente", "name": "Nombre", "price": 1.23 } ],
  "new_items": [ { "name": "Nombre", "price": 4.56 } ]
}
Si no hay nada, devuelve: {"modified_items": [], "new_items": []}`;

  const request = {
    contents: [{role: "user", parts: [{text: prompt}]}],
  };

  const response = await generativeModel.generateContent(request);
  const geminiResponse = response.response.candidates[0].content.parts[0].text.trim();

  try {
    return JSON.parse(geminiResponse);
  } catch (jsonError) {
    const cleanedResponse = geminiResponse.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(cleanedResponse);
    } catch (e2) {
      const jsonStart = geminiResponse.indexOf("{");
      const jsonEnd = geminiResponse.lastIndexOf("}") + 1;
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        return JSON.parse(geminiResponse.substring(jsonStart, jsonEnd));
      }
      return {modified_items: [], new_items: []};
    }
  }
}

module.exports = {processWithGemini};
