import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import LoadingPage from './components/LoadingPage.jsx';

function App() {
  
  const {usuario, setUsuario} = useUsuario();
  const [listas, setListas] = useState([])
  const [deletedLista, setDeletedLista] = useState([])
  const [sharePopupVisible, setSharePopupVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [listasLoaded, setListasLoaded] = useState(false)
  const navigate = useNavigate()
  const location = useLocation();
  
  const loadListasFromFirebase = async () => {
    if (!usuario || !usuario.uid) {
      console.warn("El usuario no está autenticado. Cargando usuario...");
      return
    }
    try {
      const querySnapshot = await getDocs(collection(db, "listas"));
      const loadedListas = querySnapshot.docs.map(doc => doc.data());
      const filteredListas = loadedListas.filter(lista => 
        lista.userCreator === usuario.uid || lista.userMember.includes(usuario.uid)
      )
      setListas(filteredListas);
      setListasLoaded(true)
    } catch (error) {
      console.error("Error al cargar las listas desde Firebase:", error);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Espera hasta que la verificación de auth esté completa
    if (usuario === undefined) {
      return; // Todavía se está verificando el usuario
    }
    if (usuario === null) {
      setIsLoading(false);
      navigate("/registro");
    } else {
      loadListasFromFirebase();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [usuario]);

  useEffect(() => {
    if(usuario && listasLoaded)  {
      setIsLoading(false)
    }
  },[usuario, listasLoaded])

  useEffect(() => {
    // Envía un pageview cada vez que cambie la ubicación (ruta)
    window.gtag('config', 'G-DQMEE49WTB', {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  const addLista = async (listaName, plan, descriptionLista, showVotes, showPrices, isNotified) => {
    const newLista = { id: uuidv4(), listaName, userCreator: usuario.uid, userMember: [usuario.uid], createdAt: new Date(), plan, descriptionLista, categories: [], items: [], isArchived: false, isNotified, showPrices, showVotes }
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
    if (!ListToDelete) {
      console.warn("La lista a eliminar no se encontró en el estado");
      return;
    }
  
    // Actualizar el estado local para eliminar la lista
    setListas(prevListas => prevListas.filter(lista => lista.id !== id));
    setDeletedLista(prev => [...prev, ListToDelete]);
  
    let timeoutId;
    try {
      // Actualizar Firebase para marcar como eliminada
      await updateDoc(doc(db, "listas", id), { deleted: true });
  
      // Navegar a Home después de actualizar Firebase
      navigate("/");
  
      // Mostrar notificación con opción de deshacer
      toast((t) => (
        <span style={{ display: "flex", alignItems: "center" }}>
          <span className="material-symbols-outlined" style={{ marginRight: "8px", color: "#9E9E9E" }}>warning</span>
          {`Has eliminado "${ListToDelete.listaName}"`}
          <button onClick={() => { 
              undoDelete(ListToDelete.id); 
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
  
      // Eliminar definitivamente de Firebase después de 3 segundos
      timeoutId = setTimeout(async () => {
        try {
          await deleteDoc(doc(db, "listas", id));
          setDeletedLista(prev => prev.filter(lista => lista.id !== id));
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
      console.log("Firebase updated successfully");
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
    const duplicateListaId = uuidv4()
    const categoryIdMap = new Map();
    const duplicateCategories = originalLista.categories.map(category => {
      const newCategoryId = uuidv4()
      categoryIdMap.set(category.id, newCategoryId)
      return {...category, id: newCategoryId, listaId: duplicateListaId, items: category.items.map(item => 
        ({ ...item, id: uuidv4(), listaId: duplicateListaId, categoryId: newCategoryId}))
      }
    }); 
    const duplicateLista = { ...originalLista, id: duplicateListaId, userCreator: usuario.uid, userMember: [usuario.uid], categories: duplicateCategories, items: originalLista.items.map(item => ({...item, listaId: duplicateListaId, id: uuidv4()}))}

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

  const handleNotified = (id) => {
    setListas(prevListas => {
      const notified = prevListas.map(lista =>
      lista.id === id ? { ...lista, isNotified: !lista.isNotified } : lista
      )
      return notified
    })
  }

  const updateLista = async (listaId, attribute, newValue) => {
    setListas((prevListas) =>
      prevListas.map((lista) =>
        lista.id === listaId ? { ...lista, [attribute]: newValue } : lista
      )
    );
  
    try {
      const listaRef = doc(db, "listas", listaId);
      await updateDoc(listaRef, { [attribute]: newValue });
    } catch (error) {
      console.error(`Error al actualizar ${attribute} en Firebase:`, error);
    }
  };

  const handleOcultarPrecios = (id, showPrices) => {
    updateLista(id, "showPrices", !showPrices)
  }

  const handleVotesVisible = (id, showVotes) => {
    updateLista(id, "showVotes", !showVotes)
  }

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
      <div>
        <Toaster position="bottom-center" reverseOrder={false} />
        <Routes>
        <Route path="/registro" element={
          <Registro 
            setUsuario={setUsuario}
          />}
        />
        {usuario && listasLoaded ? (
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
                handleOcultarPrecios={handleOcultarPrecios}
                handleVotesVisible={handleVotesVisible}
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
                usuario={usuario}
              />}
            />
            <Route path="/settings" element={
              <Settings
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
    )}
    </>
  )
}

export default App;