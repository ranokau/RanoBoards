const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  temperature: Number, // Valor de temperatura
  humidity: Number, // Valor de humedad
  VPD:Number, // Valor VPD
  co2: Number, // Nivel de CO2
  ph: Number, // Nivel de pH
  ec: Number, // Conductividad eléctrica
  o2: Number, // nivel de oxigeno
  t_agua:Number, //temperatura del agua
  frecuencia_luces: Number, //espectro de luz emitida
  lightIntensity: Number, // Intensidad de la luz
  createdAt: { type: Date, default: Date.now } // Fecha de creación del registro
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
