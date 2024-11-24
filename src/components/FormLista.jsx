import { useState } from "react";
import { useNavigate } from "react-router-dom"
import Head from "./Head";
import '@material/web/switch/switch.js';
import ButtonArea from "../ui-components/ButtonArea";

const FormLista = ({ addLista, listas, setSharePopupVisible}) => {
  const [listaName, setListaName] = useState("");
  const [errors, setErrors] = useState({listaName: false, plan: false})
  const [plan, setPlan] = useState("");
  const [descriptionLista, setDescriptionLista] = useState("");
  const [showVotes, setShowVotes] = useState(true)
  const [showPrices, setShowPrices] = useState(true)
  const [isNotified, setIsNotified] = useState(true)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrors({
      listaName: (listaName.trim() === ""),
      plan: (plan.trim() === "")
    })

    if (listaName.trim() && plan.trim()) {
      try {
        const nuevaLista = await addLista(listaName, plan, descriptionLista, showVotes, showPrices, isNotified)
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
    <ButtonArea 
        onClick={handleSubmit}
        buttonCopy={"Crear lista"}
    >
        <div className="FormLista app">
            <Head
            path={""}          
            sectionName={"Nueva lista"}
            />
            <div className="app-margin" style={{display:"flex", flexDirection:"column"}}>
            <h3 style={{ fontWeight: "500", margin: "20px 0px" }}>Configura tu nueva lista</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre</label>
                    <div className="iconed-container fila-between">
                    <input type="text" placeholder="Finde en la costa" id="nombre" onChange={(e) => handleNewListaName(e)} value={listaName}/>
                    <div className="iconSuperpuesto" style={{paddingRight:"5px"}}>{listaName.length}/{maxLength}</div>
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
                    <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
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
                        style={{ transform: 'scale(0.7)'}} icons show-only-selected-icon aria-label="Precios visibles" onInput={() => handleSwitchChange(setShowPrices)} selected value={showVotes}
                        ></md-switch>              
                    </div>
                    <div className="fila-between">
                        <label htmlFor="switch" style={{marginTop: "0px"}}>Activar notificaciones</label>
                        <md-switch
                        style={{ transform: 'scale(0.7)'}} icons show-only-selected-icon aria-label="Notificaciones activadas" onInput={() => handleSwitchChange(setIsNotified)} selected value={showVotes} 
                        ></md-switch>              
                    </div>
                    {/* <h5>Elige qué quieres ver en tu lista</h5> */}
                    {/* <md-chip-set style={{}}>
                        <md-filter-chip label="Precios" hasIcon hasSelectedIcon selected>
                        <span slot="icon" className="material-symbols-outlined">content_copy</span>
                        <span slot="selected-icon" className="material-symbols-outlined">content_copy</span>
                        </md-filter-chip>
                        <md-filter-chip label="Votos" selected></md-filter-chip>
                        <md-filter-chip label="Notificaciones"selected></md-filter-chip>
                    </md-chip-set> */}
                    <h6>* Podrás modificar tu preferencia más tarde</h6>
                    </div>
                    {/* <button type="submit">Crear lista</button> */}
                </form>
            </div>
        </div>
    </ButtonArea>
  );
};

export default FormLista;
