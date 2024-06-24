const mongoose = require('mongoose');

const temperatureSchema = new mongoose.Schema({
  value: Number,
  createdAt: { type: Date, default: Date.now }
});

const Temperature = mongoose.model('Temperature', temperatureSchema);

module.exports = Temperature;
