// Función cliente para comparar precios a través de la API
export async function compararPrecios(text, lista) {
    console.log("=== CLIENTE: Iniciando comparación de precios ===");
    
    if (!text || text.trim() === '') {
        console.log("Error: No hay texto válido para comparar");
        return { error: "No hay texto válido para comparar" };
    }

    if (!lista?.categories) {
        console.log("Error: lista no tiene categories");
        return { error: "Lista de productos inválida" };
    }

    try {
        // En lugar de llamar directamente, hacemos una petición API
        const response = await fetch('https://5d94-83-50-183-163.ngrok-free.app/api/compare-prices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, lista }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error API: ${response.status}, ${errorData.error || 'Error desconocido'}`);
        }

        const data = await response.json();
        console.log("Resultados obtenidos:", data);
        return data;
    } catch (error) {
        console.error('Error al comparar precios:', error);
        return { error: "Error: " + error.message };
    }
}