const fs = require('fs').promises;
const path = require('path');
const Task = require('./src/models/Task'); // Ajusta la ruta según tu estructura de proyecto

const getDayOfWeek = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date();
  return days[today.getDay()];
};

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getInitialTasks = async () => {
  try {
    const filePath = path.join(__dirname, 'activities.json');
    const data = await fs.readFile(filePath, 'utf8');
    const activities = JSON.parse(data);
    const dayOfWeek = getDayOfWeek();
    const date = getFormattedDate();

    // Verificar si ya existen tareas para el día actual
    const existingTasks = await Task.find({ date });
    if (existingTasks.length > 0) {
      return existingTasks;
    }

    const tasks = activities[dayOfWeek].map(task => ({
      title: task.title,
      description: task.description,
      status: 'todo',
      date,
    }));

    // Agregar las tareas a la base de datos
    const savedTasks = await Task.insertMany(tasks);

    return savedTasks;
  } catch (err) {
    throw new Error(`Error reading or parsing activities file: ${err}`);
  }
};

module.exports = { getInitialTasks };

