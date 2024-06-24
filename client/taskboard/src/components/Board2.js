import React, { useState, useEffect } from 'react';
import Column from './Column';
import TaskCreator from './TaskCreator';

const fetchTasks = async () => {
  try {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    const today = new Date().toISOString().split('T')[0];
    return data.filter(task => task.date === today);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

const saveTask = async (task) => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving task:', error);
  }
};

const updateTask = async (task) => {
  try {
    const response = await fetch(`/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

const updateSupply = async (supplyName, amount) => {
  try {
    const response = await fetch('/api/update-supply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ supplyName, amount }),
    });
    if (!response.ok) {
      throw new Error('Error updating supply');
    }
  } catch (error) {
    console.error('Error updating supply:', error);
  }
};

const Board = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchInitialTasks = async () => {
      const initialTasks = await fetchTasks();
      setTasks(initialTasks);
    };

    fetchInitialTasks();
  }, []);

  const moveTask = async (id, newStatus) => {
    const updatedTasks = tasks.map(task => {
      if (task._id === id) {
        const updatedTask = { ...task, status: newStatus };
        if (newStatus === 'doing') {
          updatedTask.startTime = new Date();
        }
        if (newStatus === 'done') {
          updatedTask.endTime = new Date();
          updatedTask.duration = (new Date(updatedTask.endTime) - new Date(updatedTask.startTime)) / 1000 / 60; // Duración en minutos
          if (task.title.toLowerCase() === 'embolsar mixes') {
            updateSupply('Bolsas', -15);
          }
          if (task.title.toLowerCase() === 'embolsar') {
            updateSupply('Bolsas', -15);
          }
          if (task.title.toLowerCase() === 'embolsar') {
            updateSupply('Etiquetas Mix Lechugas', -15);
          }
          if (task.title.toLowerCase() === 'prueba') {
            updateSupply('Etiquetas Mix Lechugas', -15);
          }
        }
        updateTask(updatedTask); // Guardar el estado actualizado en la base de datos
        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const addTask = async (newTask) => {
    const savedTask = await saveTask({ ...newTask, status: 'todo' });
    setTasks([...tasks, savedTask]);
  };

  const handleBackToHome = () => {
    window.location.href = '/'; // Cambia esto según la ruta de tu página de inicio
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-200">
      <button
        onClick={handleBackToHome}
        className="back-button"
      >
        Inicio
      </button>
      <div className="flex mt-8 space-x-4">
        <TaskCreator addTask={addTask} />
        <div className="triangle-container">
          <div className="triangle-column1">
            <Column title="Por Hacer" tasks={tasks.filter(task => task.status === 'todo')} moveTask={moveTask} status="todo" />
          </div>
          <div className="triangle-column2">
            <Column title="Haciendo" tasks={tasks.filter(task => task.status === 'doing')} moveTask={moveTask} status="doing" />
          </div>
          <div className="triangle-column3">
            <Column title="Hecho" tasks={tasks.filter(task => task.status === 'done')} moveTask={moveTask} status="done" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
