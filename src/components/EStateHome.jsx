import NewLista from "../Listas/NewLista"

const EStateHome = ({addLista}) => {
  return (
    <div>
      <img src="Fotos GroceryApp/_e409535c-8a88-419e-8a05-5437f5a91f35-removebg-preview.png" alt="Set of grocery bags full of items" style={{width:"100%", height:"100%"}}></img>
      <h5 style={{display: "flex", textAlign:"center", justifyContent: "center", margin:"0px 100px"}}>Compra en grupo creando tu primera lista ahora</h5>
      <div style={{display:"flex", justifyContent:"center", marginTop:"10px"}}>
          <NewLista
            addLista={addLista}
          />
          <button>
            Nueva lista
          </button>
      </div>
    </div>
  )
}

export default EStateHome