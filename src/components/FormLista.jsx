import { useState } from "react";
import { useNavigate } from "react-router-dom"
import Head from "./Head";
import '@material/web/switch/switch.js';
import ButtonArea from "../ui-components/ButtonArea";
import NewMembers from "./MembersNew.jsx";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase-config.js";
import { v4 as uuidv4 } from 'uuid'

const FormLista = ({ addLista, listas, setSharePopupVisible}) => {
    const [listaName, setListaName] = useState("");
    const [errors, setErrors] = useState({listaName: false, plan: false})
    const [plan, setPlan] = useState("");
    const [descriptionLista, setDescriptionLista] = useState("");
    const [showVotes, setShowVotes] = useState(true)
    const [showPrices, setShowPrices] = useState(true)
    const [isNotified, setIsNotified] = useState(true)
    const [membersToAdd, setMembersToAdd] = useState([""])
    const navigate = useNavigate()

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
    
    setErrors({
        listaName: (listaName.trim() === ""),
        plan: (plan.trim() === "")
    })
        const membersUID = await createUsers()
        if (listaName.trim() && plan.trim()) {
        try {
            const nuevaLista = await addLista(listaName, plan, descriptionLista, showVotes, showPrices, isNotified, membersUID)
            navigate(`/list/${nuevaLista.id}`)
            setSharePopupVisible(true)
        } catch (error) {
            console.error("Error al crear la lista:", error)
        }
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
    <div className="FormLista app">
        <Head
        path={""}          
        sectionName={"Nueva lista"}
        />
        <ButtonArea 
            onClick={handleSubmit}
            buttonCopy={"Crear lista"}
        >
            <div className="app-margin" style={{display:"flex", flexDirection:"column"}}>
                <h3 style={{ fontWeight: "500", margin: "20px 0px" }}>Configura tu nueva lista</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre</label>
                    <div className="iconed-container fila-between">
                    <input type="text" placeholder="Finde en la costa" id="nombre" onChange={(e) => handleNewListaName(e)} value={listaName}/>
                    <div className="iconSuperpuesto">{listaName.length}/{maxLength}</div>
                    </div>
                    <h5 style={{display: errors.listaName ? "block" : "none", color:"red"}}>Añade un nombre a tu lista</h5>
                    <label htmlFor="plan">Plan</label>
                    <select id="plan" onChange={(e) => {setPlan(e.target.value); setErrors(prevErrors => ({...prevErrors, plan: false }))}} value={plan}>
                    <option value="">Selecciona un plan</option>
                    <option value="Viaje">Viaje</option>
                    <option value="Casa compartida">Casa compartida</option>
                    <option value="Compra semanal">Compra semanal</option>
                    </select>
                    <h5 style={{display: errors.plan ? "block" : "none", color:"red"}}>Selecciona el tema de tu lista</h5>
                    <label htmlFor="descripcion"> Descripción (opcional) </label>
                    <textarea id="descripcion" placeholder="Finde de chicas en L'Escala" onChange={(e) => setDescriptionLista(e.target.value)} value={descriptionLista} />
                    <div style={{display: "flex", flexDirection: "column", width: "100%", marginTop: "8px"}}>
                        <div className="fila-between">
                            {/* <h4>Mostrar votos</h4> */}
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
                </form>
                <div style={{marginTop: "10px"}}>
                    <NewMembers
                        membersToAdd={membersToAdd}
                        setMembersToAdd={setMembersToAdd}
                    />
                </div>
            </div>
        </ButtonArea>
    </div>
  );
};

export default FormLista;
