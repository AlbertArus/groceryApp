import { useNavigate } from "react-router-dom"

const EStateHome = ({addLista}) => {

  const navigate = useNavigate()

  return (
    <div className="emptyState app-margin">
      <img src="Fotos GroceryApp/_e409535c-8a88-419e-8a05-5437f5a91f35-removebg-preview.png" alt="Set of grocery bags full of items" style={{width:"100%", height:"100%"}}></img>
      <h5 style={{width: "auto"}}>Compra en grupo creando <br/> tu primera lista ahora</h5>
        <h5 className="button_emptyState" onClick={() => navigate("/newlist/")}>Nueva lista</h5>
    </div>
  )
}

export default EStateHome