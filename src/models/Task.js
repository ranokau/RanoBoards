const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, required: true },
  startTime: Date,
  endTime: Date,
  duration: Number, // duración en minutos
  date: { type: String, required: true } // fecha de la tarea
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;


