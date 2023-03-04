 
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
  complete: {
    type: Boolean,
    required: true,
  },
  start: {
    type: Date,
    required: false,
  },
  end: {
    type: Date,
    required: false,
  },
  intervalK: {
    type: Number,
    required: false,
  },
  intervalN: {
    type: String,
    required: false,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User', // the module from user.js
  },
});

module.exports = mongoose.model('Task', taskSchema);
