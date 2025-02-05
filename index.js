import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

const PORT = 3001;

let notes = [
  { id: '1', content: 'HTML is easy', important: true },
  { id: '2', content: 'Browser can execute only JavaScript', important: false },
  {
    id: '3',
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];

const generateId = () => {
  const maxIdNumber =
    notes.length > 0 ? Math.max(...notes.map((note) => Number(note.id))) : 0;
  return String(maxIdNumber + 1);
};

// middlewares
app.use(cors());

app.use(express.json({ limit: '100kb' }));

app.use(express.static('dist'));

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
  res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);
  note ? res.json(note) : res.status(404).end();
});

app.post('/api/notes', (req, res) => {
  const body = req.body;

  if (!body.content) return res.status(400).json({ error: 'Content missing' });

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };

  notes = notes.concat();
  res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  notes = notes.filter((note) => note.id !== id);

  res.status(204).end();
});

// show error for invalid routes
const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
