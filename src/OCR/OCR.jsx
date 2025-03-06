import { useState } from "react";
import { useEffect } from "react";
import { compararPrecios } from "./DiferenciaPrecios";

function OCR({ image, setImage, lista }) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (image) {
            realizarOCR();
        } else {
            console.log("No hay imagen");
        }
    }, [image]);

    const realizarOCR = async () => {
        if (!image) {
            alert('Por favor, selecciona una imagen.');
            return;
        }
        console.log("inicio OCR")
        setLoading(true);
        try {
            if (typeof image === 'string') {
                console.log("=== OCR DEBUG ===");
                console.log("1. Iniciando OCR");
                const base64Data = image.split(',')[1];

                console.log("2. Enviando petición a OCR API");
                const response = await fetch('https://7f33-83-50-183-163.ngrok-free.app/api/ocr', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image: base64Data }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
                }

                const data = await response.json();
                console.log("3. Respuesta del servidor:", data);
                console.log("4. Tipo de data.text:", typeof data.text);
                console.log("5. Contenido de data.text:", data.text);
                
                setText(data.text);
                console.log("6. Estado text actualizado");

            } else {
                console.error("Image no es un string");
            }

        } catch (error) {
            console.error('Error al realizar OCR:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (text) {
            console.log("7. Llamando a compararPrecios con text:", text);
            compararPrecios(text, lista);
        }
    }, [text, lista]);

    return (
        <div>
            {loading ? (
                <div>Estamos validando tu ticket</div>
            ) : (
                <>
                    <button onClick={() => realizarOCR()}>Realizar OCR</button>
                    <pre>Texto extraído: {JSON.stringify(text, null, 2)}</pre>
                </>
            )}
        </div>
    );
}

export default OCR;