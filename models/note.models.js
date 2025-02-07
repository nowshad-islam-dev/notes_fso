import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  content: { type: String, minLength: 5, required: true },
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
