import { useState } from "react";
import { useNavigate } from "react-router-dom"

const FormLista = ({ addLista, listas}) => {
  const [listaName, setListaName] = useState("");
  const [plan, setPlan] = useState("");
  const [descriptionLista, setDescriptionLista] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (listaName.trim() && plan.trim()) {
      try {
        const nuevaLista = await addLista(listaName, plan, descriptionLista)
        navigate(`/list/${nuevaLista.id}`)
      } catch (error) {
        console.error("Error al crear la lista:", error)
      }
    }
  }

  return (
      <div className="FormLista">
        <div className="head">
            <div className="app-margin">
                <div className="headerLista">
                    <div className="headerArrow">
                        <span className="material-symbols-outlined icon-large" onClick={() => navigate("/")}>arrow_back</span>
                    </div>
                    <div className="headerText" style={{flex: "1"}}>
                        <div className="fila-between">
                            <h2 className="headerTitle">Nueva lista</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="app-margin" style={{display:"flex", flexDirection:"column"}}>
          <h4 style={{ fontWeight: "500", margin: "20px 0px" }}>Configura tu nueva lista</h4>
          <form onSubmit={handleSubmit}>
            <label htmlFor="nombre">Nombre</label>
            <input type="text" placeholder="Finde en la costa" id="nombre" onChange={(e) => setListaName(e.target.value)} value={listaName} required />
            <label htmlFor="plan">Plan</label>
            <select id="plan" onChange={(e) => setPlan(e.target.value)} value={plan} required >
              <option value="">Selecciona un plan</option>
              <option value="Viaje">Viaje</option>
              <option value="Casa compartida">Casa compartida</option>
              <option value="Compra semanal">Compra semanal</option>
            </select>
            <label htmlFor="descripcion"> Descripción (opcional) </label>
            <textarea id="descripcion" placeholder="Finde de chicas en L'Escala" onChange={(e) => setDescriptionLista(e.target.value)} value={descriptionLista} />
            <button type="submit">Crear lista</button>
          </form>
          {/* <span class="material-symbols-outlined">travel</span>
          <span class="material-symbols-outlined">home</span>
          <span class="material-symbols-outlined">repeat</span> */}
        </div>
      </div>
  );
};

export default FormLista;
