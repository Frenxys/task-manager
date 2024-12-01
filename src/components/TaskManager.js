import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, doc, deleteDoc } from "firebase/firestore";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });
    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (newTask.trim()) {
      await addDoc(collection(db, "tasks"), { text: newTask });
      setNewTask("");
    }
  };

  const removeTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.text}</span>
            <button className="delete" onClick={() => removeTask(task.id)}></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
