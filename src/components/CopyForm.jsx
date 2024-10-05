import { useState } from "react";

const FormLista = ({ addLista, setIsFormVisible }) => {
  const [listaName, setListaName] = useState("");
  const [plan, setPlan] = useState("");
  const [descriptionLista, setDescriptionLista] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listaName.trim() && plan.trim()) {
      addLista(listaName, plan, descriptionLista);
      setIsFormVisible(false)
    }
  };

  return (
      <div className="FormLista">
        <div className="fila-between" style={{ margin: "15px" }}>
          <h5 style={{ fontWeight: "600" }}>Configura tu nueva lista</h5>
          <span className="material-symbols-outlined icon-medium" onClick={() => setIsFormVisible(false)}>close</span>
        </div>
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
          <label htmlFor="descripcion" style={{ marginTop: "8px" }}> Descripción (opcional) </label>
          <textarea id="descripcion" placeholder="Finde de chicas en L'Escala" onChange={(e) => setDescriptionLista(e.target.value)} value={descriptionLista} />
          <button type="submit">Crear lista</button>
        </form>
        {/* <span class="material-symbols-outlined">travel</span>
        <span class="material-symbols-outlined">home</span>
        <span class="material-symbols-outlined">repeat</span> */}
      </div>
  );
};

export default FormLista;

// .FormLista {
//   border-radius: 10px;
//   box-shadow: 0px 0px 300px rgba(0,0,0,0.3);
//   /* width: 340px;
//   height: auto; */
//   background-color: white;
//   padding: 10px 5px;
//   z-index: 1000;
//   position: absolute;
//   top: 200px;
// }

// .FormLista label {
//   font-size: 12px;
//   margin: 0px;
//   font-weight: 400;
// }

// .FormLista input, 
// .FormLista input:hover,
// .FormLista select, 
// .FormLista select:hover {
//   border: none;
//   border-bottom: 2px solid #9E9E9E;
//   outline: none;
//   font-family: inherit;
//   font-size: 16px;
//   color: black;
//   background: transparent;
//   flex: 1;
//   padding: 0;
//   text-transform: capitalize;
//   margin: 5px 0px;
// }

// .FormLista textarea, 
// .FormLista textarea:hover {
//   border: none;
//   border-bottom: 2px solid #9E9E9E;
//   outline: none;
//   resize: none;
//   font-family: inherit;
//   font-size: 16px;
//   color: black;
//   background: transparent;
//   flex: 1;
//   padding: 0;
//   margin: 5px 0px;
//   width: 240px;
// }

// .FormLista input::placeholder {
//   color: lightgray;
//   opacity: 1;
// }

// button[type=submit] {
//   width: 250px;
//   height: 30px;
//   border-radius: 5px;
//   background-color: #f4f4f4;
//   border: 2.5px solid #9E9E9E;
//   margin-top: 15px;
// }

// .FormLista form {
//   display: flex;
//   flex-direction: column;
//   flex: 1;
//   align-items: flex-start;
//   justify-content: flex-start;
//   margin: 15px;
// }
