import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import Home from "./Listas/Home"

function App() {

  const [listas, setListas] = useState([])

  const addLista = (listaName, members, plan, descriptionLista) => {
      const newLista = {id: uuidv4(), listaName, members, plan, descriptionLista}
      setListas(prevListas => [...prevListas, newLista])
  }

  const listaslength = listas.length

  const deleteLista = (id) => {
    setListas(prevListas => prevListas.filter(lista => lista.id !== id))
  }

  console.log(listas)

  return (
    <div>
      <Home
        usuario={"Marcos"}
        listaslength={listaslength}
        addLista={addLista}
        listas={listas}
        deleteLista={deleteLista}
      />
    </div>
  )
}

export default App;