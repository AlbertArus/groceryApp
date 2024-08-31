// import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
// import { v4 as uuidv4 } from 'uuid';
import Home from "./Listas/Home"
function App() {

  return (
    <div>
      <Home
        usuario={"Marcos"}
        listas={"2"}
      />
    </div>
  )
}

export default App;