import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from "./Listas/Home"
import toast, { Toaster } from 'react-hot-toast'
import FormLista from './components/FormLista';
import Lista from './Lista/Lista';
import Archived from './Listas/Archived';
import Registro from './configuración/Registro';
import Perfil from './configuración/Perfil';
import Settings from './configuración/Settings.jsx';
import NewPassword from './configuración/NewPassword.jsx'

import { db } from "./firebase-config.js"
import { doc, setDoc, getDocs, collection, updateDoc, deleteDoc } from "firebase/firestore"
import { useUsuario } from './UsuarioContext.jsx';
import DeleteUser from './configuración/DeleteUser.jsx';

function App() {
  
  const {usuario, setUsuario} = useUsuario();
  const [listas, setListas] = useState([])
  const [deletedLista, setDeletedLista] = useState([])
  const [sharePopupVisible, setSharePopupVisible] = useState (false)
  // const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()
  // console.log({deletedLista})

  useEffect(() => {
    if (process.env.REACT_APP_ENV === 'lighthouse') {
      setUsuario({
        uid: 'testUserId',
        nombre: 'Test',
        apellido: 'User',
        email: 'test@example.com',
      });
    }
  }, [setUsuario]);
  

  const usuarioCompleto = `${usuario?.nombre} ${usuario?.apellido}`

  const loadListasFromFirebase = async () => {
    if (!usuario || !usuario.uid) {
      console.warn("El usuario no está autenticado. Cargando usuario...");
      return; // No continuar si el usuario no está autenticado
    }
    try {
      const querySnapshot = await getDocs(collection(db, "listas"));
      const loadedListas = querySnapshot.docs.map(doc => doc.data());
      const filteredListas = loadedListas.filter(lista => 
        lista.userCreator === usuario.uid || lista.userMember.includes(usuario.uid)
      )
      setListas(filteredListas);
    } catch (error) {
      console.error("Error al cargar las listas desde Firebase:", error);
    }
  }

  useEffect(() => {
    if(usuario && usuario.uid) {
      loadListasFromFirebase()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[usuario]);

  const addLista = async (listaName, plan, descriptionLista) => {
    const newLista = { id: uuidv4(), listaName, userCreator: usuario.uid, userMember: [], createdAt: new Date(), plan, descriptionLista, categories: [], items: [], isArchived: false, isNotified: false }
    try {
      await setDoc(doc(db, "listas", newLista.id), newLista);
      setListas(prevListas => [...prevListas, newLista]);
      return newLista // Lo añado para que FormLista reciba newLista asíncronamente y sepa dónde redirigirlo
    } catch (error) {
      console.error("Error al guardar la lista en Firebase:", error);
    }
  }

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

  const duplicarLista = async (id) => {
    const originalLista = listas.find(lista => lista.id === id)
    if (!originalLista) {
      console.error("Lista original no encontrada");
      return;
    }
    const duplicateLista = { ...originalLista, id: uuidv4(), userCreator: usuario.uid, userMember: [], categories: originalLista.categories.map(category => ({...category, id: uuidv4(), items: category.items.map(item => ({...item, id: uuidv4()}))})), items: originalLista.items.map(item => ({...item, id: uuidv4()}))}

    try {
      await setDoc(doc(db, "listas", duplicateLista.id), duplicateLista);
      setListas(prevListas => [...prevListas, duplicateLista]);
    } catch (error) {
      console.error("Error al guardar la lista duplicada en Firebase:", error);
    }  
  }

  const handleDuplicate = (id) => {
    duplicarLista(id)
    navigate("/")
  }

  const handleNotified = (id, event) => {
    setListas(prevListas => {
      const notified = prevListas.map(lista =>
      lista.id === id ? { ...lista, isNotified: !lista.isNotified } : lista
      )
      return notified
    })
  }

  return (
    <>
      <div>
        <Toaster position="bottom-center" reverseOrder={false} />
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
                  usuario={usuario}
                  addLista={addLista}
                  listas={listas.filter((lista) => !lista.isArchived)}
                  setListas={setListas}
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
                  usuario={usuario}
                  sharePopupVisible={sharePopupVisible}
                  setSharePopupVisible={setSharePopupVisible}
                />}
              />
              <Route path="/newlist/" element={
                <FormLista 
                  addLista={addLista}
                  listas={listas}
                  setSharePopupVisible={setSharePopupVisible}
                />}
              />
              <Route path="/archived/" element={
                <Archived
                  goToArchived={goToArchived}
                  listas={listas.filter((lista) => lista.isArchived)}
                  handleArchive={handleArchive}
                  deleteLista={deleteLista}
                />}
              />
              <Route path="/profile" element={
                <Perfil
                  usuario={usuario.nombre}
                  usuarioCompleto={usuarioCompleto}
                  correoUsuario={usuario.email}
                />}
              />
              <Route path="/settings" element={
                <Settings
                  usuario={usuario.nombre}
                  usuarioCompleto={usuarioCompleto}
                  correoUsuario={usuario.email}
                />}
              />
              <Route path="/password" element={
                <NewPassword
                  usuario={usuario}
                />}
              />
              <Route path="/deleteuser" element={
                <DeleteUser
                  usuario={usuario}
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