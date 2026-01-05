const express = require('express');
const fetch = require('node-fetch'); // node-fetch v2 works with require
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Optional: serve HTML if you want
app.use(express.static(path.join(__dirname, 'public')));

app.post('/validate', async (req, res) => {
  const { word } = req.body;
  if (!word) return res.status(400).json({ error: 'No word provided' });

  try {
    const response = await fetch('https://wordotron.com/api/v1/check-word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: word.toLowerCase() }),
    });

    if (!response.ok) {
      console.error('Wordotron returned status:', response.status);
      return res.status(500).json({ valid: false });
    }

    const result = await response.json();
    res.json({ valid: result.valid });
  } catch (err) {
    console.error('Error calling Wordotron:', err);
    res.status(500).json({ valid: false });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
