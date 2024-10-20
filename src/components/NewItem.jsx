import { useRef, useState } from "react"

const NewItem = ({ AddItem, categoryId, ItemNameInputRef, preciosOcultos }) => {

  const [name, setName] = useState ("")
  const [price, setPrice] = useState ("")
  const ItemPriceRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!preciosOcultos) {
      if(name.trim() && price.trim()) {
        AddItem(name, price, categoryId);
        setName("")
        setPrice("")
      }
    } else {
      if(name.trim() && price.trim() === "") {
        AddItem(name, price, categoryId);
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
    <div className="newItem">
      <div className="fila-between" style={{marginLeft:"3px"}}>
        <span className="material-symbols-outlined addIcon">add</span>
        <form className="ItemText" style={{marginLeft: "14px"}}>
          <input type="text" placeholder="Nuevo Item" aria-label="Nombre de nuevo item" className="ItemName" onKeyDown={handleItemTextKeyDown} ref={ItemNameInputRef} onChange={(e) => setName(e.target.value)} value={name}></input>
          <input type="number" placeholder="Precio" aria-label="Precio de nuevo item" className="ItemPrice" onKeyDown={handleKeyDown} ref={ItemPriceRef} style={{display: preciosOcultos ? "none" : "flex"}} onChange={(e) => setPrice(e.target.value)} value={price}></input>
        </form>
      </div>
    </div>
  )
}

export default NewItem