import React from 'react';
import Card from './Card';

const Column = ({ title, tasks, moveTask, status }) => {
  const handleDrop = (e) => {
    const taskId = e.dataTransfer.getData('taskId');
    moveTask(taskId, status);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="column"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2>{title}</h2>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <Card key={task._id} task={task} moveTask={moveTask} />
        ))
      ) : (
        <p>Sin tareas</p>
      )}
    </div>
  );
};

export default Column;




