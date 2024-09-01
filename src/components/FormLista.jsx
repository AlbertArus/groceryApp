import { useState } from "react";

const FormLista = ({ addLista }) => {
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
    }
  };

  return (
    <div className="FormLista">
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          placeholder="BuscarCosta"
          id="nombre"
          onChange={(e) => setListaName(e.target.value)}
          value={listaName}
          required
        />
        <label htmlFor="personas">Personas</label>
        <input
          type="number"
          id="personas"
          placeholder="4"
          onChange={(e) => setMembers(e.target.value)}
          value={members}
          required
        />
        <label htmlFor="plan">Plan</label>
        <select
          id="plan"
          onChange={(e) => setPlan(e.target.value)}
          value={plan}
          required
        >
          <option value="">Selecciona un plan</option>
          <option value="Viaje">Viaje</option>
          <option value="Casa compartida">Casa compartida</option>
          <option value="Compra semanal">Compra semanal</option>
        </select>
        <label htmlFor="descripcion" style={{ marginTop: "8px" }}>
          Descripción (opcional)
        </label>
        <textarea
          id="descripcion"
          placeholder="Compras de comida y listas de materiales para finde de despedida de soltera de Marta"
          onChange={(e) => setDescriptionLista(e.target.value)}
          value={descriptionLista}
        />
        <button type="submit">Crear lista</button>
      </form>
    </div>
  );
};

export default FormLista;