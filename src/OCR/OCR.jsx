import { useState, useEffect } from "react";
import Modal from "../ui-components/Modal";

function OCR({ image, setImage, lista, EditItem, AddMultipleItems }) {
    const [text, setText] = useState('');
    const [geminiResults, setGeminiResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState(1)

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

                const response = await fetch('https://4945-83-50-183-163.ngrok-free.app/api/ocr', {
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

    console.log(lista)
    return (
        <div className="ocr-container">
            {loading ? (
                <div className="loading-message">Estamos validando tu ticket...</div>
            ) : (
                <>
                    {error && <div className="error-message">{error}</div>}
                    
                    {/* <button 
                        onClick={realizarOCR}
                        disabled={!image}
                        className="ocr-button"
                    >
                        Realizar OCR
                    </button> */}
                    
                    {text && (
                        <div className="results-container">
                            {geminiResults && (
                                <>
                                    <Modal
                                        title={"Confirma los datos"}
                                        subtitle={"Aquí puedes verificar los datos de los items actualizados y los nuevos"}
                                        // styleSpan={{display: "none"}}                                    
                                    >
                                        {step===1 ? (
                                            <div className="modified-items">
                                                <h4>Productos modificados:</h4>
                                                {geminiResults.modified_items.forEach(item => {
                                                    <div className="space-between">{`${item.name} - ${item.price}`}</div>;
                                                    })
                                                }
                                                <button className="buttonMain"
                                                onClick={() => {
                                                    geminiResults.modified_items.forEach(item => {
                                                        EditItem(item.id, item.name, item.price);
                                                        console.log("edit:", item.price, item.name)
                                                    });
                                                    setStep(2)
                                                    }}
                                                >
                                                    Actualizar
                                                </button>
                                                <button onClick={() => setStep(2)}></button>
                                            </div>
                                        ) : (
                                            <div className="new-items">
                                                <h4>Productos nuevos:</h4>
                                                {geminiResults.new_items.forEach(item => {
                                                    <div className="space-between">{`${item.name} - ${item.price}`}</div>;
                                                    })
                                                }
                                                <button onClick={() => setStep(1)}></button>
                                                <button
                                                onClick={() => {
                                                    geminiResults.new_items.forEach(item => {
                                                        AddMultipleItems(geminiResults.new_items, lista.categories[0].id)
                                                    });
                                                    }}
                                                >
                                                    Añadir                                            
                                                </button>                             
                                            </div>
                                        )}
                                    </Modal>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default OCR;