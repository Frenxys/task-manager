import React, { useState } from "react";
import TaskManager from "./components/TaskManager";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthProvider, useAuth } from "./components/AuthContext";
import "./styles.css";

const AppContent = () => {
  const { user } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleToggle = () => {
    setIsRegistering(!isRegistering);
  };

  if (user) {
    return <TaskManager />;
  }

  return isRegistering ? (
    <>
      <Register />
      <p>Already have an account? <button className="login-button" onClick={handleToggle}>Login</button></p>
    </>
  ) : (
    <>
      <Login />
      <p>Don't have an account? <button className="login-button" onClick={handleToggle}>Register</button></p>
    </>
  );
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
