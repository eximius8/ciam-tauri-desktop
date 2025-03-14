import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Database from '@tauri-apps/plugin-sql';
// when using `"withGlobalTauri": true`, you may use
// const Database = window.__TAURI__.sql;


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [db, setDb] = useState("");
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    async function loadUsers() {
      const db = await Database.load('sqlite:ciam.db');
      setDb(db);
      const data = await db.select('SELECT * from well');
      setUsers(data);
    }
    loadUsers();
    }, [setUsers]);
    
  async function updateUsers() {
    const data = await db.select('SELECT * from users');
    setUsers(data);
  }

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));    
    await db.execute('INSERT INTO users (name) VALUES (?)', [name]);
    await updateUsers();
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
          //updateUsers();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}
          <button onClick={async () => {
            await db.execute('DELETE FROM users WHERE id = ?', [user.id]);
            await updateUsers();
          }}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
