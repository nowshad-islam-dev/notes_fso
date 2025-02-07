import express from 'express';

const router = express.Router();

// models import
import Note from '../models/note.models.js';

// routes
router.get('/', (req, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

router.get('/id', (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      note ? res.json(note) : res.status(404).end();
    })
    .catch((error) => next(error));
});

router.post('/', (req, res, next) => {
  const body = req.body;

  // if (!body.content) return res.status(400).json({ error: 'Content missing' });

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => res.json(savedNote))
    .catch((error) => next(error));
});

router.put('/:id', (req, res, next) => {
  const body = req.body;
  const note = {
    content: body.content,
    important: body.important || false,
  };
  // turn on validation (it is off by default when updating data)
  Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedNote) => res.json(updatedNote))
    .catch((error) => next(error));
});

router.delete('/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => {
      next(error);
    });
});
export default router;
