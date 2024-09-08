import { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import Home from "./Listas/Home"
import { Route, Routes, } from 'react-router-dom';
import FormLista from './components/FormLista';
import Lista from './Lista/Lista';

function App() {
  
  const [listas, setListas] = useState([])
  const [loading, setLoading] = useState(true)

  const addLista = (listaName, members, plan, descriptionLista) => {
    const newLista = { id: uuidv4(), listaName, members, plan, descriptionLista, categories: [], items: [] }
    setListas(prevListas => [...prevListas, newLista])
  }

  useEffect(() => {
    const savedListas = localStorage.getItem("listas");
    if (savedListas) {
      try {
        setListas(JSON.parse(savedListas));
      } catch (error) {
        console.error("Error parsing items from localStorage:", error);
        localStorage.removeItem("listas");
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("listas", JSON.stringify(listas));
    }
  }, [listas, loading]);

  // useEffect(() => {
  //   if (!loading) {
  //     console.log(localStorage.getItem("listas"))
  //   }
  // }, [listas, loading]);

  const deleteLista = (id) => {
    setListas(prevListas => prevListas.filter(lista => lista.id !== id))
  }

  const updateListaItems = (listaId, updatedItems) => {
    setListas(prevListas =>
      prevListas.map(lista =>
        lista.id === listaId ? { ...lista, items: updatedItems } : lista
      )
    );
  };

  const updateListaCategories = (listaId, updatedCategories) => {
    setListas(prevListas =>
      prevListas.map(lista =>
        lista.id === listaId ? { ...lista, categories: updatedCategories } : lista
      )
    );
  };


  return (
    <Routes>
      <Route path="/" element={
        <Home
          usuario={"Marcos"}
          listaslength={listas.length}
          addLista={addLista}
          listas={listas}
          setListas={setListas}
          deleteLista={deleteLista}
          updateListaCategories={updateListaCategories}
          updateListaItems={updateListaItems}
          loading={loading}
          setLoading={setLoading}
        />}
      />
      <Route path="/list/:id" element={
        <Lista
          // key={lista.id}
          // id={lista.id}
          // listaName={lista.listaName}
          // members={lista.members}
          // plan={lista.plan}
          // categories={lista.categories}
          // items={lista.items}
          listas={listas}
          setListas={setListas}
          deleteLista={deleteLista}
          updateListaCategories={updateListaCategories}
          updateListaItems={updateListaItems}
          loading={loading}
          setLoading={setLoading}
        />}
      />
    </Routes>
  )
}

export default App;