const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to generate roadmap
app.post('/generate-roadmap', (req, res) => {
  const formData = req.body;
  const pythonProcess = spawn('python3', ['generate.py', JSON.stringify(formData)]);
  console.log('Script is running...');
  
  let result = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

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

// Endpoint to ask the chatbot
app.post('/ask-chatbot', (req, res) => {
  const { question, roadmap } = req.body;

  if (!question || !roadmap) {
    return res.status(400).json({ error: 'Both "question" and "roadmap" are required.' });
  }
  console.log("Starting the process..");
  
  const pythonProcess = spawn('python3', ['chatbot.py', question, JSON.stringify(roadmap)]);

  let result = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: `Python script failed: ${error}` });
    }
    res.json({ response: result.trim() });
  });
});

// Endpoint to generate quiz
app.post('/generate-quiz', (req, res) => {
  const { roadmap } = req.body; // Use "roadmap" instead of "roadmap_topics"

  if (!roadmap) {
    return res.status(400).json({ error: 'Roadmap is required.' });
  }

  // Ensure the roadmap has the correct structure
  if (!Array.isArray(roadmap)) {
    return res.status(400).json({ error: 'Roadmap must be an array of topics.' });
  }

  // Validate each topic in the roadmap
  for (const topic of roadmap) {
    if (!topic.id || !topic.title || !Array.isArray(topic.resources)) {
      return res.status(400).json({ error: 'Each topic must have an id, title, and resources array.' });
    }
  }

  // Pass the roadmap to the Python script
  const pythonProcess = spawn('python3', ['quiz_ques.py', JSON.stringify(roadmap)]);

  let result = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: `Python script failed: ${error}` });
    }

    try {
      // Parse the result from the Python script
      const parsedResult = JSON.parse(result);
      res.json({ result: parsedResult });
    } catch (e) {
      res.status(500).json({ error: 'Failed to parse Python script output.' });
    }
  });
});

// Endpoint to check answers
app.post('/check-answers', (req, res) => {
  const { expected, user} = req.body;

  if (!expected || !user) {
    return res.status(400).json({ error: 'Both "expected_answers" and "user_answers" are required. Happening in the server.' });
  }

  const pythonProcess = spawn('python3', ['quiz_ans.py', JSON.stringify(expected), JSON.stringify(user)]);

  let result = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

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

// Checker endpoint
app.get('/check', (req, res) => {
  res.send('Seems to be working');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});