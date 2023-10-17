const mongoose = require('mongoose');

// Define the Drink schema
const studentSchema = new mongoose.Schema({
  user_id: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  first_name :{
    type: String,
    default: null
  },
  last_name : {
    type: String, 
    default: null
  },
  age : {
    type: Number,
    default: null
  },
  mobile_no: {
    type: Number,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
}, {
  timestamps: true,
});


const Student = mongoose.model('student', studentSchema);

module.exports = Student;
