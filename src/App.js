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
import CreateReplacementUser from './functions/CreateReplacementUser.jsx';

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
  const [showIdentifyList, setShowIdentifyList] = useState(false);

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
        lista.userCreator === usuario.uid || lista.userMember.includes(usuario.uid) || showIdentifyList
      )
      setListas(filteredListas)
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
        } else if(usuario) {
            loadListasFromFirebase();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuario, listasLoaded, showIdentifyList]);

  useEffect(() => {
    // Google Analytics: Envía un pageview cada vez que cambie la ubicación (ruta)
    window.gtag('config', 'G-DQMEE49WTB', {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  const addLista = async (listaName, plan, descriptionLista, showVotes, showPrices, isNotified, membersUID) => {
    const userConfig = {[usuario.uid]: {isArchived: false, isNotified, showPrices, showVotes}}
    const newLista = { id: uuidv4(), listaName, userCreator: usuario.uid, userMember: [usuario.uid, ...membersUID], createdAt: new Date().toISOString(), plan, descriptionLista, categories: [], items: [], payments: [], userConfig, isPaid: false, listPrice: 0 }
    try {
      await setDoc(doc(db, "listas", newLista.id), newLista);
      setListas(prevListas => [...prevListas, newLista]);
      return newLista // Lo añado para que FormLista reciba newLista asíncronamente y sepa dónde redirigirlo
    } catch (error) {
        console.error("Error al guardar la lista en Firebase:", error);
    }
  }

    const editLista = async (listaId, lista, listaName, plan, descriptionLista, membersUID) => {
        const newMemberUIDOnItem = lista.categories.map(category => ({
            ...category, items: category.items.map(item => ({
                ...item, itemUserMember: [...item.itemUserMember, ...membersUID]
            }))
        }))
        const editedLista = { ...lista, listaName, plan, descriptionLista, categories: newMemberUIDOnItem}
        setListas(prevListas => prevListas.map(lista => lista.id === listaId ? editedLista : lista))
        // updateLista(listaId, "lista", editedLista)
        const listaRef = doc(db, "listas", listaId);
        await updateDoc(listaRef, { listaName: listaName, userMember: [...lista.userMember, ...membersUID], plan: plan, descriptionLista: descriptionLista, categories: newMemberUIDOnItem, modifiedAt: new Date().toISOString() });
    }
  
    const deleteLista = async (id) => {
        const listToDelete = listas.find(lista => lista.id === id);
        if (!listToDelete) {
            console.warn("La lista a eliminar no se encontró en el estado");
            return;
        }
    
        const listsToDelete = [...deletedLista, listToDelete];
        setDeletedLista(listsToDelete);
        
        try {
            await updateDoc(doc(db, "listas", id), {deleted: true});
            setListas(prev => prev.filter(lista => lista.id !== id));
            navigate("/");
        } catch (error) {
            console.error("Error al marcar la lista como eliminada:", error);
            setDeletedLista(prev => prev.filter(lista => lista.id !== id));
            return;
        }

        let membersRegistered = [];
        try {
            const membersMail = await Promise.all(
                listToDelete.userMember.map(async (member) => {
                    const userDoc = await getDoc(doc(db, "usuarios", member));
                    
                    if(userDoc.exists()) {
                        const userData = userDoc.data();
                        if (userData.email !== undefined && userData.email !== "") {
                            return member;
                        }
                    }
                    return null;
                })
            );
            membersRegistered = membersMail.filter(Boolean);
        } catch (error) {
            console.error("Error al obtener los miembros:", error);
            // Continuamos con la ejecución aunque falle la obtención de miembros
        }
    
        const handleUndo = () => {
            undoDelete(listToDelete.id, listsToDelete);
            clearTimeout(timeoutId);
        };
    
        let timeoutId;
        toast((t) => (
            <span style={{ display: "flex", alignItems: "center" }}>
                <span className="material-symbols-outlined" style={{ marginRight: "8px", color: "#9E9E9E" }}>warning</span>
                {`Has eliminado "${listToDelete.listaName}"`}
                <button 
                    onClick={() => { 
                        handleUndo();
                        toast.dismiss(t.id);
                    }}
                    style={{ 
                        marginLeft: "10px",
                        padding: "0",
                        backgroundColor: "#FBE7C1",
                        border: "none",
                        fontFamily: "poppins",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer"
                    }}
                >
                    Deshacer
                </button>
            </span>
        ), {
            style: { border: "2px solid #ED9E04", backgroundColor: "#FBE7C1" }
        });
    
        timeoutId = setTimeout(async () => {
            try {
                if(membersRegistered.length > 1) {
                    await CreateReplacementUser({usuario, UsuarioCompleto, updateLista, listas, setListas});
                    setDeletedLista(prev => prev.filter(lista => lista.id !== id));
                } else {
                    setListas(prevListas => prevListas.filter(lista => lista.id !== id));
                    await deleteDoc(doc(db, "listas", id));
                    setDeletedLista(prev => prev.filter(lista => lista.id !== id));
                }
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        }, 5000);
    };
    
    const undoDelete = useCallback((id, currentDeletedLista) => {
        const listaToRestore = currentDeletedLista.find(lista => lista.id === id);
        
        if (listaToRestore) {
            setListas(prevListas => [...prevListas, listaToRestore]);
            setDeletedLista(prev => prev.filter(lista => lista.id !== id));
            
            updateDoc(doc(db, "listas", listaToRestore.id), { deleted: false })
                .catch(error => {
                    console.error("Error al restaurar la lista en Firebase:", error);
                }
            );
        }
    }, []);
  
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

  const archivedList = usuario?.uid ? listas?.filter(lista => lista.userConfig?.[usuario.uid]?.isArchived) : [];

  const AllArchived = archivedList.length

    const handleArchive = (lista) => {
        const updatedArchived = {...lista.userConfig, [usuario.uid]: {...lista.userConfig[usuario.uid], isArchived: !lista.userConfig[usuario.uid].isArchived}}
        updateLista(lista.id, "userConfig", updatedArchived)
    }

    const handleIsNotified = (lista) => {
        const updatedNotitied = {...lista.userConfig, [usuario.uid]: {...lista.userConfig[usuario.uid], isNotified: !lista.userConfig[usuario.uid].isNotified}}
        updateLista(lista.id, "userConfig", updatedNotitied)
    }

    const handleShowVotes = (lista) => {
        const updatedShowVotes = {...lista.userConfig, [usuario.uid]: {...lista.userConfig[usuario.uid], showVotes: !lista.userConfig[usuario.uid].showVotes}}
        updateLista(lista.id, "userConfig", updatedShowVotes)
    }

    const handleShowPrices = (lista) => {
        const updatedShowPrices = {...lista.userConfig, [usuario.uid]: {...lista.userConfig[usuario.uid], showPrices: !lista.userConfig[usuario.uid].showPrices}}
        updateLista(lista.id, "userConfig", updatedShowPrices)
    }

  const duplicarLista = async (id) => {
    const originalLista = listas.find(lista => lista.id === id)
    if (!originalLista) {
      console.error("Lista original no encontrada"); // Cuando intenta duplicar una lista borrada que aun se veía por tenerla abierta pero no actualizada
      return;
    }
    const duplicateListaId = uuidv4()
    const duplicateUserMember = originalLista.userMember
    const categoryIdMap = new Map();
    const duplicateCategories = originalLista.categories.map(category => {
      const newCategoryId = uuidv4()
      categoryIdMap.set(category.id, newCategoryId)
      return {...category, id: newCategoryId, listaId: duplicateListaId, items: category.items.map(item => 
        ({ ...item, id: uuidv4(), listaId: duplicateListaId, categoryId: newCategoryId}))
      }
    });
    const duplicateLista = { ...originalLista, id: duplicateListaId, userCreator: usuario.uid, userMember: duplicateUserMember, categories: duplicateCategories, items: originalLista.items.map(item => ({...item, listaId: duplicateListaId, id: uuidv4()}))}

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

    const AddPayment = (lista, listaId, paymentName, amount, payer, members, elementsPaid) => {

        const newPayment = { id: uuidv4(), listaId: listaId, paymentCreator: usuario.uid, createdAt: new Date().toISOString(), payer, paymentName, amount, members, elementsPaid: elementsPaid || [] }
        const updatedPayments = [...lista.payments, newPayment]
        updateLista(listaId, "payments", updatedPayments)
        if(elementsPaid && elementsPaid.length > 0) {
            const selectItemsPaid = elementsPaid.map(elementPaid => elementPaid.item);
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

    const editPayment = (lista, listaId, paymentId, paymentName, amount, payer, members, elementsPaid) => {
        const editedPayment = lista.payments.find(payment => payment.id === paymentId)
        const newDataPayment = {...editedPayment, payer: payer, paymentName: paymentName, amount: amount, members: members, elementsPaid: elementsPaid, modifiedAt: new Date().toISOString() }
        const updatedPayments = lista.payments.map(payment => 
            payment.id === paymentId ? newDataPayment : payment
        )
        updateLista(listaId, "payments", updatedPayments)
        if(elementsPaid.length > 0) {
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
                listas={listas.filter(lista => !archivedList.includes(lista))}
                deleteLista={deleteLista}
                updateListaCategories={updateListaCategories}
                updateListaItems={updateListaItems}
                AllArchived={AllArchived}
                handleDuplicate={handleDuplicate}
                updateLista={updateLista}
                handleArchive={handleArchive}
                handleIsNotified={handleIsNotified}
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
                showIdentifyList={showIdentifyList}
                setShowIdentifyList={setShowIdentifyList}
                handleArchive={handleArchive}
                handleShowVotes={handleShowVotes}
                handleShowPrices={handleShowPrices}
              />}
            />
            <Route path="/newlist" element={
              <FormLista 
                addLista={addLista}
                editLista={editLista}
                listas={listas}
                setListas={setListas}
                setSharePopupVisible={setSharePopupVisible}
                UsuarioCompleto={UsuarioCompleto}
                updateLista={updateLista}
              />}
            />
            <Route path="/archived" element={
              <Archived
                listas={listas.filter(lista => archivedList.includes(lista))}
                deleteLista={deleteLista}
                updateLista={updateLista}
                usuario={usuario}
                handleArchive={handleArchive}
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
                UsuarioCompleto={UsuarioCompleto}
                listas={listas}
                setListas={setListas}
                updateLista={updateLista}
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