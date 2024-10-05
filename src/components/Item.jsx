import { useState, useRef, useEffect } from "react"
import MembersItem from "./MembersItem"

const Item = ({ item, id, initialName, initialPrice, onClick, EditItem, DeleteItem, handleCounterUp, handleCounterDown, votesRef }) => {

  const [name, setName] = useState(initialName)
  const [price, setPrice] = useState(initialPrice)
  const [isExpanded, setIsExpanded] = useState(false)
  const [itemIsChecked, setItemIsChecked] = useState(false)
  const [isMembersShown, setIsMembersShown] = useState(false)
  const membersItemRef = useRef(null)
  const buttonMembersListRef = useRef(null)
  const deleteRef = useRef(null)
  const ItemTextRef = useRef(null)
  const ItemPriceRef = useRef(null)
  

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

  const priceFormatting = (event) => {
    let newPrice = event.target.value
    newPrice = newPrice.replace(",",".")
    const regex = /^\d*\.?\d{0,2}/;
    const match = newPrice.match(regex);

    if (match) {
      setPrice(match[0]);
    }
  }

  useEffect(() => {
    if(ItemPriceRef) {
      ItemPriceRef.current.price = price
    }
  },[price])

  useEffect(() => {
    if(item.isChecked) {
      setItemIsChecked(true)
    } else {
      setItemIsChecked(false)
    }
  },[item])

  const handleMembersShown = (event) => {
    event.stopPropagation()
    setIsMembersShown(prevState => !prevState)
}

useEffect(() => {
    const handleClickOutside = (event) => {
        if (membersItemRef.current && !membersItemRef.current.contains(event.target) && buttonMembersListRef.current && !buttonMembersListRef.current.contains(event.target)) {
            setIsMembersShown(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    }
}, [])

useEffect(() => {
    const handleClickOnMenu = (event) => {
        if(membersItemRef.current && membersItemRef.current.contains(event.target)) {
            setIsMembersShown(false)
        }
    }
    document.addEventListener("click", handleClickOnMenu)
    return () => {
        document.removeEventListener("click", handleClickOnMenu)
    }
},[])

console.log(item.itemUserMember)

  return (
    <div className="item">
      <div className="fila-start">
        <span className="material-symbols-outlined icon-large">drag_indicator</span>
        <div className="fila-between">
          <div className="ItemCheckbox" onClick={onClick} style={{backgroundColor: itemIsChecked ? "green" : "transparent"}}></div>
          <div className="fila-between">
            <form className="ItemText"  onClick={showDelete} ref={ItemTextRef}>
              <input type="text" placeholder="Modifica tu texto" onKeyDown={handleKeyDown} className={`ItemName ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand} style={{ textDecoration: itemIsChecked ? 'line-through' : 'none', color: itemIsChecked ? '#9E9E9E' : 'black' }} onChange={(e) => setName(e.target.value)} value={name}></input>
              <input type="number" placeholder="Modifica tu precio" ref={ItemPriceRef} onKeyDown={handleKeyDown} className="ItemPrice" style={{ textDecoration: itemIsChecked ? 'line-through' : 'none', color: itemIsChecked ? '#9E9E9E' : 'black' }} onChange={priceFormatting} value={price}></input>
            </form>
          </div>
          <span className="material-symbols-outlined icon-medium hidden" onClick={handleDelete} ref={deleteRef}>delete</span>
        </div>
      </div>
      <div className="itemFilaBajo fila-start" style={{position: "relative"}}>
        <div className="fila-start" style={{margin:"3px 0px 0px 62px"}} ref={el => votesRef.current[id] = el}>
          <div className="fila-start-group">
              <span className="material-symbols-outlined icon-small" onClick={handleCounterUp} style={{color: item.counterUp.length > 0 ? "blue" : ""}}>thumb_up</span>
              <h5 onClick={handleMembersShown}>{item.counterUp.length}</h5>
          </div>
          <div className="fila-start-group">
              <span className="material-symbols-outlined icon-small" onClick={handleCounterDown} style={{color: item.counterDown.length > 0 ? "red" : ""}}>thumb_down</span>
              <h5 onClick={handleMembersShown}>{item.counterDown.length}</h5>
          </div>
          {(item.counterUp.length > 0 || item.counterDown.length > 0) && isMembersShown &&
            <MembersItem
              ref={membersItemRef}
              item={item}
            />
          }        
        </div>
        <div className="fila-start" style={{marginTop:"3px"}}>
          <div className="fila-start-group">
            <span className="material-symbols-outlined icon-small">group</span>
            <h5>{item.itemUserMember.length}</h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item