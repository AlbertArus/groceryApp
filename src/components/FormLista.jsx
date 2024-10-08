import { useState } from "react";
import { useNavigate } from "react-router-dom"
import Head from "./Head";

const FormLista = ({ addLista, listas, setSharePopupVisible}) => {
  const [listaName, setListaName] = useState("");
  const [errors, setErrors] = useState({listaName: false, plan: false})
  const [plan, setPlan] = useState("");
  const [descriptionLista, setDescriptionLista] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrors({
      listaName: (listaName.trim() === ""),
      plan: (plan.trim() === "")
    })

    if (listaName.trim() && plan.trim()) {
      try {
        const nuevaLista = await addLista(listaName, plan, descriptionLista)
        navigate(`/list/${nuevaLista.id}`)
        setSharePopupVisible(true)
      } catch (error) {
        console.error("Error al crear la lista:", error)
      }
    }
  }

  const maxLength = 27

  const handleNewListaName = (event) => {
    const newListaName = event.target.value
    if(newListaName.length <= maxLength) {
      setListaName(newListaName)
      setErrors(prevErrors => ({...prevErrors, listaName: false }))
    }
  }

  return (
      <div className="FormLista app">
        <Head
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
            <select id="plan" onChange={(e) => {setPlan(e.target.value); setErrors(prevErrors => ({...prevErrors, listaName: false }))}} value={plan} style={{marginTop:"5px"}}>
              <option value="">Selecciona un plan</option>
              <option value="Viaje">Viaje</option>
              <option value="Casa compartida">Casa compartida</option>
              <option value="Compra semanal">Compra semanal</option>
            </select>
            <h5 style={{display: errors.plan ? "block" : "none", color:"red"}}>Selecciona el tema de tu lista</h5>
            <label htmlFor="descripcion"> Descripción (opcional) </label>
            <textarea id="descripcion" placeholder="Finde de chicas en L'Escala" onChange={(e) => setDescriptionLista(e.target.value)} value={descriptionLista} />
            <button type="submit">Crear lista</button>
          </form>
        </div>
        {/* <div className="fila-start">
    <div className="fila-start iconPlan">
      <span className="material-symbols-outlined">travel</span>
      <div>Viaje</div>
    </div>
    <div className="fila-start iconPlan">
      <span className="material-symbols-outlined">house</span>
      <h5>Casa compartida</h5>
    </div>
    <div className="fila-start iconPlan">
      <span className="material-symbols-outlined">shopping_cart</span>
      <h5>Compra semanal</h5>
    </div>
  </div> */}
      </div>
  );
};

export default FormLista;
