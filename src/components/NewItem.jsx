import { useState } from "react"

const NewItem = ({ AddItem, ItemNameInputRef }) => {

  const [name, setName] = useState ("")
  const [price, setPrice] = useState ("")

  const handleSubmit = (e) => {
    e.preventDefault();
    if(name.trim() && price.trim()) {
      AddItem(name, price);
      setName("")
      setPrice("")
    }
    if(ItemNameInputRef.current) {
      ItemNameInputRef.current.focus()
    }
  }

  // useEffect que uso para que el focus se haga solo después de cargar el DOM porque con props puede tardar
  // useEffect(() => {
  //   if(AddItem && ItemNameInputRef.current) {
  //     ItemNameInputRef.current.focus()
  //   }
  // },[AddItem, ItemNameInputRef])

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
          <input type="text" placeholder="Nuevo Item" className="ItemName" ref={ItemNameInputRef} onChange={(e) => setName(e.target.value)} value={name}></input>
          <input type="number" placeholder="Precio" className="ItemPrice" onChange={(e) => setPrice(e.target.value)} value={price}></input>
        </form>
      </div>
    </div>
  )
}

export default NewItem