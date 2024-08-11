import { useState, useRef } from "react"

const NewItem = ({AddItem }) => {

  const [name, setName] = useState ("")
  const [price, setPrice] = useState ("")
  const ItemNameInputFocusRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault();
    if(name.trim() && price.trim()) {
      AddItem(name, price);
      setName("")
      setPrice("")
    }
    if(ItemNameInputFocusRef.current) {
      ItemNameInputFocusRef.current.focus()
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
      <div className="itemLineCommon">
        <span class="material-symbols-outlined addIcon">add</span>
        <form className="ItemText" onKeyDown={handleKeyDown}>
          <input type="text" placeholder="Nuevo Item" className="ItemName" ref={ItemNameInputFocusRef} onChange={(e) => setName(e.target.value)} value={name}></input>
          <input type="number" placeholder="Precio" className="ItemPrice" onChange={(e) => setPrice(e.target.value)} value={price}></input>
        </form>
      </div>
    </div>
  )
}

export default NewItem