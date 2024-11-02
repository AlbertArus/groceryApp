import { useState, useRef, useEffect } from "react"
import MembersCounter from "./MembersCounter"
import MembersItem from "./MembersItem"
import Checkbox from "@mui/material/Checkbox"
import DragIndicator from "@mui/icons-material/DragIndicator";

const Item = ({ UsuarioCompleto, item, id, initialName, initialPrice, onClick, EditItem, DeleteItem, handleCounterUp, handleCounterDown, votesShown, preciosOcultos, handleDeleteItemUserMember }) => {

  const [name, setName] = useState(initialName)
  const [price, setPrice] = useState(initialPrice)
  const [isExpanded, setIsExpanded] = useState(false)
  const [itemIsChecked, setItemIsChecked] = useState(false)
  const [isCounterMembersShown, setIsCounterMembersShown] = useState(false)
  const [isItemUserMembersShown, setIsItemUserMembersShown] = useState(false)
  const membersCounterRef = useRef(null)
  const membersItemRef = useRef(null)
  const buttonCounterUpMembersListRef = useRef(null)
  const buttonCounterDownMembersListRef = useRef(null)
  const buttonItemMembersListRef = useRef(null)
  const deleteRef = useRef(null)
  const ItemTextRef = useRef(null)
  const ItemNameRef = useRef(null)
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

  const handleKeyDown = (e, input) => {
    if(e.key === "Enter") {
      e.preventDefault();
      handleEdit(e);
      if(input === "ItemName" && ItemNameRef.current) {
        ItemNameRef.current.blur()
      }
      if(input === "ItemPrice" && ItemPriceRef.current) {
        ItemPriceRef.current.blur()
      }
    }
  }

  const toggleExpand = () => {
    setIsExpanded(prevState => !prevState)
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
    if(!preciosOcultos && ItemPriceRef.current) {
      ItemPriceRef.current.price = price
    }
  },[preciosOcultos, price])

  useEffect(() => {
    if(item.isChecked) {
      setItemIsChecked(true)
    } else {
      setItemIsChecked(false)
    }
  },[item])

  const handleCounterMembersShown = (event) => {
    event.stopPropagation()
    setIsCounterMembersShown(prevState => !prevState)
  }

  useEffect(() => {
      const handleClickOutside = (event) => {
          if (membersCounterRef.current && !membersCounterRef.current.contains(event.target) && buttonCounterUpMembersListRef.current && !buttonCounterUpMembersListRef.current.contains(event.target) && buttonCounterDownMembersListRef.current && !buttonCounterDownMembersListRef.current.contains(event.target)) {
            setIsCounterMembersShown(false);
          }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      }
  }, [])

  useEffect(() => {
      const handleClickOnMenu = (event) => {
          if(membersCounterRef.current && membersCounterRef.current.contains(event.target)) {
            setIsCounterMembersShown(false)
          }
      }
      document.addEventListener("click", handleClickOnMenu)
      return () => {
          document.removeEventListener("click", handleClickOnMenu)
      }
  },[])

  const handleItemUserMembersShown = (event) => {
    event.stopPropagation()
    setIsItemUserMembersShown(prevState => !prevState)
  }

  useEffect(() => {
      const handleClickOutside = (event) => {
          if (membersItemRef.current && !membersItemRef.current.contains(event.target) && buttonItemMembersListRef.current && !buttonItemMembersListRef.current.contains(event.target)) {
            setIsItemUserMembersShown(false);
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
            setIsItemUserMembersShown(false)
          }
      }
      document.addEventListener("click", handleClickOnMenu)
      return () => {
          document.removeEventListener("click", handleClickOnMenu)
      }
  },[])

  return (
    <div className="item">
      {!preciosOcultos ? (
        <>
          <div className="fila-start">
            <DragIndicator 
              style={{padding: "0px"}}
            />
            <div className="fila-between">
              <Checkbox 
                checked={itemIsChecked}
                onChange={onClick}
                sx={{
                  '&.Mui-checked': {
                    color: "green"
                  },
                  '&:not(.Mui-checked)': {
                    color: "#9E9E9E"
                  },
                  '&.Mui-checked + .MuiTouchRipple-root': {
                    backgroundColor: itemIsChecked ? 'green' : 'transparent'
                  },
                  padding: "0px"
                }}
              />
              <div className="ItemText" onClick={showDelete} ref={ItemTextRef}>
                <input type="text" aria-label="Nombre del item" ref={ItemNameRef} onKeyDown={(e) => handleKeyDown(e, "ItemName")} inputMode="text" enterKeyHint="done" className={`ItemName ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand} style={{ textDecoration: itemIsChecked ? 'line-through' : 'none', color: itemIsChecked ? '#9E9E9E' : 'black' }} onChange={(e) => setName(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1))} value={name}></input>
                <input type="number" placeholder="Precio" aria-label="Precio del item" ref={ItemPriceRef} onKeyDown={(e) => handleKeyDown(e, "ItemPrice")} inputMode="decimal" enterKeyHint="done" className="ItemPrice" style={{ textDecoration: itemIsChecked ? 'line-through' : 'none', color: itemIsChecked ? '#9E9E9E' : 'black'}} onChange={priceFormatting} value={price}></input>
              </div>
              <span className="material-symbols-outlined icon-medium hidden pointer" onClick={handleDelete} ref={deleteRef}>delete</span>
            </div>
          </div>
          <div className="itemFilaBajo fila-start" style={{position: "relative", margin:"3px 0px 0px 63px"}}>
            <div className="fila-start pointer">
              <div className="fila-start-group" style={{display: votesShown ? "flex" : "none"}}>
                  <span className="material-symbols-outlined icon-small" onClick={handleCounterUp} style={{color: item.counterUp.length > 0 ? "blue" : ""}}>thumb_up</span>
                  <h5 onClick={handleCounterMembersShown} ref={buttonCounterUpMembersListRef}>{item.counterUp.length}</h5>
              </div>
              <div className="fila-start-group" style={{display: votesShown ? "flex" : "none"}}>
                  <span className="material-symbols-outlined icon-small" onClick={handleCounterDown} style={{color: item.counterDown.length > 0 ? "red" : ""}}>thumb_down</span>
                  <h5 onClick={handleCounterMembersShown} ref={buttonCounterDownMembersListRef}>{item.counterDown.length}</h5>
              </div>
              {(item.counterUp.length > 0 || item.counterDown.length > 0) && isCounterMembersShown &&
                <MembersCounter
                  style={{left: "0"}}
                  ref={membersCounterRef}
                  item={item}
                />
              }        
            </div>
            <div className="fila-start-group pointer" onClick={handleItemUserMembersShown} ref={buttonItemMembersListRef}>
              <span className="material-symbols-outlined icon-small" onClick={handleItemUserMembersShown} ref={buttonItemMembersListRef}>group</span>
              <h5>{item.itemUserMember.length}</h5>
              {isItemUserMembersShown &&
                <MembersItem
                  style={{left: "0"}}
                  ref={membersItemRef}
                  item={item}
                  UsuarioCompleto={UsuarioCompleto}
                  handleDeleteItemUserMember={handleDeleteItemUserMember}
                />
              }
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="fila-start">
            <DragIndicator 
                style={{padding: "0px"}}
              />
            <div className="fila-between">
              <Checkbox 
                checked={itemIsChecked}
                onChange={onClick}
                sx={{
                  '&.Mui-checked': {
                    color: "green",
                  },
                  '&:not(.Mui-checked)': {
                    color: "#9E9E9E",
                  },
                  '&.Mui-checked + .MuiTouchRipple-root': {
                    backgroundColor: itemIsChecked ? 'green' : 'transparent',
                  },
                  padding: "0px"
                }}
              />
              <div className="ItemText" onClick={showDelete} ref={ItemTextRef}>
                <input type="text" aria-label="Nombre del item" ref={ItemNameRef} onKeyDown={(e) => handleKeyDown(e, "ItemName")} inputMode="text" enterKeyHint="done" className={`ItemName ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand} style={{ textDecoration: itemIsChecked ? 'line-through' : 'none', color: itemIsChecked ? '#9E9E9E' : 'black' }} onChange={(e) => setName(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1))} value={name}></input>
              </div>
              <div className="fila-start pointer" style={{position: "relative"}}>
                <div className="fila-start-group" style={{display: votesShown ? "flex" : "none"}}>
                    <span className="material-symbols-outlined icon-small" onClick={handleCounterUp} style={{color: item.counterUp.length > 0 ? "blue" : ""}}>thumb_up</span>
                    <h5 onClick={handleCounterMembersShown} ref={buttonCounterUpMembersListRef}>{item.counterUp.length}</h5>
                </div>
                <div className="fila-start-group" style={{display: votesShown ? "flex" : "none"}}>
                    <span className="material-symbols-outlined icon-small" onClick={handleCounterDown} style={{color: item.counterDown.length > 0 ? "red" : ""}}>thumb_down</span>
                    <h5 onClick={handleCounterMembersShown} ref={buttonCounterDownMembersListRef}>{item.counterDown.length}</h5>
                </div>
                {(item.counterUp.length > 0 || item.counterDown.length > 0) && isCounterMembersShown &&
                  <MembersCounter
                    style={{left: "0"}}
                    ref={membersCounterRef}
                    item={item}
                  />
                }        
              </div>
              <span className="material-symbols-outlined icon-medium hidden pointer" onClick={handleDelete} ref={deleteRef}>delete</span>
            </div>
          </div>
          <div className="itemFilaBajo fila-start" style={{position: "relative", margin:"3px 0px 0px 63px"}}>
            <div className="fila-start-group pointer" onClick={handleItemUserMembersShown} ref={buttonItemMembersListRef}>
              <span className="material-symbols-outlined icon-small" onClick={handleItemUserMembersShown} ref={buttonItemMembersListRef}>group</span>
              <h5>{item.itemUserMember.length}</h5>
              {isItemUserMembersShown &&
                <MembersItem
                  style={{left: "0"}}
                  ref={membersItemRef}
                  item={item}
                  UsuarioCompleto={UsuarioCompleto}
                  handleDeleteItemUserMember={handleDeleteItemUserMember}
                />
              }
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Item