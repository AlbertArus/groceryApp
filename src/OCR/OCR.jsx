import { useState } from 'react';
import { VisionClient } from '@google-cloud/vision';
import { convertirImagenABase64 } from '../functions/ConversorImagen';

function OCR({ image, setImage }) {
  const [text, setText] = useState('');

  const manejarSeleccionImage = (event) => {
    const archivo = event.target.files[0];
    setImage(archivo);
  };

  const realizarOCR = async () => {
    if (!image) {
      alert('Por favor, selecciona una image.');
      return;
    }

    try {
      const credentials = JSON.parse(process.env.REACT_APP_GOOGLE_APPLICATION_CREDENTIALS);
      const client = new VisionClient({ credentials });

      const imageBase64 = await convertirImagenABase64(image);

      const [result] = await client.textDetection({
        image: {
          content: imageBase64,
        },
      });

      const detections = result.textAnnotations;
      const extractedText = detections.map((detection) => detection.description).join(' ');

      setText(extractedText);
    } catch (error) {
      console.error('Error al realizar OCR:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={manejarSeleccionImage} />
      <button onClick={realizarOCR}>Realizar OCR</button>
      <p>Texto extraído: {text}</p>
    </div>
  );
}

export default OCR;