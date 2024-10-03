import { useState } from "react"
import FormLista from "./FormLista"

const EStateHome = ({addLista}) => {

  const [isFormVisible, setIsFormVisible] = useState(false)

  const showForm = () => {
      setIsFormVisible(true)
  }

  return (
    <div>
      <img src="Fotos GroceryApp/_e409535c-8a88-419e-8a05-5437f5a91f35-removebg-preview.png" alt="Set of grocery bags full of items" style={{width:"100%", height:"100%"}}></img>
      <h5 style={{display: "flex", textAlign:"center", justifyContent: "center", width: "auto"}}>Compra en grupo creando <br/> tu primera lista ahora</h5>
      <div style={{display:"flex", justifyContent:"center", marginTop:"10px"}}>
        <h5 className="NewListaEState" onClick={showForm}>Nueva lista</h5>
        {isFormVisible && (
          <FormLista
            addLista={addLista}
            setIsFormVisible={setIsFormVisible}
          />
        )}
      </div>
    </div>
  )
}

export default EStateHome