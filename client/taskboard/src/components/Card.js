import React, { useState } from 'react';

const Card = ({ task, moveTask }) => {
  const [expanded, setExpanded] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task._id);
  };

  const handleDrop = (e) => {
    const taskId = e.dataTransfer.getData('taskId');
    moveTask(taskId, task.status);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="bg-white p-4 mb-4 rounded shadow cursor-pointer hover:bg-gray-100"
      onClick={toggleExpanded}
    >
      <h3 className="text-sm font-bold">{task.title}</h3>
      {expanded && (
        <div>
          <p>{task.description}</p>
          {task.status === 'done' && (
            <p>Duración: {task.duration ? task.duration.toFixed(2) : 'N/A'} minutos</p>
          )}
          <input type="file" />
        </div>
      )}
    </div>
  );
};

export default Card;
