import React, { useState, useEffect } from "react";
import './App.css'; // Assuming you have your styles in a CSS file
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import C from "../src/images/c_x.jpg"

const App = () => {
  const deadlineDate = new Date("2024-04-30T00:00:00Z");
  const calculateRemainingTime = () => Math.max(0, Math.floor((deadlineDate.getTime() - Date.now()) / 1000));

  // Load tasks from local storage or use default tasks
  const initialTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
  // State for remaining time, tasks, active task, and tasks completion status
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTask, setActiveTask] = useState(null);
  const [currentSessionTime, setCurrentSessionTime] = useState(0);

  // Timer effect to update remaining time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
      if (activeTask && activeTask.countdownTime > 0) {
        setCurrentSessionTime(activeTask.countdownTime);
        activeTask.countdownTime--;
        if (activeTask.countdownTime === 0) {
          // Task countdown completed
          clearInterval(activeTask.countdownInterval);
          setActiveTask(null);
        }
      } else {
        setCurrentSessionTime(0);
      }
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [activeTask]);

  // Save tasks to local storage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Function to start countdown for a task
  const startTaskCountdown = (task) => {
    const interval = setInterval(() => {
      if (task.countdownTime > 0) {
        task.countdownTime--;
        if (task.countdownTime === 0) {
          // Task countdown completed
          clearInterval(interval);
        }
      }
    }, 1000);
    return interval;
  };

  // Function to handle task selection
  const handleTaskSelection = (taskId) => {
    const selectedTask = tasks.find(task => task.id === taskId);
    setActiveTask(selectedTask);
    if (!selectedTask.completed && !selectedTask.countdownInterval) {
      // Start countdown if the task is not completed and countdown is not already started
      selectedTask.countdownInterval = startTaskCountdown(selectedTask);
    }
  };

  // Function to toggle tasks completion status
  const handleTaskToggle = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && !task.completed) {
        // Mark task as completed
        task.completed = true;
        if (task.countdownInterval) {
          clearInterval(task.countdownInterval);
        }
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // Function to add a new task
  const addTask = () => {
    if (newTaskName.trim() !== "") {
      const newTask = {
        id: tasks.length + 1, // Generate a unique ID
        name: newTaskName,
        completed: false,
        dueDate: selectedDate, // Due date for the task
        countdownTime: Math.max(0, Math.floor((selectedDate.getTime() - Date.now()) / 1000)) // Remaining time based on due date
      };
      newTask.countdownInterval = startTaskCountdown(newTask);
      setTasks([...tasks, newTask]);
      setNewTaskName("");
    }
  };

  // Function to format remaining time
  const formatTime = (timeInSeconds) => {
    const days = Math.floor(timeInSeconds / (3600 * 24));
    const hours = Math.floor((timeInSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="container">
      <div className="card">
      <img src={C} style={{ width: '40px', height: '40px' }} />
        <div className="current-session-container">
        
          <h4>Current Session: Admin Evaluation </h4>
          {/* {activeTask ? (
            <>
              <p>{activeTask.name}</p>
              <p className="countdown">{formatTime(currentSessionTime)}</p>
            
            </>
          ) : (
            <p>No active task</p>
          )} </h2> */}
       
        </div>
        {/* <div className="overall-countdown-container">
          <p>Overall Countdown:
          <p className="countdown">{formatTime(remainingTime)}</p> </p>
        </div> */}
        <div className="task-list">
        
          <ul>
            {tasks.map(task => (
              <li key={task.id} className={task.completed ? "completed" : ""} onClick={() => handleTaskSelection(task.id)}>
                {task.name} - {activeTask && activeTask.id === task.id ? formatTime(task.countdownTime) : "Not Active"}
                <DatePicker selected={task.dueDate} onChange={(date) => {
                  const updatedTasks = tasks.map(t => {
                    if (t.id === task.id) {
                      t.dueDate = date;
                      t.countdownTime = Math.max(0, Math.floor((date.getTime() - Date.now()) / 1000));
                      clearInterval(t.countdownInterval);
                      t.countdownInterval = startTaskCountdown(t);
                    }
                    return t;
                  });
                  setTasks(updatedTasks);
                }} />
                <button onClick={() => handleTaskToggle(task.id)}>Toggle</button>
              </li>
            ))}
          </ul>
          <div className="add-task-container">
            <input
              type="text"
              className="task-input"
              placeholder="Enter"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
            <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} />
            <button className="add-task-button" onClick={addTask}>Up Next</button>
          </div>
          <p className="countdown">{formatTime(remainingTime)}</p> 
        </div>
        <button onClick={() => setTasksCompleted(!tasksCompleted)} className={tasksCompleted ? "task-button completed" : "task-button"}>
          {tasksCompleted ? "Execute Contract" : "Destroy Contract"}
        </button>
      </div>
    </div>
  );
};

export default App;
