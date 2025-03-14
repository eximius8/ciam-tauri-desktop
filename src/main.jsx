import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DBProvider } from './contexts/dbcontext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DBProvider>
      <App />
    </DBProvider>
  </React.StrictMode>,
);
