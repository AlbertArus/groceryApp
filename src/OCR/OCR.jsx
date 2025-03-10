import { useState, useEffect } from "react";

function OCR({ image, setImage, lista }) {
    const [text, setText] = useState('');
    const [geminiResults, setGeminiResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (image) {
            realizarOCR();
        }
    }, [image]);

    const realizarOCR = async () => {
        if (!image) {
            setError('Por favor, selecciona una imagen.');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            if (typeof image === 'string') {
                const base64Data = image.split(',')[1];

                const response = await fetch('https://43af-83-50-183-163.ngrok-free.app/api/ocr', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image: base64Data, lista: lista }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error: ${response.status}, ${errorData.error || 'Error desconocido'}`);
                }

                const data = await response.json();
                
                // Actualizar todos los estados relevantes
                setText(data.text);
                setGeminiResults(data.geminiResults);
                
            } else {
                throw new Error("El formato de la imagen no es válido");
            }

        } catch (error) {
            console.error('Error al realizar OCR:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ocr-container">
            {loading ? (
                <div className="loading-message">Estamos validando tu ticket...</div>
            ) : (
                <>
                    {error && <div className="error-message">{error}</div>}
                    
                    <button 
                        onClick={realizarOCR}
                        disabled={!image}
                        className="ocr-button"
                    >
                        Realizar OCR
                    </button>
                    
                    {text && (
                        <div className="results-container">
                            <h3>Texto extraído:</h3>
                            <pre className="text-result">{text}</pre>
                            
                            {geminiResults && (
                                <div className="gemini-results">
                                    <h3>Resultados del análisis:</h3>
                                    <div className="modified-items">
                                        <h4>Productos modificados:</h4>
                                        <pre>{JSON.stringify(geminiResults.modified_items || [], null, 2)}</pre>
                                    </div>
                                    <div className="new-items">
                                        <h4>Productos nuevos:</h4>
                                        <pre>{JSON.stringify(geminiResults.new_items || [], null, 2)}</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default OCR;