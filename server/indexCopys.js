require('dotenv').config({ path: '../.env.development' });
const express = require('express');
const cors = require('cors');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

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
    console.log("Image received");
    return res.status(200).json({ text: structuredData });
  } catch (error) {
    console.error('OCR error:', error);
    return res.status(500).json({ 
      error: error.message || 'OCR failed',
      details: error.details || 'No additional details available'
    });
  }
});

function parseTextToStructuredData(text) {
  const lines = text.split('\n');
  const items = [];
  let currentItem = null;

  lines.forEach(line => {
    const itemMatch = line.match(/([A-Za-z\s]+)\s+(\d+[,.]\d{1,2})/);
    if (itemMatch) {
      if (currentItem) {
        items.push(currentItem);
      }
      currentItem = {
        description: itemMatch[1].trim(),
        price: parseFloat(itemMatch[2].replace(',', '.')),
      };
    } else if (currentItem) {
      const priceMatch = line.match(/(\d+[,.]\d{1,2})/);
      if (priceMatch) {
        currentItem.price = parseFloat(priceMatch[1].replace(',', '.'));
        items.push(currentItem);
        currentItem = null;
      }
    }
  });

  if (currentItem) {
    items.push(currentItem);
  }

  return { items };
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});