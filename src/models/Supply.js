const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  section: { type: String, required: true },
  lastPurchase: { type: Date, default: Date.now },
});

const Supply = mongoose.model('Supply', supplySchema);

module.exports = Supply;
