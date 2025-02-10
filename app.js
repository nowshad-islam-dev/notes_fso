// utils import >> load env variables at top
import config from './utils/config.js';

// packages import
import express from 'express';
import 'express-async-errors';
const app = express(); // create app object

import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

// controllers import
import notesController from './controllers/notes.controllers.js';

// custorm  middleware
import middlewares from './utils/middlewares.js';

mongoose.set('strictQuery', false);

const uri = config.MONGO_URI; // MongoDB connection string

// console.log(uri);

mongoose
  .connect(uri)
  .then(() => console.log('DB Connected'))
  .catch((error) => console.log('DB Connection Error', error.message));

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

app.use('/api/notes', notesController);

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

export default app;
