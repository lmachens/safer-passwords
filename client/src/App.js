import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import useStorageState from "./hooks/useStorageState";

async function login() {
  try {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "l@machens.koeln",
        password: "123",
      }),
    });
    const result = await response.text();
    alert(result);
  } catch (error) {
    alert(error.message);
  }
}

function App() {
  const [passwordName, setPasswordName] = useStorageState(
    "passwordName",
    "",
    localStorage
  );
  const [passwordValue, setPasswordValue] = useState(null);

  async function fetchPassword(name) {
    try {
      const response = await fetch(`/api/passwords/${name}`);
      const result = await response.text();
      setPasswordValue(result);
    } catch (error) {
      setPasswordValue(error.message);
    }
  }

  function handlePasswordNameChange(event) {
    const newPasswordName = event.target.value;
    setPasswordName(newPasswordName);
  }

  return (
    <div className="App">
      <button onClick={login}>Login</button>
      <label>
        Password-Name{" "}
        <input value={passwordName} onChange={handlePasswordNameChange} />
      </label>
      <button onClick={() => fetchPassword(passwordName)}>Get Password</button>
      <div>Password: {passwordValue}</div>
    </div>
  );
}

export default App;
