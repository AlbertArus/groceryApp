import { useState, useEffect } from "react";
import Modal from "../ui-components/Modal";

function OCR({ image, setImage, lista, EditItem, AddMultipleItems }) {
    const [text, setText] = useState('');
    const [geminiResults, setGeminiResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)

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
                setIsModalOpen(true)
                
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
                    {/* <button 
                        onClick={realizarOCR}
                        disabled={!image}
                        className="ocr-button"
                    >
                        Realizar OCR
                    </button> */}                    
                    {text && isModalOpen && (
                        <div className="results-container">
                            {geminiResults && (
                                <>
                                    <Modal
                                        title={"Confirma los nuevos datos"}
                                        subtitle={"Edita tu lista con los items nuevos y actualizados"}
                                        closeOnClick={() => setIsModalOpen(false)}
                                    >
                                        {step===1 ? (
                                            <div className="modified-items">
                                                <h4 style={{textDecoration: "underline", paddingBottom: "12px"}}>Productos modificados</h4>
                                                {geminiResults.modified_items.map(item => (
                                                    <h4 key={item.name} className="fila-between">{`${item.name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())} - ${item.price} €`}</h4>
                                                    ))
                                                }
                                                <div className="fila-between" style={{gap: "25px"}}>
                                                    <div className="fila-between" style={{gap: "8px"}}>
                                                        <h5 className="buttonMain" style={{flexGrow: "1"}} onClick={() => {
                                                            geminiResults.modified_items.forEach(item => {
                                                                EditItem(item.id, item.name, item.price);
                                                                console.log("edit:", item.price, item.name)
                                                            });
                                                            setStep(2)
                                                            }}
                                                        >
                                                            Actualizar items
                                                        </h5>
                                                        <h5 className="buttonMain" style={{flexGrow: "1"}} onClick={() => setIsModalOpen(false)}>Descartar</h5>
                                                    </div>
                                                    <button className="buttonMain" onClick={() => setStep(2)}><span className="material-symbols-outlined icon-small">arrow_forward</span></button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="new-items">
                                                <h4 style={{textDecoration: "underline", paddingBottom: "12px"}}>Productos nuevos</h4>
                                                {geminiResults.new_items.map(item => (
                                                    <h4 key={item.name} className="fila-between">{`${item.name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())} - ${item.price} €`}</h4>
                                                    ))
                                                }
                                                <div className="fila-between" style={{gap: "25px"}}>
                                                    <button className="buttonMain" onClick={() => setStep(1)}><span className="material-symbols-outlined icon-small">arrow_back</span></button>
                                                    <div className="fila-between" style={{gap: "8px"}}>
                                                        <h5 className="buttonMain" style={{flexGrow: "1"}}
                                                        onClick={() => {
                                                            geminiResults.new_items.forEach(item => {
                                                                AddMultipleItems(geminiResults.new_items, lista.categories[0].id)
                                                            });
                                                            }}
                                                        >
                                                            Añadir items                                       
                                                        </h5>
                                                        <h5 className="buttonMain" onClick={() => setIsModalOpen(false)}>Descartar</h5>
                                                    </div>
                                                </div>
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