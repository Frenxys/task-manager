import React, { useState } from "react";
import { useAuth } from "./AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await register(email, password);
    } catch (err) {
      setError("Failed to create an account. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="login-button" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
