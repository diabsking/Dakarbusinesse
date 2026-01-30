import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import { PanierProvider } from "./context/PanierContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <PanierProvider>
          <App />
        </PanierProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// ======================
// PWA : Service Worker
// ======================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log(
          "Service Worker DakarBusiness actif",
          registration.scope
        );
      })
      .catch((err) =>
        console.error("Erreur Service Worker DakarBusiness :", err)
      );
  });
}
