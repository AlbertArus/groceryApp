import React from 'react';
import App from './App';
import '@material/web/all.js';
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UsuarioProvider } from './UsuarioContext';

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
      <UsuarioProvider>
        <App />
      </UsuarioProvider>
  </BrowserRouter>
);
