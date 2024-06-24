require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { getInitialTasks } = require('./getInitialTasks'); // Ajusta la ruta según tu estructura de proyecto
const SensorData = require('./src/models/SensorData'); // Asegúrate de ajustar la ruta si es necesario
const Supply = require('./src/models/Supply'); // Asegúrate de ajustar la ruta si es necesario
const Task = require('./src/models/Task'); // Asegúrate de ajustar la ruta si es necesario

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './src/views');

const dbUri = process.env.MONGO_URI;

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
}).then(async () => {
  console.log('Conexión a MongoDB establecida con éxito');

  // Ejecutar getInitialTasks al iniciar el servidor
  try {
    await getInitialTasks();
    console.log('Tareas iniciales cargadas con éxito');
  } catch (err) {
    console.error('Error al cargar las tareas iniciales:', err);
  }
}).catch((err) => {
  console.error('Error al conectar a MongoDB:', err);
});

// Generación de datos aleatorios para SensorData
const generateRandomData = async () => {
  try {
    const randomTemp = Math.floor(Math.random() * 35) + 10;
    const randomHum = Math.floor(Math.random() * 100) + 40;
    const randomVPD = Math.floor(Math.random() * 1500) + 600;
    const randomCo2 = Math.floor(Math.random() * 400) + 350;
    const randomPH = Math.floor(Math.random() * 10) + 1;
    const randomEC = Math.floor(Math.random() * 1000) + 900;
    const randomO2 = Math.floor(Math.random() * 1000) + 900;
    const randomtemp = Math.floor(Math.random() * 25) + 16;
    const randomlumen = Math.floor(Math.random() * 1000) + 1;
    const randomfrec = Math.floor(Math.random() * 1000) + 1;

    const sensor = new SensorData({
      temperature: randomTemp,
      humidity: randomHum,
      VPD: randomVPD,
      co2: randomCo2,
      ph: randomPH,
      ec: randomEC,
      frecuencia_luces: randomfrec,
      lightIntensity: randomlumen,
      o2: randomO2,
      t_agua: randomtemp,
    });

    await sensor.save();
    //console.log('Datos aleatorios guardados:', sensor);
  } catch (error) {
    console.error('Error al generar datos aleatorios:', error);
  }
};

setInterval(() => {
  generateRandomData();
}, 3000);

app.get('/ultimo-dato', async (req, res) => {
  try {
    const ultimoDato = await SensorData.findOne().sort({ createdAt: -1 });
    res.json(ultimoDato);
  } catch (error) {
    console.error('Error al obtener el último dato:', error);
    res.status(500).json({ error: 'Error al obtener el último dato' });
  }
});

app.get('/api/sensor/ultimos-datos', async (req, res) => {
  try {
    const ultimoDatos = await SensorData.find().sort({ createdAt: -1 }).limit(10);
    res.json(ultimoDatos);
  } catch (error) {
    console.error('Error al obtener los últimos datos:', error);
    res.status(500).json({ error: 'Error al obtener los últimos datos' });
  }
});

// Endpoints de Supply
app.get('/api/supplies', async (req, res) => {
  try {
    const supplies = await Supply.find();
    res.json(supplies);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching supplies' });
  }
});
const { sendNotificationEmail } = require('./mailer');
const { sendWhatsAppMessage } = require('./whatsapp');

app.post('/api/update-supply', async (req, res) => {
  const { supplyName, amount } = req.body;

  try {
    const supply = await Supply.findOne({ name: supplyName });
    if (!supply) {
      return res.status(404).json({ error: 'Supply not found' });
    }

    supply.quantity += amount;
    await supply.save();

    if (supply.name.toLowerCase() === 'bolsas' && supply.quantity < 500 && supply.quantity > 400) {
      const message = `Advertencia: El suministro de bolsas es menor a 500. Cantidad actual: ${supply.quantity}`;

      // Enviar correo electrónico
      sendNotificationEmail('ranokauagrotech@gmail.com', 'Advertencia de Suministro', message);

      // Enviar mensaje de WhatsApp
      sendWhatsAppMessage(process.env.TWILIO_WHATSAPP_TO, message);
    }
    if (supply.name.toLowerCase() === 'bolsas' && supply.quantity < 400 && supply.quantity > 300) {
      const message = `Advertencia: El suministro de bolsas es menor a 400. Cantidad actual: ${supply.quantity}`;

      // Enviar correo electrónico
      sendNotificationEmail('ranokauagrotech@gmail.com', 'Advertencia de Suministro', message);

      // Enviar mensaje de WhatsApp
      sendWhatsAppMessage(process.env.TWILIO_WHATSAPP_TO, message);
    }

    res.status(200).json(supply);
  } catch (error) {
    res.status(500).json({ error: 'Error updating supply' });
  }
});


app.post('/api/add-supply', async (req, res) => {
  const { name, quantity, section } = req.body;

  if (!name || !quantity || !section) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const newSupply = new Supply({
      name,
      quantity,
      section,
      lastPurchase: new Date(),
    });

    await newSupply.save();
    res.status(201).json(newSupply);
  } catch (error) {
    res.status(500).json({ error: 'Error adding supply' });
  }
});


// Endpoints de Task
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { title, description, status } = req.body;
  const date = new Date().toISOString().split('T')[0]; // Fecha actual

  try {
    const newTask = new Task({ title, description, status, date });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Error saving task' });
  }
});


app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, startTime, endTime, duration, date } = req.body;

  try {
    const task = await Task.findById(id);

    if (status === 'done' && task.status !== 'done') {
      task.endTime = new Date();
      task.duration = (new Date(task.endTime) - new Date(task.startTime)) / 1000 / 60; // Duración en minutos
    }

    task.title = title;
    task.description = description;
    task.status = status;
    task.startTime = startTime;
    task.endTime = endTime;
    task.duration = duration;
    task.date = date;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

// Endpoints para páginas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/suministros', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'suministros.html'));
});

app.get('/actividades', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'actividades.html'));
});

app.get('/monitoreo', async (req, res) => {
  try {
    const sensor = await SensorData.find().sort({ createdAt: 1 });
    res.render('monitoreo', { sensor: JSON.stringify(sensor) });
  } catch (error) {
    console.error('Error al obtener datos de monitoreo:', error);
    res.status(500).json({ error: 'Error al obtener datos de monitoreo' });
  }
});

app.get('/api/initial-tasks', async (req, res) => {
  try {
    const initialTasks = await getInitialTasks();
    res.json(initialTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Aplicación escuchando en http://localhost:${port}`);
});
