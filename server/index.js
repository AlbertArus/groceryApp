require('dotenv').config({ path: '../.env.development' });
const express = require('express');
const cors = require('cors');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// let credentials;
// try {
//   credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
// } catch (error) {
//   console.error("Error parsing credentials:", error);
//   process.exit(1);
// }

const credentials = require("../groceryapp-dev-e8e3f-b12dda12e904.json")
const client = new ImageAnnotatorClient({ credentials });

console.log(client)

app.post('/api/ocr', async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    const imageBase64 = req.body.image; // Ya viene sin el prefijo desde el cliente
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    console.log("Base64 Image:", imageBase64); // Imprime la cadena base64 en la consola
    // console.log("Image Buffer:", imageBuffer);

    const [result] = await client.textDetection({
      image: {
        content: imageBuffer,
      },
    });

    if (!result.textAnnotations || result.textAnnotations.length === 0) {
      return res.json({ text: '' });
    }

    const extractedText = result.textAnnotations[0].description;
    res.json({ text: extractedText });
    console.log("Image received");
    res.status(200).send("Image received correctly");
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ 
      error: error.message || 'OCR failed',
      details: error.details || 'No additional details available'
    });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});