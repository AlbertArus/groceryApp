import { useState } from "react";

const FormLista = ({ addLista, isFormVisible, setIsFormVisible }) => {
  const [listaName, setListaName] = useState("");
  const [members, setMembers] = useState("");
  const [plan, setPlan] = useState("");
  const [descriptionLista, setDescriptionLista] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listaName.trim() && members.trim() && plan.trim()) {
      addLista(listaName, members, plan, descriptionLista);
      setListaName("");
      setMembers("");
      setPlan("");
      setDescriptionLista("");
      setIsFormVisible(false)
    }
  };

  const handleFormClose = () => {
    setIsFormVisible(false)
  }

  return (
    <div className="FormLista">
      <div className="fila-between" style={{margin:"15px"}}>
        <h5 style={{fontWeight:"600"}}>Configura tu nueva lista</h5>
        <span className="material-symbols-outlined icon-medium" onClick={handleFormClose}>close</span>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre</label>
        <input type="text" placeholder="Finde en la costa" id="nombre" onChange={(e) => setListaName(e.target.value)} value={listaName} required />
        <label htmlFor="personas">Personas</label>
        <input type="number" id="personas" placeholder="4" onChange={(e) => setMembers(e.target.value)} value={members} required
        />
        <label htmlFor="plan">Plan</label>
        <select id="plan" onChange={(e) => setPlan(e.target.value)} value={plan} required >
          <option value="">Selecciona un plan</option>
          <option value="Viaje">Viaje</option>
          <option value="Casa compartida">Casa compartida</option>
          <option value="Compra semanal">Compra semanal</option>
        </select>
        <label htmlFor="descripcion" style={{ marginTop: "8px" }}> Descripción (opcional) </label>
        <textarea id="descripcion" placeholder="Finde de chicas en L'Escala" onChange={(e) => setDescriptionLista(e.target.value)} value={descriptionLista} />
        <button type="submit">Crear lista</button>
      </form>
    </div>
  );
};

export default FormLista;