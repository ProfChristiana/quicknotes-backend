const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const NOTES_FILE = './notes.json';

// Read notes
const getNotes = () => {
  if (!fs.existsSync(NOTES_FILE)) return [];
  const data = fs.readFileSync(NOTES_FILE);
  return JSON.parse(data);
};

// Write notes
const saveNotes = (notes) => {
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
};

app.get('/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const notes = getNotes();
  const newNote = { id: uuidv4(), text: req.body.text };
  notes.push(newNote);
  saveNotes(notes);
  res.status(201).json(newNote);
});

app.delete('/notes/:id', (req, res) => {
  let notes = getNotes();
  notes = notes.filter(note => note.id !== req.params.id);
  saveNotes(notes);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
