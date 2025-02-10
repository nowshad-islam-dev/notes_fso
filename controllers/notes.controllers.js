import express from 'express';

const router = express.Router();

// models import
import Note from '../models/note.models.js';

// routes
router.get('/', async (req, res) => {
  await Note.find({}).then((notes) => res.json(notes));
});

router.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);

  note ? res.json(note) : res.status(404).end();
});

router.post('/', async (req, res) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  const savedNote = await note.save();
  res.status(201).json(savedNote);
});

router.put('/:id', async (req, res) => {
  const body = req.body;
  const note = {
    content: body.content,
    important: body.important || false,
  };

  // turn on mongoose validation (it is off by default when updating data)
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
    context: 'query',
  });

  res.json(updatedNote);
});

router.delete('/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);

  res.status(204).end();
});

export default router;
