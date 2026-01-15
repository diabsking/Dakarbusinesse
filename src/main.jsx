import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { PanierProvider } from "./context/PanierContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PanierProvider>
        <App />
      </PanierProvider>
    </BrowserRouter>
  </React.StrictMode>
);
