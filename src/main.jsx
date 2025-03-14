import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DBProvider } from './contexts/dbcontext';
import { AuthProvider } from './contexts/authcontext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DBProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DBProvider>
  </React.StrictMode>,
);
