import React, { useState } from 'react';

const Card = ({ task, moveTask }) => {
  const [expanded, setExpanded] = useState(false);
  const [file, setFile] = useState(null);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleDrop = (e) => {
    const taskId = e.dataTransfer.getData('taskId');
    moveTask(parseInt(taskId), task.status);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={toggleExpand}
      className={`card bg-white p-4 mb-4 rounded shadow cursor-pointer hover:bg-gray-100 ${expanded ? 'card-expanded' : 'card-collapsed'}`}
      style={{ maxWidth: expanded ? 'none' : '200px' }}
    >
      <h3 className="font-bold mb-2" style={{ fontSize: '10px' }}>{task.title}</h3>
      {expanded && (
        <div>
          <p className="mb-2">{task.description || "Sin descripción"}</p>
          <input type="file" onChange={handleFileChange} className="mb-2" />
          {file && <p>Archivo adjunto: {file.name}</p>}
          {task.status === 'done' && task.duration && (
            <p className="mt-2 text-green-500">
              Duración: {task.duration.toFixed(2)} minutos
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;



