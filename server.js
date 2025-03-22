const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');
const { log } = require('console');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

//endpoint to generate roadmap
app.post('/generate-roadmap', (req, res) => {
  const formData = req.body;
  const pythonProcess = spawn('python3', ['generate.py', JSON.stringify(formData)]);
  console.log("Script is running...");
  
  let result = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  console.log("Re");
  

  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: `Python script failed: ${error}` });
    }
    res.json({ result: JSON.parse(result) });
  });
});

//idk a checker endpoint
app.get('/check', (req, res) => {
    res.send('Seems to be working');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});