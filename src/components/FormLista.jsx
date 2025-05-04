import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import Head from "./Head";
import '@material/web/switch/switch.js';
import NewMembers from "./MembersNew.jsx";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase-config.js";
import { v4 as uuidv4 } from 'uuid'
import Button from "../ui-components/Button.jsx";

const FormLista = ({ addLista, editLista, listas, setSharePopupVisible, UsuarioCompleto, setListas, updateLista}) => {
    const [listaName, setListaName] = useState("");
    const [errors, setErrors] = useState({listaName: false, plan: false})
    const [plan, setPlan] = useState("");
    const [descriptionLista, setDescriptionLista] = useState("");
    const [showVotes, setShowVotes] = useState(true)
    const [showPrices, setShowPrices] = useState(true)
    const [isNotified, setIsNotified] = useState(true)
    const [membersToAdd, setMembersToAdd] = useState([""])
    const [currentMembers, setCurrentMembers] = useState([])
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const listaId = searchParams.get("lista")
    const lista = listas.find(lista => lista.id === listaId)
    const [inactive, setInactive] = useState(false)

    useEffect(() => {
        if(listaId && lista) {
            setListaName(lista.listaName)
            setPlan(lista.plan)
            setDescriptionLista(lista.descriptionLista)
            setCurrentMembers(lista.userMember)
        } else {
            setListaName("")
            setPlan("")
            setDescriptionLista("")
            setCurrentMembers([])
        }
    }, [lista, listaId, setDescriptionLista, setListaName, setPlan, setCurrentMembers])

    const createUsers = async() => {
        try{
            const membersUID = []
            membersToAdd.forEach(async(member) => {
                if(member !== "" ) {
                    const uid = uuidv4()
                    membersUID.push(uid)
                    const newMember = doc(db, "usuarios", uid);
                    const data = {
                        uid,
                        nombre: member,
                        displayName: member,
                        createdAt: new Date().toISOString(),
                    }
                    await setDoc(newMember, data);
                }
            })
        return membersUID
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async (e) => {
    e.preventDefault()
    setInactive(true)
    
    setErrors({
        listaName: (listaName.trim() === ""),
        plan: (plan.trim() === "")
    })
        const membersUID = await createUsers()
        if (listaName.trim() && plan.trim()) {
            try {
                if(!listaId) {
                    const nuevaLista = await addLista(listaName, plan, descriptionLista, showVotes, showPrices, isNotified, membersUID)
                    navigate(`/list/${nuevaLista.id}`)
                    setSharePopupVisible(true)
                } else {
                    await editLista(listaId, lista, listaName, plan, descriptionLista, membersUID)
                    navigate(`/list/${lista.id}`)
                }
            } catch (error) {
                setInactive(false)
                console.error("Error al crear la lista:", error)
            }
        } else {
            setInactive(false)
        }
    }

  const maxLength = 27

  const handleNewListaName = (event) => {
    const newListaName = event.target.value.charAt(0).toUpperCase()+event.target.value.slice(1)
    if(newListaName.length <= maxLength) {
      setListaName(newListaName)
      setErrors(prevErrors => ({...prevErrors, listaName: false }))
    }
  }

  const handleSwitchChange = (setValue) => {
    setValue((prev) => !prev)
  }
  
  return (
    <div className="form app">
        <Head
            path={""}
        />
        <div className="app-margin">
            <h3 style={{ fontWeight: "500", margin: "20px 0px" }}>{!listaId ? "Configura tu nueva lista" : "Edita tu lista"}</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="nombre">Nombre</label>
                <div className="iconed-container fila-between">
                <input type="text" placeholder="Finde en la costa" id="nombre" onChange={(e) => handleNewListaName(e)} value={listaName}/>
                <div className="iconSuperpuesto">{listaName.length}/{maxLength}</div>
                </div>
                <h5 style={{display: errors.listaName ? "block" : "none", color:"red"}}>Añade un nombre a tu lista</h5>
                <label htmlFor="plan">Plan</label>
                <select id="plan" onChange={(e) => {setPlan(e.target.value); setErrors(prevErrors => ({...prevErrors, plan: false }))}} value={plan}>
                <option value="" selected disabled>Selecciona un plan</option>
                <option value="Viaje">Viaje</option>
                <option value="Casa compartida">Casa compartida</option>
                <option value="Compra semanal">Compra semanal</option>
                </select>
                <h5 style={{display: errors.plan ? "block" : "none", color:"red"}}>Selecciona el tema de tu lista</h5>
                <label htmlFor="descripcion"> Descripción (opcional) </label>
                <textarea id="descripcion" placeholder="Finde de chicas en L'Escala" style={{resize: "none"}} onChange={(e) => setDescriptionLista(e.target.value)} value={descriptionLista} />
                {!listaId && !lista && (
                    <div style={{display: "flex", flexDirection: "column", width: "100%", marginTop: "8px"}}>
                        <div className="fila-between">
                            <label htmlFor="switch" style={{marginTop: "0px"}}>Visualizar votos</label>
                            <md-switch
                            style={{ transform: 'scale(0.7)'}} icons show-only-selected-icon aria-label="Votos visibles" onInput={() => handleSwitchChange(setShowVotes)} selected value={showVotes}
                            ></md-switch>
                        </div>
                        <div className="fila-between">
                            <label htmlFor="switch" style={{marginTop: "0px"}}>Visualizar precios</label>
                            <md-switch
                            style={{ transform: 'scale(0.7)'}} icons show-only-selected-icon aria-label="Precios visibles" onInput={() => handleSwitchChange(setShowPrices)} selected value={showPrices}
                            ></md-switch>              
                        </div>
                        <div className="fila-between">
                            <label htmlFor="switch" style={{marginTop: "0px"}}>Activar notificaciones</label>
                            <md-switch
                            style={{ transform: 'scale(0.7)'}} icons show-only-selected-icon aria-label="Notificaciones activadas" onInput={() => handleSwitchChange(setIsNotified)} selected value={isNotified} 
                            ></md-switch>              
                        </div>
                        <h6>* Podrás modificar tu preferencia más tarde</h6>
                    </div>
                )}
            </form>
            <div style={{marginTop: "10px"}}>
                <NewMembers
                    membersToAdd={membersToAdd}
                    setMembersToAdd={setMembersToAdd}
                    lista={lista}
                    setListas={setListas}
                    currentMembers={currentMembers}
                    UsuarioCompleto={UsuarioCompleto}
                    updateLista={updateLista}
                />
            </div>
        </div>
        <div className="button-main-fixed">
            <Button
                onClick={handleSubmit}
                buttonCopy={!listaId ? "Crear lista": "Editar lista"}
                inactive={inactive}
            />
        </div>
    </div>
  );
};

export default FormLista;
