import { useRef, useState } from "react"
import { useUsuario } from '../UsuarioContext';

const NewItem = ({ AddItem, categoryId, ItemNameInputRef, lista }) => {

  const { usuario } = useUsuario();
  const [name, setName] = useState ("")
  const [price, setPrice] = useState ("")
  const ItemPriceRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault();
    if(lista.userConfig?.[usuario.uid]?.showPrices) {
      if(name.trim() && price.trim()) {
        AddItem(name, Number(price || 0), categoryId);
        setName("")
        setPrice("")
      }
    } else {
      if(name.trim() && price.trim() === "") {
        AddItem(name, Number(price || 0), categoryId);
        setName("")
        setPrice("")
      }
    }
    if(categoryId) {
      if(ItemNameInputRef.current) {
      ItemNameInputRef.current.focus()
      }
    }
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);  
    }
  }

  const handleItemTextKeyDown = (event) => {
    if (event.key === "Enter" && ItemPriceRef.current) {
      ItemPriceRef.current.focus()
    }
  }

  return (
    <div className="newItem item app-margin">
      <div className="fila-between" style={{marginLeft:"24px"}}>
        <span className="material-symbols-outlined addIcon">add</span>
        <form className="ItemText">
          <input type="text" placeholder="Nuevo Item" aria-label="Nombre de nuevo item" className="ItemName" onKeyDown={lista.userConfig?.[usuario.uid]?.showPrices ? handleItemTextKeyDown : handleKeyDown} ref={ItemNameInputRef} onChange={(e) => setName(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1))} value={name}></input>
          <input type="number" placeholder="Precio" aria-label="Precio de nuevo item" className="ItemPrice" onKeyDown={handleKeyDown} ref={ItemPriceRef} style={{display: lista.userConfig?.[usuario.uid]?.showPrices ? "flex" : "none"}} onChange={(e) => setPrice(e.target.value)} value={price}></input>
        </form>
      </div>
    </div>
  )
}

export default NewItem