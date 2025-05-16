import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['driver', 'conductor'],
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});



const Staff =  mongoose.model('Staff', staffSchema);

export default Staff;