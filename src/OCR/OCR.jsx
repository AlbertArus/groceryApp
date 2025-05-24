import { useState, useEffect } from "react";
import Modal from "../ui-components/Modal";
import NewCategory from "../components/NewCategory";
import { Checkbox } from "@mui/material";

function OCR({ image, setImage, lista, EditItem, AddMultipleItems, AddCategory }) {
    const [text, setText] = useState('');
    const [geminiResults, setGeminiResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState(lista.categories.length > 0 ? lista.categories[0].id : "")

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

                const response = await fetch('https://5b9b-83-50-98-42.ngrok-free.app/api/ocr', {
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
            {isModalOpen && (
            <Modal
                title={loading || !text || error ? "" : "Confirma los nuevos datos"}
                subtitle={loading || !text || error ? "" : "Edita tu lista con los items nuevos y actualizados"}
                closeOnClick={() => setIsModalOpen(false)}
                overlayOnClick={() => setIsModalOpen(false)}
            >
                {loading ? (
                    <div className="loading-message">Estamos validando tu ticket...</div>
                ) : (
                    <>
                        {error && <div className="error-message">{error}</div>}
                        {!text && (
                            <div>No se ha encontrado texto en tu imagen</div>
                        )}
                        {text && (
                            <div className="results-container">
                                {geminiResults && (
                                    step===1 ? (
                                        <div className="modified-items">
                                            <h4 style={{textDecoration: "underline", paddingBottom: "12px"}}>(1/3) Selecciona la categoría</h4>
                                            {lista.categories.length > 0 && lista.categories.map((category, index) => (
                                                <>
                                                    <div className="categoriesLista fila-start" style={{padding: "5px 0px"}} key={category.id} >
                                                        <Checkbox 
                                                        checked={selectedCategory === category.id}
                                                        onChange={() => setSelectedCategory(category.id)}
                                                        sx={{
                                                        '&.Mui-checked': {
                                                            color: "green"
                                                        },
                                                        '&:not(.Mui-checked)': {
                                                            color: "#9E9E9E"
                                                        },
                                                        '&.Mui-checked + .MuiTouchRipple-root': {
                                                            backgroundColor: "green"
                                                        },
                                                        padding: "0px",
                                                        cursor: "pointer"
                                                        }}
                                                        />  
                                                        <h4 style={{marginLeft: "10px"}}>{`${category.categoryName.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}`}</h4>
                                                    </div>
                                                </>
                                            ))}
                                            <div className="newcategoryLista" style={{marginRight: "-3px"}}>
                                                <NewCategory
                                                    AddCategory={AddCategory}
                                                />
                                            </div>
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
                                    ) : (step === 2 ? (
                                        <div className="modified-items">
                                            <h4 style={{textDecoration: "underline", paddingBottom: "12px"}}>(2/3) Revisa tus items modificados</h4>
                                            {geminiResults.modified_items.map(item => (
                                                <h4 key={item.name} className="fila-between">{`${item.name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())} - ${item.price} €`}</h4>
                                                ))
                                            }
                                            <div className="fila-between" style={{gap: "25px"}}>
                                                <button className="buttonMain" onClick={() => setStep(1)}><span className="material-symbols-outlined icon-small">arrow_back</span></button>
                                                <div className="fila-between" style={{gap: "8px"}}>
                                                    <h5 className="buttonMain" style={{flexGrow: "1"}} onClick={() => {
                                                        geminiResults.modified_items.forEach(item => {
                                                            EditItem(item.id, item.name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()), item.price);
                                                            console.log("edit:", item.price, item.name)
                                                        });
                                                        setStep(3)
                                                        }}
                                                    >
                                                        Actualizar items
                                                    </h5>
                                                    <h5 className="buttonMain" style={{flexGrow: "1"}} onClick={() => setIsModalOpen(false)}>Descartar</h5>
                                                </div>
                                                <button className="buttonMain" onClick={() => setStep(3)}><span className="material-symbols-outlined icon-small">arrow_forward</span></button>
                                            </div>
                                        </div>
                                    ) :  (
                                        <div className="new-items">
                                            <h4 style={{textDecoration: "underline", paddingBottom: "12px"}}>(3/3) Revisa tus nuevos items</h4>
                                            {geminiResults.new_items.map(item => (
                                                <h4 key={item.name} className="fila-between">{`${item.name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())} - ${item.price} €`}</h4>
                                                ))
                                            }
                                            <div className="fila-between" style={{gap: "25px"}}>
                                                <button className="buttonMain" onClick={() => setStep(2)}><span className="material-symbols-outlined icon-small">arrow_back</span></button>
                                                <div className="fila-between" style={{gap: "8px"}}>
                                                    <h5 className="buttonMain" style={{flexGrow: "1"}}
                                                    onClick={() => {geminiResults.new_items.forEach(item => {
                                                            const formattedItems = geminiResults.new_items.map(item => ({
                                                                ...item,
                                                                name: item.name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
                                                            }));
                                                            AddMultipleItems(formattedItems, selectedCategory);
                                                            }); setIsModalOpen(false)}}
                                                    >
                                                        Añadir items                                       
                                                    </h5>
                                                    <h5 className="buttonMain" onClick={() => setIsModalOpen(false)}>Descartar</h5>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}
            </Modal>
            )}
        </div>
    )
}

export default OCR;