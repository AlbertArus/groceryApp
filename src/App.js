import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Route, Routes, useNavigate, } from 'react-router-dom';
import './App.css';
import Home from "./Listas/Home"
import toast from 'react-hot-toast'
import FormLista from './components/FormLista';
import Lista from './Lista/Lista';
import Archived from './Listas/Archived';
import Registro from './configuración/Registro';
import Perfil from './configuración/Perfil';

import firebaseApp from "./firebase-config.js"
import { getAuth, onAuthStateChanged } from "firebase/auth"
const auth = getAuth(firebaseApp)

function App() {

  const [listas, setListas] = useState([])
  const [loading, setLoading] = useState(true)
  const [archivedList, setArchivedList] = useState([])
  const [deletedLista, setDeletedLista] = useState("")
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate() 

  const addLista = (listaName, members, plan, descriptionLista) => {
    const newLista = { id: uuidv4(), listaName, members, plan, descriptionLista, categories: [], items: [], isArchived: false, isNotified: false }
    setListas(prevListas => [...prevListas, newLista])
  }

  useEffect(() => {
    const savedListas = localStorage.getItem("listas");
    const archivedListas = localStorage.getItem("archivedList")
    if (savedListas) {
      try {
        setListas(JSON.parse(savedListas));
      } catch (error) {
        console.error("Error parsing items from localStorage:", error);
        localStorage.removeItem("listas");
      }
    }

    if (archivedListas) {
      try {
        setArchivedList(JSON.parse(archivedListas));
      } catch (error) {
        console.error("Error parsing items from localStorage:", error);
        localStorage.removeItem("archivedList");
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("listas", JSON.stringify(listas));
    }
  }, [listas, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("archivedList", JSON.stringify(archivedList));
      // console.log(archivedList)
    }
  }, [archivedList, loading]);

  useEffect(() => {
    if (!loading) {
      console.log(listas)
    }
  }, [listas, loading]);


  const deleteLista = (id) => {
    const ListToDelete = listas.find(lista => lista.id === id)
    setListas(listas.filter(lista => lista.id !== id))
    const newDeletedList = { type: 'lista', data: ListToDelete };
    setDeletedLista(newDeletedList);
    console.log(ListToDelete)
    navigate("/")

    toast((t) => (
      <span style={{ display: "flex", alignItems: "center" }}>
        <span className="material-symbols-outlined" style={{ marginRight: "8px", color: "#9E9E9E" }}>warning</span>
        {`Has eliminado "${ListToDelete.listaName}"`}
        <button onClick={() => { undoDelete(newDeletedList); toast.dismiss(t.id) }} style={{ marginLeft: "10px", padding: "0", backgroundColor: "#FBE7C1", border: "none", fontFamily: "poppins", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
          Deshacer
        </button>
      </span>
    ), {
      style: { border: "2px solid #ED9E04", backgroundColor: "#FBE7C1" }
    }
    )
  }

  const undoDelete = useCallback((ListToRestore) => {
    if (ListToRestore) {
      if (ListToRestore.type === 'lista') {
        setListas(prevListas => [...prevListas, ListToRestore.data.list]);
        setDeletedLista(null);
      }
    }
  }, [])

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

  const markArchived = (id) => {
    setListas(prevListas =>
      prevListas.map(lista =>
        lista.id === id ? { ...lista, isArchived: !lista.isArchived } : lista
      )
    )
  }

  useEffect(() => {
    const newArchived = listas.filter(lista => lista.isArchived)
    setArchivedList(newArchived)
  }, [listas])

  const handleArchive = (id) => {
    markArchived(id)
    navigate("/")
  }

  const AllArchived = archivedList.length

  const goToArchived = (e) => {
    e.preventDefault()
    navigate("/archived/")
  }

  const duplicarLista = (id) => {
    console.log("ID buscado:", id);
    const originalLista = listas.find(lista => lista.id === id)
    console.log(originalLista)
    // const duplicateLista = {...originalLista, id: uuidv4(), categories: originalLista.categories ? [...originalLista.categories] : [], items: originalLista.items ? [...originalLista.items]: []}
    const duplicateLista = { ...originalLista, id: uuidv4(), }
    setListas(prevListas => [...prevListas, duplicateLista])
    console.log("duplicado")
  }

  const handleDuplicate = () => {
    duplicarLista()
    navigate("/")
  }

  const handleNotified = (id) => {
    setListas(prevListas => {
      const notified = prevListas.map(lista =>
      lista.id === id ? { ...lista, isNotified: !lista.isNotified } : lista
      )
      return notified
    })
  }

  // onAuthStateChanged(auth, (usuarioFirebase) => {
  //   if(usuarioFirebase) {
  //     setUsuario(usuarioFirebase)
  //   } else {
  //     setUsuario(null)
  //   }
  // })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase);
      } else {
        setUsuario(null);
      }
    });
  
    // Limpiar el efecto al desmontar
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div>
        <Routes>
        <Route path="/Registro" element={<Registro />} />
        {usuario ? (
          <>
            <Route path="/" element={
              <Home
              usuario={usuario.email}
              correoUsuario={usuario.email}
              addLista={addLista}
              listas={listas.filter(lista => !lista.isArchived)}
              deleteLista={deleteLista}
              updateListaCategories={updateListaCategories}
              updateListaItems={updateListaItems}
              handleArchive={handleArchive}
              AllArchived={AllArchived}
              goToArchived={goToArchived}
              handleNotified={handleNotified}
              handleDuplicate={handleDuplicate}
              />}
              />
            <Route path="/list/:id" element={
              <Lista
              listas={listas}
              setListas={setListas}
              deleteLista={deleteLista}
              updateListaCategories={updateListaCategories}
              updateListaItems={updateListaItems}
              handleArchive={handleArchive}
              handleDuplicate={handleDuplicate}
              />}
              />
            <Route path='/newlist/' element={
              <FormLista />}
              />
            <Route path='/archived/' element={
              <Archived
              AllArchived={AllArchived}
              goToArchived={goToArchived}
              listas={listas.filter(lista => lista.isArchived)}
              handleArchive={handleArchive}
              deleteLista={deleteLista}
              usuario={"Marcos"}
              />}
            />
            <Route path='/profile' element={
              <Perfil
              usuario={usuario.email}
              correoUsuario={usuario.email}
              />}
            />
          </>
          ) : (
            <Route path='*' element={<Registro />} />
          )}
          </Routes>
      </div>
    </>
  )
}

export default App;