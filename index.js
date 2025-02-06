// load the environmet variables
// import dotenv from 'dotenv';
// dotenv.config();
import 'dotenv/config';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

// models import
import Note from './models/note.models.js';

import errorHandler from './middlewares/error.js';
const app = express();

const port = process.env.PORT || 3001;

let notes = [
  { id: '1', content: 'HTML is easy', important: true },
  { id: '2', content: 'Browser can execute only JavaScript', important: false },
  {
    id: '3',
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];

// const generateId = () => {
//   const maxIdNumber =
//     notes.length > 0 ? Math.max(...notes.map((note) => Number(note.id))) : 0;
//   return String(maxIdNumber + 1);
// };

// middlewares
app.use(express.static('dist'));
app.use(express.json({ limit: '100kb' }));
app.use(cors());

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      '-',
      'payload:',
      JSON.stringify(req.body),
    ].join(' ');
  })
);

// routes
app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      note ? res.json(note) : res.status(404).end();
    })
    .catch((error) => next(error));
});

app.post('/api/notes', (req, res, next) => {
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

app.put('/api/notes/:id', (req, res, next) => {
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

app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => {
      // console.log(error.message);
      next(error);
    });
});

// show error for invalid routes
const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running at port: ${port}`));
