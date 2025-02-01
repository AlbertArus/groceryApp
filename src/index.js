import React from 'react';
import App from './App';
import '@material/web/all.js';
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UsuarioProvider } from './UsuarioContext';

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/custom-service-worker.js')  // Nota: quitamos process.env.PUBLIC_URL
        .then(registration => {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
          });
        })
        .catch(error => console.log('SW error:', error));
    });
  }

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
      <UsuarioProvider>
        <App />
      </UsuarioProvider>
  </BrowserRouter>
);
