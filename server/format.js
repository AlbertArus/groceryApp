const normalizeText = (text) => {
    return text
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^[\d\s]+/, '')
        .replace(/[\d\s]+$/, '')
        .replace(/[*]+$/, '');
};

const normalizeNumber = (value) => {
    if (typeof value === 'string') {
        return parseFloat(value.replace(',', '.'));
    }
    return value;
};

const extractNumber = (text) => {
    const match = text.match(/(\d+[.,]\d{2})€?/);
    return match ? normalizeNumber(match[1]) : null;
};

const findQuantityInText = (text) => {
    // Enhanced patterns to detect quantities
    const patterns = [
        /^(\d+)\s+/,
        /^(\d+)\s*(?:ud|unid|unidades|x)/i,
        /(\d+)\s*(?:ud|unid|unidades)\s*x/i,
        /^(\d+)$/,
        /\s(\d+)\s*$/,  // Number at the end of text
        /\s(\d+)\s+(?=[A-Za-z])/  // Number followed by text
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            const qty = parseInt(match[1]);
            return qty > 0 ? qty : null;
        }
    }
    return null;
};

const extractQuantity = (text, prevLines, nextLines = []) => {
    // First check current line
    const quantity = findQuantityInText(text);
    if (quantity) {
        return {
            quantity,
            remainingText: text.replace(/^\d+\s*(?:ud|unid|unidades|x)?\s*/i, '')
                              .replace(/\s+\d+\s*$/, '')  // Remove trailing quantity
                              .trim()
        };
    }

    // Check previous lines
    for (let i = prevLines.length - 1; i >= Math.max(0, prevLines.length - 3); i--) {
        const prevQuantity = findQuantityInText(prevLines[i]);
        if (prevQuantity) {
            return {
                quantity: prevQuantity,
                remainingText: text
            };
        }
    }

    // Check next lines
    for (let i = 0; i < Math.min(nextLines.length, 2); i++) {
        const nextQuantity = findQuantityInText(nextLines[i]);
        if (nextQuantity && !extractNumber(nextLines[i])) {
            return {
                quantity: nextQuantity,
                remainingText: text
            };
        }
    }

    return {
        quantity: 1,
        remainingText: text
    };
};

const extractUnitPrice = (text) => {
    const patterns = [
        /(\d+[.,]\d{2})€?\/ud/i,
        /x\s*(\d+[.,]\d{2})€?\s*(?:\/|per|ud)/i,
        /ud\s*x\s*(\d+[.,]\d{2})€?/i,
        /(\d+[.,]\d{2})€?\s*\/\s*unidad/i,
        /\s(\d+[.,]\d{2})€?\s*$/  // Price at end of text
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return normalizeNumber(match[1]);
        }
    }
    
    return null;
};

const extractTotalPrice = (text) => {
    const patterns = [
        /(\d+[.,]\d{2})€?\s*$/,
        /\s(\d+[.,]\d{2})€?$/,
        /total\s*(\d+[.,]\d{2})€?/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            return normalizeNumber(match[1]);
        }
    }
    
    return null;
};

const calculatePrices = (quantity, unitPrice, totalPrice) => {
    if (totalPrice && !unitPrice) {
        // If we only have total price, calculate unit price
        return {
            unitPrice: parseFloat((totalPrice / quantity).toFixed(2)),
            totalPrice: parseFloat(totalPrice.toFixed(2))
        };
    }
    
    if (unitPrice && !totalPrice) {
        // If we only have unit price, calculate total
        return {
            unitPrice: parseFloat(unitPrice.toFixed(2)),
            totalPrice: parseFloat((quantity * unitPrice).toFixed(2))
        };
    }
    if (unitPrice && totalPrice) {
        // If we have both, prefer calculating total from unit price and quantity
        return {
            unitPrice: parseFloat(unitPrice.toFixed(2)),
            totalPrice: parseFloat((quantity * unitPrice).toFixed(2))
        };
    }
    
    return null;
};

const findDescription = (currentLine, prevLines) => {
    // First try using current line if it's not a price
    if (currentLine && !extractNumber(currentLine)) {
        const { remainingText } = extractQuantity(currentLine, prevLines);
        if (remainingText && remainingText.length > 1) {
            return normalizeText(remainingText);
        }
    }

    // Look in previous lines
    for (let i = prevLines.length - 1; i >= 0; i--) {
        const prevLine = prevLines[i];
        if (prevLine && 
            !extractNumber(prevLine) && 
            !prevLine.match(/^\d+$/) &&
            !prevLine.includes('DESCRIPCIÓ') && 
            !prevLine.includes('IMPORT')) {
            const { remainingText } = extractQuantity(prevLine, prevLines.slice(0, i));
            if (remainingText && remainingText.length > 1) {
                return normalizeText(remainingText);
            }
        }
    }
    return '';
};

const isValidItem = (item) => {
    const invalidKeywords = [
        'total', 'subtotal', 'iva', 'pagar', 'efectivo', 'efectiu', 'tarjeta', 'cambio', 'canvi',
        'descuento', 'dto', 'factura', 'ticket', 'ref', 'número', 'fecha', 'hora',
        'caja', 'vendedor', 'nif', 'cif', 'dni', 'cod', 'código', 'control',
        'client', 'club', 'dtes', 'acumulats', 'mble', 'import', 'descripció',
        'tipus', 'base', 'quota', 'cupo', 'prove', 'saldo', 'disponible'
    ];
    
    if (!item.description || !item.price) return false;
    
    const descriptionLower = item.description.toLowerCase();
    
    if (descriptionLower.includes('efectiu') || 
        descriptionLower.includes('cupo') || 
        descriptionLower.includes('proveidor')) {
        return false;
    }
    
    if (invalidKeywords.some(keyword => descriptionLower.includes(keyword))) return false;
    
    const cleanDescription = item.description.replace(/[0-9\s\W]/g, '');
    if (cleanDescription.length === 0) return false;
    
    if (item.price <= 0 || item.price > 1000) return false;
    
    return true;
};

const isDiscount = (text, amount) => {
    const discountPatterns = [
        /^-\d/,
        /-\d+[.,]\d{2}€?$/,
        /\bdesc(?:uento)?\b|\bdto\b|\bdescompte\b/i,
        /^dto\b|^desc\b/i
    ];
    
    return (amount < 0 || discountPatterns.some(pattern => pattern.test(text)));
};

const processItemLine = (line, prevLines, nextLines = []) => {
    // Extract quantity first considering both previous and next lines
    const { quantity, remainingText } = extractQuantity(line, prevLines, nextLines);
    
    // Extract prices
    const foundUnitPrice = extractUnitPrice(remainingText || line);
    const foundTotalPrice = extractTotalPrice(remainingText || line);
    
    if (!foundTotalPrice && !foundUnitPrice) return null;
    const prices = calculatePrices(quantity, foundUnitPrice, foundTotalPrice);
    if (!prices) return null;
    const description = findDescription(remainingText || line, prevLines);
    if (!description) return null;
    // Now we return all values: description, quantity, unit price, and total price
    return {
        description,
        quantity,
        unitPrice: prices.unitPrice,
        price: prices.totalPrice    // This is now quantity * unitPrice
    };
};

const mergeItems = (items) => {
    const mergedItems = new Map();
    
    for (const item of items) {
        const key = item.description.toLowerCase();
        if (mergedItems.has(key)) {
            const existing = mergedItems.get(key);
            existing.quantity += item.quantity;
            existing.price = parseFloat((existing.quantity * existing.unitPrice).toFixed(2));
        } else {
            mergedItems.set(key, {...item});
        }
    }
    
    return Array.from(mergedItems.values());
};

export function parseTextToStructuredData(text) {
    const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 1);
    
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

    const patterns = {
        nif: [
            /(?:CIF|NIF):\s*([A-Z0-9-]+)/i,
            /(?:CIF|NIF)[A-Z]-(\d{8})/i,
            /\(CIF\s+([A-Z0-9-]+)\)/i,
            /CIF\s+([A-Z]\s*\d{8})/i,
            /[A-Z]-(\d{8})/
        ],
        datetime: [
            /(\d{2}[-/]\d{2}[-/]\d{4})\s*(\d{2}:\d{2}(?::\d{2})?)/,
            /(\d{2}[-/]\d{2}[-/]\d{2,4})\s+(\d{2}:\d{2})/,
            /(\d{2}:\d{2}(?::\d{2})?)/
        ],
        ticketNumber: [
            /Factura:\s*([A-Z0-9-]+)/i,
            /TICKET[:\s]+([A-Z0-9-]+)/i,
            /N[º°]?\s*Ticket:\s*([A-Z0-9-]+)/i
        ]
    };

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

    const tempItems = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const prevLines = lines.slice(0, i);
        const nextLines = lines.slice(i + 1, i + 3);  // Look ahead up to 2 lines

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
                    }
                }
            }
        }

        const item = processItemLine(line, prevLines, nextLines);
        if (item) {
            if (isDiscount(line, item.price)) {
                result.discounts.push({
                    description: item.description,
                    amount: Math.abs(item.price)
                });
            } else if (isValidItem(item)) {
                tempItems.push(item);
            }
        }
    }

    // Merge items with same description
    result.items = mergeItems(tempItems);

    // Calculate subtotal from valid items only
    if (!result.totals.subtotal && result.items.length > 0) {
        result.totals.subtotal = parseFloat(
            result.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)
        );
    }
    
    return result;
}