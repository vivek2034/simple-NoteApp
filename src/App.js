import React, { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  // Load tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('todo-tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Optional reminder alert
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    tasks.forEach(task => {
      if (task.dueDate === today && !task.completed) {
        console.log(`Reminder: "${task.text}" is due today!`);
        // Optionally alert:
        // alert(`Reminder: "${task.text}" is due today!`);
      }
    });
  }, [tasks]);

  const handleAddOrUpdate = () => {
    if (!taskInput.trim()) return;

    if (editIndex !== null) {
      const updated = [...tasks];
      updated[editIndex].text = taskInput;
      updated[editIndex].dueDate = dueDate;
      setTasks(updated);
      setEditIndex(null);
    } else {
      setTasks([
        ...tasks,
        { text: taskInput, completed: false, dueDate: dueDate || null }
      ]);
    }

    setTaskInput('');
    setDueDate('');
  };

  const handleEdit = (index) => {
    setTaskInput(tasks[index].text);
    setDueDate(tasks[index].dueDate || '');
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    setTaskInput('');
    setDueDate('');
    if (editIndex === index) setEditIndex(null);
  };

  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  return (
    <div className="container">
      <h1>📅 To-Do List with Due Dates</h1>
      <div className="input-container">
        <input
          type="text"
          value={taskInput}
          placeholder="Enter a task"
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={handleAddOrUpdate}>
          {editIndex !== null ? 'Update' : 'Add'}
        </button>
      </div>

      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <label className="task-label">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(index)}
              />
              <span className={task.completed ? 'completed' : ''}>
                {task.text}
              </span>
              {task.dueDate && (
                <span className="due-date">
                  📅 {task.dueDate}
                </span>
              )}
            </label>
            <div className="buttons">
              <button onClick={() => handleEdit(index)}>✏️</button>
              <button onClick={() => handleDelete(index)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
