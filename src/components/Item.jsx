import { useState, useRef } from "react"

const Item = ({ id, initialName, initialPrice, isChecked, onClick, EditItem, DeleteItem }) => {

  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState(initialPrice);
  const deleteRef = useRef(null)
  const ItemTextRef = useRef(null)

  const handleEdit = (e) => {
    if(name.trim() && price.trim()) {
      EditItem(id, name, price);
    }
  }

  const handleDelete = () => {
    DeleteItem();
  }

  const showDelete = () => {
    if(deleteRef.current) {
      deleteRef.current.style.display = "block"
    } else {
      deleteRef.current.style.display = "none"
    }
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter") {
      e.preventDefault();
      handleEdit(e);
      if(ItemTextRef.current) {
        ItemTextRef.current.blur()
      }
    }
  }

  return (
    <div className="itemLine">
      <span className="material-symbols-outlined icon-large">drag_indicator</span>
      <div className="itemLineCommon">
      <div className="ItemCheckbox" onClick={onClick} style={{backgroundColor: isChecked ? "green" : "transparent"}}></div>
      <form className="ItemText"  onClick={showDelete} ref={ItemTextRef}>
        <input type="text" placeholder="Modifica tu texto" onKeyDown={handleKeyDown} className="ItemName" style={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? '#9E9E9E' : 'black' }} onChange={(e) => setName(e.target.value)} value={name}></input>
        <input type="number" placeholder="Modifica tu precio" onKeyDown={handleKeyDown} className="ItemPrice" style={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? '#9E9E9E' : 'black' }} onChange={(e) => setPrice(e.target.value)} value={price}></input>
      </form>
      <span className="material-symbols-outlined hidden" onClick={handleDelete} ref={deleteRef}>delete</span>
      </div>
    </div>
  )
}

export default Item