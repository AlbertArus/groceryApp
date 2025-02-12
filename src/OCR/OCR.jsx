import { useEffect, useState } from 'react';

function OCR({ image, setImage }) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    console.log(image)

    useEffect(() => {
        if (image) {
            realizarOCR();
        } else {
            console.log("no hay imagen");
        }
    }, [image]);

    const realizarOCR = async () => {
        if (!image) {
            alert('Por favor, selecciona una imagen.');
            return;
        }
        setLoading(true);
        try {
            if (typeof image === 'string') {
                const base64Data = image.split(',')[1]; // Separar el prefijo
                // console.log("Base64 Image:", base64Data); // Imprime la cadena base64 en la consola (corregido)

                const response = await fetch('http://localhost:5000/api/ocr', { // response declarado aquí
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image: base64Data }), // Usar base64Data
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
                }

                const data = await response.json();
                setText(data.text);

            } else {
                console.error("image is not a string");
            }

        } catch (error) {
            console.error('Error al realizar OCR:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading ? (
                <div> Estamos validando tu ticket </div>
            ) : (
                <>
                    <button onClick={() => realizarOCR()}>Realizar OCR</button>
                    <p>Texto extraído: {text}</p>
                </>
            )}
        </div>
    );
}

export default OCR;