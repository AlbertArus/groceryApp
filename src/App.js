import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Route, Routes, useNavigate, } from 'react-router-dom';
import './App.css';
import Home from "./Listas/Home"
import toast, { Toaster } from 'react-hot-toast'
import FormLista from './components/FormLista';
import Lista from './Lista/Lista';
import Archived from './Listas/Archived';
import Registro from './configuración/Registro';
import Perfil from './configuración/Perfil';

import firebaseApp, { db } from "./firebase-config.js"
import { doc, setDoc, getDocs, collection, updateDoc, getDoc, deleteDoc } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
const auth = getAuth(firebaseApp)

function App() {

  const [listas, setListas] = useState([])
  const [deletedLista, setDeletedLista] = useState([])
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()
  // console.log({deletedLista})


  const addLista = async (listaName, members, plan, descriptionLista) => {
    const newLista = { id: uuidv4(), listaName, members, plan, descriptionLista, categories: [], items: [], isArchived: false, isNotified: false }
    try {
      await setDoc(doc(db, "listas", newLista.id), newLista);
      setListas(prevListas => [...prevListas, newLista]);
    } catch (error) {
      console.error("Error al guardar la lista en Firebase:", error);
    }  
  }

  const loadListasFromFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "listas"));
      const loadedListas = querySnapshot.docs.map(doc => doc.data());
      setListas(loadedListas);
    } catch (error) {
      console.error("Error al cargar las listas desde Firebase:", error);
    }
  }

  useEffect(() => {
    loadListasFromFirebase();
  }, []);

  const deleteLista = async (id) => {
    const ListToDelete = listas.find(lista => lista.id === id);
    setDeletedLista(prev => [...prev, ListToDelete]);  // Añadir la lista al array
    setListas(listas.filter(lista => lista.id !== id));
  
    let timeoutId;
    try {
      await updateDoc(doc(db, "listas", id), { deleted: true });
      navigate("/");
  
      toast((t) => (
        <span style={{ display: "flex", alignItems: "center" }}>
          <span className="material-symbols-outlined" style={{ marginRight: "8px", color: "#9E9E9E" }}>warning</span>
          {`Has eliminado "${ListToDelete.listaName}"`}
          <button onClick={() => { 
              undoDelete(ListToDelete.id);  // Pasa el ID de la lista a restaurar
              clearTimeout(timeoutId);
              toast.dismiss(t.id); 
            }} 
            style={{ marginLeft: "10px", padding: "0", backgroundColor: "#FBE7C1", border: "none", fontFamily: "poppins", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
            Deshacer
          </button>
        </span>
      ), {
        style: { border: "2px solid #ED9E04", backgroundColor: "#FBE7C1" }
      });
  
      timeoutId = setTimeout(async () => {
        try {
          await deleteDoc(doc(db, "listas", id));
          setDeletedLista(prev => prev.filter(lista => lista.id !== id));  // Eliminar del array después del tiempo
        } catch (error) {
          console.error("Error al eliminar definitivamente la lista:", error);
        }
      }, 3000);
    } catch (error) {
      console.error("Error al marcar como eliminada la lista en Firebase:", error);
    }
  };

  const undoDelete = useCallback((id) => {
    const listaToRestore = deletedLista.find(lista => lista.id === id);
    if (listaToRestore) {
      setListas(prevListas => [...prevListas, listaToRestore]);
      setDeletedLista(prev => prev.filter(lista => lista.id !== id));

      updateDoc(doc(db, "listas", listaToRestore.id), { deleted: false })
        .catch(error => {
          console.error("Error al restaurar la lista en Firebase:", error);
        });
    }
  }, [deletedLista]);
  
  
  const updateListaItems = async (listaId, updatedItems) => {
    setListas(prevListas =>
      prevListas.map(lista =>
        lista.id === listaId ? { ...lista, items: updatedItems } : lista
      )
    );

    try {
      const listaRef = doc(db, "listas", listaId);
      await updateDoc(listaRef, { items: updatedItems });
    } catch (error) {
      console.error("Error al actualizar los items en Firebase:", error);
    }
  };

  const updateListaCategories = async (listaId, updatedCategories) => {
    console.log("Categorías:", updatedCategories);
    setListas(prevListas =>
      prevListas.map(lista =>
        lista.id === listaId ? { ...lista, categories: updatedCategories } : lista
      )
    );

    try {
      const listaRef = doc(db, "listas", listaId);
      await updateDoc(listaRef, { categories: updatedCategories });
    } catch (error) {
      console.error("Error al actualizar las categorías en Firebase:", error);
    }
  };

  const handleArchive = async (id) => {
    const listaToUpdate = listas.find(lista => lista.id === id);
    const newIsArchived = !listaToUpdate.isArchived;
    setListas(prevListas =>
      prevListas.map(lista =>
        lista.id === id ? { ...lista, isArchived: newIsArchived } : lista
      )
    )
  
    try {
      const listaRef = doc(db, "listas", id);
      await updateDoc(listaRef, { isArchived: newIsArchived });
    } catch (error) {
      console.error("Error al archivar/desarchivar la lista en Firebase:", error);
    }
  
    navigate("/");
  }
  
  const archivedList = listas.filter(lista => lista.isArchived)
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

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (usuario) => {
  //     if (usuario) {
  //       setUsuario(usuario);
  //       loadListasFromFirebase();
  //     } else {
  //       setUsuario(null);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
      if (usuario) {
        setUsuario(usuario);
        // Cargar la información del usuario desde Firestore
        const docRef = doc(db, "usuarios", usuario.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            // Aquí puedes almacenar los datos en el estado si lo deseas
            setUsuario({ ...usuario, ...userData });
            loadListasFromFirebase();
        } else {
            console.log("No hay tal documento!");
        }
      } else {
        setUsuario(null);
      }
    });
    return () => unsubscribe();

  }, []);

  const usuarioCompleto = `${usuario?.nombre} ${usuario?.apellido}`

  return (
    <>
      <div>
        <Toaster
          position="bottom-center"
          reverseOrder={false}
        />
        <Routes>
        <Route path="/Registro" element={
          <Registro 
            setUsuario={setUsuario}
          />}
        />
        {usuario ? (
          <>
            <Route path="/" element={
              <Home 
              usuario={usuario.nombre}
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
              goToArchived={goToArchived}
              listas={listas.filter(lista => lista.isArchived)}
              handleArchive={handleArchive}
              deleteLista={deleteLista}
              />}
            />
            <Route path='/profile' element={
              <Perfil
              usuario={usuario.nombre}
              usuarioCompleto={usuarioCompleto}
              correoUsuario={usuario.email}
              />}
            />
          </>
          ) : (
            <Route path='*' element={<Registro />} />
          )
        }
        </Routes>
      </div>
    </>
  )
}

export default App;