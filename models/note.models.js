import mongoose from 'mongoose';

// *** mongodb configs ***//

// console.table(process.argv);

mongoose.set('strictQuery', false);

const uri = process.env.MONGO_URI;

// console.log(uri);

mongoose
  .connect(uri)
  .then((result) => console.log('DB Connected'))
  .catch((error) => console.log('DB Connection Error', error.message));

const noteSchema = new mongoose.Schema({
  content: String,
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
