const normalizeText = (text) => {
    return text.replace(/\s+/g, ' ').trim();
};

const normalizeNumber = (value) => {
    if (typeof value === 'string') {
        return parseFloat(value.replace(',', '.'));
    }
    return value;
};

const extractQuantityAndDescription = (text) => {
    // Pattern to match: quantity at start followed by description
    const match = text.match(/^(\d+)\s+(.*)/);
    if (match) {
        return {
            quantity: parseInt(match[1]),
            description: normalizeText(match[2])
        };
    }
    
    // Check for multiplier pattern: 2x3.95 or 4*1.25
    const multiplierMatch = text.match(/^(\d+)(?:x|\*)\s*(\d+[.,]\d{2})/);
    if (multiplierMatch) {
        return {
            quantity: parseInt(multiplierMatch[1]),
            description: "",  // Need to find description elsewhere
            unitPrice: normalizeNumber(multiplierMatch[2])
        };
    }
    
    // Default to quantity 1 if no match found
    return {
        quantity: 1,
        description: normalizeText(text)
    };
};

const extractPrices = (text) => {
    const prices = [];
    let match;
    const pricePattern = /(\d+[.,]\d{2})€?/g;
    
    while ((match = pricePattern.exec(text)) !== null) {
        prices.push(normalizeNumber(match[1]));
    }
    
    return prices;
};

const isExcludedItem = (description) => {
    const excludedTerms = [
        'canvi', 'cambio', 'total', 'subtotal', 'iva', 'pagar', 
        'efectivo', 'tarjeta', 'factura', 'ticket', 'ref', 
        'número', 'fecha', 'hora', 'devolución'
    ];
    
    return excludedTerms.some(term => 
        description.toLowerCase().includes(term)
    );
};

const isValidItem = (item) => {
    if (!item.description || !item.price) return false;
    
    if (isExcludedItem(item.description)) return false;
    
    const cleanDescription = item.description.replace(/[0-9\s\W]/g, '');
    if (cleanDescription.length === 0) return false;
    
    if (item.price <= 0 || item.price > 1000) return false;
    
    return true;
};

export function parseTextToStructuredData(text) {
    const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    
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

    // Extract store name
    const storePatterns = [
        { pattern: /mcdonalds|mcdonald/i, name: "McDonald's" },
        { pattern: /corte\s+ingles/i, name: "El Corte Inglés" },
        { pattern: /caprabo/i, name: "Caprabo" },
        { pattern: /sirena/i, name: "La Sirena" },
        { pattern: /eroski/i, name: "Eroski" },
        { pattern: /mercadona/i, name: "Mercadona" },
        { pattern: /dia/i, name: "Dia" },
        { pattern: /carrefour/i, name: "Carrefour" },
        { pattern: /lidl/i, name: "Lidl" },
        { pattern: /aldi/i, name: "Aldi" }
    ];

    for (const { pattern, name } of storePatterns) {
        if (pattern.test(text)) {
            result.metadata.storeName = name;
            break;
        }
    }

    // Extract metadata
    const patterns = {
        nif: /(?:CIF|NIF):\s*([A-Z0-9-]+)/i,
        date: /(\d{2}[-/]\d{2}[-/]\d{2,4})/,
        time: /(\d{2}:\d{2}(?::\d{2})?)/,
        ticketNumber: /Ticket[:\s]+([A-Z0-9-]+)/i
    };

    for (const line of lines) {
        for (const [key, pattern] of Object.entries(patterns)) {
            const match = line.match(pattern);
            if (match) {
                result.metadata[key] = match[1];
            }
        }
    }

    // Process items
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Skip lines that are too short or contain metadata keywords
        if (line.length < 3 || 
            /total\s+|subtotal\s+|iva\s+|pagar\s+|nif|cif|fecha|hora/i.test(line)) {
            continue;
        }
        
        // Extract quantity and description
        const extractResult = extractQuantityAndDescription(line);
        let { quantity, description, unitPrice } = extractResult;
        
        // If we found a multiplier pattern but no description, look in the previous line
        if (quantity > 1 && !description && i > 0) {
            description = normalizeText(lines[i-1]);
        }
        
        // Extract prices from current line
        let prices = extractPrices(line);
        
        // If we don't have enough price information, look ahead
        if (prices.length < 2 && i < lines.length - 1) {
            const nextLinePrices = extractPrices(lines[i+1]);
            if (nextLinePrices.length > 0) {
                prices = prices.concat(nextLinePrices);
                i++; // Skip the next line in next iteration
            }
        }
        
        // Determine unit price and total price
        let price;
        
        if (unitPrice && quantity) {
            // If we already extracted unit price from multiplier pattern (e.g., "2x3.95")
            price = unitPrice * quantity;
        } else if (prices.length >= 2) {
            // If we have two prices, correctly identify unit price and total price
            prices.sort((a, b) => a - b);
            
            // Check if larger price is approximately quantity * smaller price (within 5% tolerance)
            const calculatedTotal = prices[0] * quantity;
            const percentDiff = Math.abs((calculatedTotal - prices[1]) / prices[1]);
            
            if (percentDiff <= 0.05) {
                // The smaller price is likely the unit price
                unitPrice = prices[0];
                price = prices[1];
            } else {
                // The larger price might be unrelated or a different format
                // Let's assume the larger is total price and calculate unit price
                price = prices[1];
                unitPrice = parseFloat((price / quantity).toFixed(2));
            }
        } else if (prices.length === 1) {
            // If we have only one price and quantity > 1, need to determine if it's unit or total
            if (quantity > 1) {
                // Look for clues in the text if this is total price
                const hasTotal = /total|importe/i.test(line);
                
                if (hasTotal) {
                    price = prices[0];
                    unitPrice = parseFloat((price / quantity).toFixed(2));
                } else {
                    // Assume it's unit price if not indicated as total
                    unitPrice = prices[0];
                    price = parseFloat((unitPrice * quantity).toFixed(2));
                }
            } else {
                // For quantity = 1, unit price equals total price
                price = prices[0];
                unitPrice = price;
            }
        } else {
            // No price information found, skip this item
            continue;
        }
        
        if (description && price) {
            const item = {
                description,
                quantity,
                unitPrice,
                price: parseFloat(price.toFixed(2))
            };
            
            if (price < 0) {
                result.discounts.push({
                    description,
                    amount: Math.abs(price)
                });
            } else if (isValidItem(item)) {
                result.items.push(item);
            }
        }
    }

    // Calculate subtotal
    if (result.items.length > 0) {
        result.totals.subtotal = parseFloat(
            result.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)
        );
    }
    
    return result;
}