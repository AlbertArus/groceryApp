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
import DeleteUser from './configuración/DeleteUser.jsx';
import LoadingPage from './components/LoadingPage.jsx';

import { db } from "./firebase-config.js"
import { doc, setDoc, getDocs, collection, updateDoc, deleteDoc, getDoc } from "firebase/firestore"
import { useUsuario } from './UsuarioContext.jsx';
import NewPayment from './Pagos/NewPayment.jsx';
import PaymentDetail from './Pagos/PaymentDetail.jsx';

function App() {
  
  const {usuario, setUsuario} = useUsuario();
  const [listas, setListas] = useState([])
  const [deletedLista, setDeletedLista] = useState([])
  const [sharePopupVisible, setSharePopupVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [listasLoaded, setListasLoaded] = useState(false)
  const [paymentName, setPaymentName] = useState("")
  const [amount, setAmount] = useState("")
  const [payer, setPayer] = useState("")
  const [elementsPaid, setElementsPaid] = useState([])

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
    if (usuario === undefined) {
      return
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
    // Google Analytics: Envía un pageview cada vez que cambie la ubicación (ruta)
    window.gtag('config', 'G-DQMEE49WTB', {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  const addLista = async (listaName, plan, descriptionLista, showVotes, showPrices, isNotified, membersUID) => {
    const newLista = { id: uuidv4(), listaName, userCreator: usuario.uid, userMember: [usuario.uid, ...membersUID], createdAt: new Date(), plan, descriptionLista, categories: [], items: [], payments: [], isArchived: false, isNotified, showPrices, showVotes, isPaid: false, listPrice: "" }
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
  
  const archivedList = listas.filter(lista => lista.isArchived)
  const AllArchived = archivedList.length

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

  const updateLista = async (listaId, attribute, newValue) => {
    setListas((prevListas) =>
      prevListas.map((lista) =>
        lista.id === listaId ? { ...lista, [attribute]: newValue } : lista
      )
    );
  
    try {
      const listaRef = doc(db, "listas", listaId);
      await updateDoc(listaRef, { [attribute]: newValue });
      console.log("lista actualizada")
    } catch (error) {
      console.error(`Error al actualizar ${attribute} en Firebase:`, error);
    }
  };

  const UsuarioCompleto = useCallback(async (uid) => {
    const userDoc = await getDoc(doc(db, "usuarios", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return `${userData.displayName}`;
    }
    return "Usuario desconocido";
  },[])

    const AddPayment = (lista, listaId, paymentName, amount, payer, members) => {

        const newPayment = { id: uuidv4(), listaId: listaId, paymentCreator: usuario.uid, createdAt: new Date(), payer, paymentName, amount, members, elementsPaid }
        const updatedPayments = [...lista.payments, newPayment]
        updateLista(listaId, "payments", updatedPayments)
        if(elementsPaid.length !== 0) {
            const selectItemsPaid = elementsPaid.map(paid => paid.item);
            const getItemsPaid = lista.categories.map(category => ({
                ...category,
                items: category.items.map(item =>
                    selectItemsPaid.includes(item.id) 
                        ? { ...item, isPaid: true, payer } 
                        : item
                )
            }))
            updateLista(listaId, "categories", getItemsPaid)
        }
    }

    const editPayment = (lista, listaId, paymentId, paymentName, amount, payer, members) => {
        const editedPayment = lista.payments.find(payment => payment.id === paymentId)
        console.log(editedPayment)
        const newDataPayment = {...editedPayment, payer: payer, paymentName: paymentName, amount: amount, members: members, elementsPaid: elementsPaid, modifiedAt: new Date() }
        console.log(newDataPayment)
        const updatedPayments = lista.payments.map(payment => 
            payment.id === paymentId ? newDataPayment : payment
        )
        updateLista(listaId, "payments", updatedPayments)
        // if(elementsPaid.length !== 0) {
        //     const selectItemsPaid = elementsPaid.map(paid => paid.item);
        //     const getItemsPaid = lista.categories.map(category => ({
        //         ...category,
        //         items: category.items.map(item =>
        //             selectItemsPaid.includes(item.id) 
        //                 ? { ...item, isPaid: true, payer } 
        //                 : item
        //         )
        //     }))
        //     updateLista(listaId, "categories", getItemsPaid)
        // }
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
                deleteLista={deleteLista}
                updateListaCategories={updateListaCategories}
                updateListaItems={updateListaItems}
                AllArchived={AllArchived}
                handleDuplicate={handleDuplicate}
                updateLista={updateLista}
              />}
            />
            <Route path="/list/:id" element={
              <Lista
                listas={listas}
                setListas={setListas}
                deleteLista={deleteLista}
                updateListaCategories={updateListaCategories}
                updateListaItems={updateListaItems}
                usuario={usuario}
                sharePopupVisible={sharePopupVisible}
                setSharePopupVisible={setSharePopupVisible}
                UsuarioCompleto={UsuarioCompleto}
                updateLista={updateLista}
                AddPayment={AddPayment}
              />}
            />
            <Route path="/newlist" element={
              <FormLista 
                addLista={addLista}
                listas={listas}
                setSharePopupVisible={setSharePopupVisible}
              />}
            />
            <Route path="/archived" element={
              <Archived
                listas={listas.filter((lista) => lista.isArchived)}
                deleteLista={deleteLista}
                updateLista={updateLista}
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
            <Route path='/list/:id/newpayment/:paymentId?' element={
              <NewPayment
                updateLista={updateLista}
                listas={listas}
                UsuarioCompleto={UsuarioCompleto}
                AddPayment={AddPayment}
                paymentName={paymentName}
                setPaymentName={setPaymentName}
                payer={payer}
                setPayer={setPayer}
                amount={amount}
                setAmount={setAmount}
                elementsPaid={elementsPaid}
                setElementsPaid={setElementsPaid}
                editPayment={editPayment}
              />}
            />           
            <Route path='/list/:id/:paymentId' element={
              <PaymentDetail
                listas={listas}
                UsuarioCompleto={UsuarioCompleto}
                updateLista={updateLista}
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