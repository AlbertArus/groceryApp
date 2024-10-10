import { useEffect, useState } from "react"

const NewItem = ({ AddItem, categoryId, ItemNameInputRef }) => {

  const [name, setName] = useState ("")
  const [price, setPrice] = useState ("")
  useEffect(() => {
    ItemNameInputRef.current.focus()
  },[])

  const handleSubmit = (e) => {
    e.preventDefault();
    if(name.trim() && price.trim()) {
      AddItem(name, price, categoryId);
      setName("")
      setPrice("")
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

  return (
    <div className="newItem">
      <div className="fila-between" style={{marginLeft:"3px"}}>
        <span className="material-symbols-outlined addIcon">add</span>
        <form className="ItemText" onKeyDown={handleKeyDown}>
          <input type="text" placeholder="Nuevo Item" className="ItemName" ref={ItemNameInputRef} onChange={(e) => setName(e.target.value)} value={name}></input>
          <input type="number" placeholder="Precio" className="ItemPrice" onChange={(e) => setPrice(e.target.value)} value={price}></input>
        </form>
      </div>
    </div>
  )
}

export default NewItem