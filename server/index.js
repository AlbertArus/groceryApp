require('dotenv').config({ path: '../.env.development' });
const express = require('express');
const cors = require('cors');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const {parseTextToStructuredData} = require('./FormatTicket.js');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

const credentials = require("../groceryapp-dev-e8e3f-b12dda12e904.json")
const client = new ImageAnnotatorClient({ credentials });

app.post('/api/ocr', async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    const imageBase64 = req.body.image;
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    const [result] = await client.textDetection({
      image: {
        content: imageBuffer,
      },
    });

    if (!result.textAnnotations || result.textAnnotations.length === 0) {
      console.log("No text detected");
      return res.status(200).json({ text: '' });
    }

    const extractedText = result.textAnnotations[0].description;
    const structuredData = parseTextToStructuredData(extractedText);
    console.log("extractedText", extractedText)
    console.log("Structured data:", JSON.stringify(structuredData, null, 2));
    return res.status(200).json({ text: structuredData, raw: extractedText });

  } catch (error) {
    console.error('OCR error:', error);
    return res.status(500).json({ 
      error: error.message || 'OCR failed',
      details: error.details || 'No additional details available'
    });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});