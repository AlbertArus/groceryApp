import { useState } from "react"

const NewItem = ({AddItem }) => {

  const [name, setName] = useState ("")
  const [price, setPrice] = useState ("")

  const handleSubmit = (e) => {
    e.preventDefault();
    if(name.trim() && price.trim()) {
      AddItem(name, price);
      setName("")
      setPrice("")
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
      <span class="material-symbols-outlined">add</span>
      <form className="newItemText" onKeyDown={handleKeyDown}>
        <input type="text" placeholder="Nuevo Item" className="newItemDescription" onChange={(e) => setName(e.target.value)} value={name}></input>
        <input type="number" placeholder="Price" className="newItemPrice" onChange={(e) => setPrice(e.target.value)} value={price}></input>
      </form>
    </div>
  )
}

export default NewItem