export function compararPrecios(text, raw, lista) {
    console.log(raw)
    console.log("=== DEBUG INICIO ===");
    console.log("1. Texto recibido (raw):", text);
    
    // Si text ya es un objeto (porque viene como data.text del servidor)
    let parsedText = text;
    
    // Asegurarnos de que tenemos la estructura correcta
    if (!parsedText || !parsedText.items) {
        console.log("Error: No hay items válidos para comparar");
        return;
    }

    if (!lista?.categories) {
        console.log("Error: lista no tiene categories");
        return;
    }

    // Obtener items para comparar
    const itemsToCompare = lista.categories.flatMap(category =>
        category.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price
        }))
    );
    console.log("2. Items para comparar:", itemsToCompare);

    // Realizar comparación
    parsedText.items.forEach(ticketItem => {
        console.log("3. Procesando item del ticket:", ticketItem);
        
        const normalizedTicketDesc = ticketItem.description
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
            
        console.log("4. Descripción normalizada:", normalizedTicketDesc);
        
        const matchedItem = itemsToCompare.find(item => {
            const normalizedItemName = item.name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();
            
            console.log(`5. Comparando con [${normalizedItemName}]`);
            
            // Comparación más flexible
            const isMatch = 
                normalizedItemName.includes(normalizedTicketDesc) || 
                normalizedTicketDesc.includes(normalizedItemName) ||
                normalizedTicketDesc.split(' ').some(word => 
                    normalizedItemName.includes(word) && word.length > 3
                );
            
            if (isMatch) {
                console.log(`   Match encontrado entre [${normalizedTicketDesc}] y [${normalizedItemName}]`);
            }
            
            return isMatch;
        });

        if (matchedItem) {
            console.log(`✅ Match encontrado:`);
            console.log(`   Producto: ${matchedItem.name}`);
            console.log(`   Precio en ticket: ${ticketItem.price}`);
            console.log(`   Precio en lista: ${matchedItem.price}`);
            
            // Aquí podrías agregar lógica adicional para manejar el match
            // Por ejemplo, guardar los matches en un array o actualizar el UI
            
        } else {
            console.log(`❌ No se encontró match para: ${ticketItem.description}`);
        }
    });
    
    console.log("=== DEBUG FIN ===");
}