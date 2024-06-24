const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Dashboards';

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Tiempo de espera para seleccionar el servidor MongoDB (milisegundos)
  socketTimeoutMS: 45000, // Tiempo de espera del socket
  connectTimeoutMS: 30000, // Tiempo de espera para conectar
}).then(() => {
  console.log('Conexión a MongoDB establecida con éxito');
}).catch((err) => {
  console.error('Error al conectar a MongoDB:', err);
});

module.exports = mongoose;

