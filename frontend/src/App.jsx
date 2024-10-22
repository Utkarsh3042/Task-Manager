import React, {useEffect, useState} from "react";
import axios from 'axios';
import './App.css'

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({title:'', description:''});
  const [editingTask, setEditingTask] = useState(null);

  //fetch task from api

  const fetchTasks = async () => {
  const res = await axios.get('http://localhost:5000/tasks');
  setTasks(res.data);
  };

  //create a new task
  const createTask = async () => {
    if(newTask['title'] === '' || newTask['description']===''){
        alert('Cannot add empty title or description!');
    }
    else{
    const res = await axios.post('http://localhost:5000/tasks', newTask);
    setTasks([...tasks, res.data])
    setNewTask({title:'', description:''});
    };
  };

  //update
  const updateTask = async (id) => {
    if(editingTask['title'] === '' || editingTask['description']===''){
      alert('Cannot add empty title or description!');
    }
    else{
    const res = await axios.put(`http://localhost:5000/tasks/${id}`, editingTask);
    setTasks(tasks.map(task => (task.id === id ? res.data : task)));
    setEditingTask(null);
    };
  };

  //delete
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    setTasks(tasks.filter(task => task.id !== id));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div class="container">
      <h1>Task Manager</h1>
      {/* create new task */}
        <div class="task-input">
        <input 
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
         />
         <input 
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
         />
         <br />
         <button onClick={createTask}>Add Task</button>
         </div>
      {/* task list */}
      <div class="task-list">
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {editingTask?.id === task.id ? (
              <div>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
                <input
                  type="text"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                />
                <button onClick={() => updateTask(task.id)}>Save</button>
              </div>
            ) : (
              <div>
                <strong>{task.title}</strong>
                <br />
                <br />
                {task.description}
                <br />
                <br />
                <button onClick={() => setEditingTask(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      </div>
    </div>
  )

}

export default App;