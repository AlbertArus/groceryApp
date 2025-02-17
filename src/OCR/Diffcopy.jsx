// export function compararPrecios(text, lista) {
//     if(!text) return
//     console.log(text)
   
//     // Obtener precios de la app
//     const obtenerPreciosLista = () => {
//         return lista.categories.flatMap(category =>
//             category.items.map(item => ({
//                 id: item.id,
//                 name: item.name,
//                 price: item.price
//             })
//             )
//         )
//     }
//     obtenerPreciosLista()
//     const itemsToCompare = obtenerPreciosLista()

//     const obtenerPreciosTicket = () => {
//         const lineas = text.split("\n")
//         itemsToCompare.forEach(item => {
//             const regex = new RegExp(`\\b${item.name.replace(/\s+/g, "\\s+")}\\b`, "i");
//             const lineaEncontrada = lineas.find(linea => regex.test(linea)); 
//             console.log(`Buscando producto: "${item.name}" con regex: ${regex}`);

//             if (lineaEncontrada) {
//                 console.log(`Producto encontrado: ${item.name}`);
//                 console.log(`precio de producto encontrado: ${item.price}`)

//                 // Buscar el número que represente el precio en la misma línea o en la siguiente
//                 const index = lineas.indexOf(lineaEncontrada);
//                 const posiblesPrecios = [...lineaEncontrada.matchAll(/[$€]?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?/g)].map(match => parseFloat(match[0]));
//                 console.log(lineaEncontrada)
                
//                 if (posiblesPrecios.length === 0 && index + 1 < lineas.length) {
//                     // Si no hay precios en la misma línea, buscar en la siguiente
//                     posiblesPrecios.push(...[...lineas[index + 1].matchAll(/\d+(\.\d{1,2})?/g)].map(match => parseFloat(match[0])));
//                 }
//                 console.log(posiblesPrecios)

//                 if (posiblesPrecios.length > 0) {
//                     console.log(`Precio encontrado en ticket: ${posiblesPrecios[0]}, reemplazando por: ${item.price}`);
//                     item.precio = item.price; // Aquí puedes asignarle el nuevo precio de la lista
//                 }
//             }
//         })
//     }
//     obtenerPreciosTicket()
// }

// export function compararPrecios(text, lista) {
//     console.log(text)
//     if (!text) return;

//     const obtenerPreciosLista = () => {
//         return lista.categories.flatMap(category =>
//             category.items.map(item => ({
//                 id: item.id,
//                 name: item.name,
//                 price: item.price
//             }))
//         );
//     };

//     const itemsToCompare = obtenerPreciosLista();

//     function escaparCaracteresEspeciales(texto) {
//         return texto.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
//     }

    // const obtenerPreciosTicket = () => {
    //     const lineas = text.split("\n");

    //     itemsToCompare.forEach(item => {
    //         const nombreEscapado = escaparCaracteresEspeciales(item.name);
    //         // Regex más flexible, incluye caracteres especiales y busca palabras completas o parte de ellas
    //         const regex = new RegExp(`\\b${nombreEscapado}\\b`, "i");
    //         const lineaEncontrada = lineas.find(linea => regex.test(linea));

    //         if (lineaEncontrada) {
    //             console.log(`Producto encontrado: ${item.name}`);
    //             console.log(`precio de producto encontrado: ${item.price}`);

    //             // Buscar el precio en la misma línea y hasta 2 líneas abajo
    //             let posiblesPrecios = [];
    //             for (let i = 0; i < 10 && i + lineas.indexOf(lineaEncontrada) < lineas.length; i++) {
    //                 const lineaActual = lineas[lineas.indexOf(lineaEncontrada) + i]
    //                 posiblesPrecios.push(...extraerPrecios(lineaActual))
    //             }

    //             if (posiblesPrecios.length === 0) {
    //                 console.log(`No se encontró precio para ${item.name}`);
    //                 return
    //             }

    //             // Si se encuentran varios precios, puedes elegir el más cercano al nombre del producto o usar otro criterio
    //             const precioEncontrado = posiblesPrecios[0];
    //             console.log(`Precio encontrado en ticket: ${precioEncontrado}, reemplazando por: ${item.price}`);
    //             item.precio = item.price;
    //         }
    //     });
    // };

    // const extraerPrecios = (linea) => {
    //     // Regex para extraer precios en diferentes formatos, incluyendo símbolos de moneda y separadores de miles
    //     const regexPrecios = /[$€]?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?/g;
    //     return [...linea.matchAll(regexPrecios)].map(match => parseFloat(match[0].replace(/[.,]/g, '')));
    // }

    // obtenerPreciosTicket();