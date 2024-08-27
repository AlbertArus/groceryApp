import { useState, useRef } from "react"

const Item = ({ id, initialName, initialPrice, isChecked, onClick, EditItem, DeleteItem, handleThumbUp, handleThumbDown, thumbUp, thumbDown, counterUp, counterDown, votesRef }) => {

  const [name, setName] = useState(initialName)
  const [price, setPrice] = useState(initialPrice)
  const [isExpanded, setIsExpanded] = useState(false)
  // const [thumbUp, setThumbUp] = useState(false)
  // const [counterUp, setCounterUp] = useState(0)
  // const [thumbDown, setThumbDown] = useState(false)
  // const [counterDown, setCounterDown] = useState(0)
  const deleteRef = useRef(null)
  const ItemTextRef = useRef(null)
  // const votesRef = useRef(null)

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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // const handleThumbUp = () => {
  //   if(!thumbUp) {
  //     setCounterUp(prevState => prevState + 1)
  //   } else {
  //     setCounterUp(prevState => prevState - 1)
  //   }
  //   setThumbUp(!thumbUp)
  // }

  // const handleThumbDown = () => {
  //   if(!thumbDown) {
  //     setCounterDown(prevState => prevState + 1)
  //   } else {
  //     setCounterDown(prevState => prevState - 1)
  //   }
  //   setThumbDown(!thumbDown)
  // }
  
  return (
    <div className="item">
      <div className="fila-start">
        <span className="material-symbols-outlined icon-large">drag_indicator</span>
        <div className="fila-between" style={{marginLeft:"3px"}}>
          <div className="ItemCheckbox" onClick={onClick} style={{backgroundColor: isChecked ? "green" : "transparent"}}></div>
          <form className="ItemText"  onClick={showDelete} ref={ItemTextRef}>
            <input type="text" placeholder="Modifica tu texto" onKeyDown={handleKeyDown} className={`ItemName ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand} style={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? '#9E9E9E' : 'black' }} onChange={(e) => setName(e.target.value)} value={name}></input>
            <input type="number" placeholder="Modifica tu precio" onKeyDown={handleKeyDown} className="ItemPrice" style={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? '#9E9E9E' : 'black' }} onChange={(e) => setPrice(e.target.value)} value={price}></input>
          </form>
          <span className="material-symbols-outlined hidden" onClick={handleDelete} ref={deleteRef}>delete</span>
        </div>
      </div>
      <div className="fila-start" style={{margin:"3px 0px 0px 62px"}} ref={votesRef}>
        <div className="fila-start-group">
            <span className="material-symbols-outlined icon-small" onClick={handleThumbUp} style={{color: thumbUp ? "blue" : ""}}>thumb_up</span>
            <h5>{counterUp}</h5>
        </div>
        <div className="fila-start-group">
            <span className="material-symbols-outlined icon-small" onClick={handleThumbDown} style={{color: thumbDown ? "red" : ""}}>thumb_down</span>
            <h5>{counterDown}</h5>
        </div>
      </div>
    </div>
  )
}

export default Item