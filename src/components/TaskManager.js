import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Importa anche auth
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { useAuth } from "./AuthContext"; // Importa il contesto per ottenere l'utente

const TaskManager = () => {
  const { user, logout } = useAuth(); // Ottieni l'utente loggato e la funzione logout
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Funzione per recuperare le task dell'utente loggato
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "tasks"), where("userId", "==", user.uid)); // Filtra per l'ID dell'utente
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Funzione per aggiungere una task
  const addTask = async () => {
    if (newTask.trim() && user) {
      await addDoc(collection(db, "tasks"), {
        text: newTask,
        userId: user.uid, // Aggiungi l'ID dell'utente
      });
      setNewTask("");
    }
  };

  // Funzione per eliminare una task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  // Funzione per iniziare a modificare una task
  const handleEditClick = (taskId, currentText) => {
    setEditingTaskId(taskId);
    setEditingText(currentText);
  };
  
  // Funzione per salvare la modifica della task
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
      {/* Pulsante di Logout in alto a destra */}
      <button 
  onClick={logout} 
  className="logout-button"
>
  Logout
</button>


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
