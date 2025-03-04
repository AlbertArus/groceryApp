// Funciones auxiliares mejoradas
const normalizeText = (text) => {
    return text
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^[\d\s]+/, '')
        .replace(/[\d\s]+$/, '')
        .replace(/[*]+$/, ''); // Elimina asteriscos al final
};

const normalizeNumber = (value) => {
    if (typeof value === 'string') {
        return parseFloat(value.replace(',', '.'));
    }
    return value;
};

const extractNumber = (text) => {
    const match = text.match(/(\d+[.,]\d{2})/);
    return match ? normalizeNumber(match[1]) : null;
};

const extractQuantity = (text) => {
    const patterns = [
        /(\d+)\s*(?:ud|unid|unidades|x)/i,
        /^(\d+)\s+/
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return parseInt(match[1]);
        }
    }
    return 1;
};

const extractUnitPrice = (text) => {
    const patterns = [
        /(\d+[.,]\d{2})€?\/ud/i,
        /x\s*(\d+[.,]\d{2})€?\s*(?:\/|per|ud)/i,
        /(\d+[.,]\d{2})€/
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return normalizeNumber(match[1]);
        }
    }
    return null;
};

const isValidItem = (item) => {
    const invalidKeywords = [
        'total', 'subtotal', 'iva', 'pagar', 'efectivo', 'tarjeta', 'cambio', 'canvi',
        'descuento', 'dto', 'factura', 'ticket', 'ref', 'número', 'fecha', 'hora',
        'caja', 'vendedor', 'nif', 'cif', 'dni', 'cod', 'código', 'control',
        'client', 'club', 'dtes', 'acumulats', 'mble', 'import', 'descripció'
    ];
    
    if (!item.description || !item.price) return false;
    
    const descriptionLower = item.description.toLowerCase();
    if (invalidKeywords.some(keyword => descriptionLower.includes(keyword))) return false;
    
    const cleanDescription = item.description.replace(/[0-9\s\W]/g, '');
    if (cleanDescription.length === 0) return false;
    
    if (item.price <= 0 || item.price > 1000) return false;
    
    return true;
};

const isDiscount = (text, amount) => {
    const discountPatterns = [
        /desc|dto|descompte|feliz|rebaja/i,
        /^-\d/,
        /-\d+[.,]\d{2}€?$/
    ];
    
    return amount < 0 || discountPatterns.some(pattern => pattern.test(text));
};

export function parseTextToStructuredData(text) {
    console.log("=== INICIO PARSING ===");
    console.log("Texto recibido:\n", text);
    
    const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 1);
    
    console.log("Líneas procesadas:", lines);
    
    const result = {
        metadata: {
            store: null,
            storeName: null,
            nif: null,
            date: null,
            time: null,
            ticketNumber: null
        },
        items: [],
        discounts: [],
        totals: {
            subtotal: null,
            total: null,
            tax: null
        }
    };

    // Patrones mejorados
    const patterns = {
        nif: [
            /(?:CIF|NIF):\s*([A-Z0-9-]+)/i,
            /(?:CIF|NIF)[A-Z]-(\d{8})/i,
            /\(CIF\s+([A-Z0-9-]+)\)/i,
            /CIF\s+([A-Z]\s*\d{8})/i,
            /[A-Z]-(\d{8})/
        ],
        datetime: [
            /(\d{2}\/\d{1,2}\/\d{2,4})\s*(\d{2}:\d{2}(?::\d{2})?)/,
            /(\d{2}[-/]\d{1,2}[-/]\d{2,4})\s+(\d{2}:\d{2})/,
            /(\d{2}:\d{2}(?::\d{2})?)/
        ],
        ticketNumber: [
            /Factura:\s*([A-Z0-9-]+)/i,
            /TICKET[:\s]+([A-Z0-9-]+)/i,
            /N[º°]?\s*Ticket:\s*([A-Z0-9-]+)/i
        ],
        total: [
            /TOTAL\s*(?:A\s*PAGAR)?[:\s]+(\d+[.,]\d{2})/i,
            /A\s*PAGAR[:\s]+(\d+[.,]\d{2})/i,
            /TOTAL.*?(\d+[.,]\d{2})/i
        ],
        tax: [
            /IVA\s*(\d+(?:[.,]\d+)?)\s*%/i,
            /(\d+(?:[.,]\d+)?)\s*%\s*IVA/i
        ]
    };

    // Identificar tienda primero
    const storePatterns = [
        { pattern: /mcdonalds|mcdonald/i, name: "McDonald's" },
        { pattern: /corte\s+ingles/i, name: "El Corte Inglés" },
        { pattern: /caprabo/i, name: "Caprabo" },
        { pattern: /sirena/i, name: "La Sirena" }
    ];

    for (const { pattern, name } of storePatterns) {
        if (pattern.test(text)) {
            result.metadata.storeName = name;
            break;
        }
    }

    let currentItem = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const nextLine = lines[i + 1] || '';
        const prevLine = lines[i - 1] || '';

        // Metadata
        for (const [key, patternList] of Object.entries(patterns)) {
            for (const pattern of patternList) {
                const match = line.match(pattern);
                if (match) {
                    switch (key) {
                        case 'nif':
                            result.metadata.nif = match[1];
                            break;
                        case 'datetime':
                            if (match[1] && !result.metadata.date) result.metadata.date = match[1];
                            if (match[2] && !result.metadata.time) result.metadata.time = match[2];
                            break;
                        case 'ticketNumber':
                            result.metadata.ticketNumber = match[1];
                            break;
                        case 'total':
                            result.totals.total = normalizeNumber(match[1]);
                            break;
                        case 'tax':
                            result.totals.tax = normalizeNumber(match[1]);
                            break;
                    }
                }
            }
        }

        // Procesar items y descuentos
        const price = extractNumber(line);
        if (price !== null) {
            const quantity = extractQuantity(line);
            const unitPrice = extractUnitPrice(line) || (price / quantity);
            
            // Buscar descripción en líneas anteriores
            let description = '';
            for (let j = i - 1; j >= 0 && j >= i - 2; j--) {
                const prevLine = lines[j];
                if (prevLine && !extractNumber(prevLine)) {
                    description = normalizeText(prevLine);
                    break;
                }
            }

            if (description) {
                const item = {
                    description,
                    quantity,
                    unitPrice,
                    price
                };

                if (isDiscount(line, price)) {
                    result.discounts.push({
                        description,
                        amount: price
                    });
                } else if (isValidItem(item)) {
                    result.items.push(item);
                }
            }
        }
    }

    // Calcular subtotal si no se encontró
    if (!result.totals.subtotal && result.items.length > 0) {
        result.totals.subtotal = result.items.reduce((sum, item) => sum + item.price, 0);
    }

    console.log("=== RESULTADO PARSING ===");
    console.log(JSON.stringify(result, null, 2));
    
    return result;
}