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

// ======================
// PWA : Service Worker
// ======================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("Service Worker Dakarbusinesse actif"))
      .catch((err) =>
        console.error("Erreur Service Worker Dakarbusinesse :", err)
      );
  });
}
