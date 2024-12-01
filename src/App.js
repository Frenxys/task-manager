import React from "react";
import TaskManager from "./components/TaskManager";
import Login from "./components/Login";
import { AuthProvider, useAuth } from "./components/AuthContext";
import "./styles.css";

const AppContent = () => {
  const { user } = useAuth();
  return user ? <TaskManager /> : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
