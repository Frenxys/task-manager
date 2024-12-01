import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");

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

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const handleEditClick = (taskId, currentText) => {
    setEditingTaskId(taskId);
    setEditingText(currentText);
  };

  const handleSaveEdit = async () => {
    if (editingText.trim() === "") {
      return;
    }

    const taskRef = doc(db, "tasks", editingTaskId);
    await updateDoc(taskRef, { text: editingText });

    setTasks(tasks.map((task) =>
      task.id === editingTaskId ? { ...task, text: editingText } : task
    ));

    setEditingTaskId(null);
    setEditingText("");
  };

  return (
    <div className="container">
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
            {editingTaskId === task.id ? (
              <div>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={handleSaveEdit}>Save</button>
              </div>
            ) : (
              <div>
                <span>{task.text}</span>
                <button className="edit" onClick={() => handleEditClick(task.id, task.text)}>
                  ✏️
                </button>
                <button className="delete" onClick={() => deleteTask(task.id)}>
                  
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
