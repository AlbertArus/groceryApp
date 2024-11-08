import { useState, useRef, useEffect } from "react"
import Checkbox from "@mui/material/Checkbox"
import DragIndicator from "@mui/icons-material/DragIndicator";
import Slider from "../ui-components/Slider"
import MenuTabs from "./MenuTabs";
import ModalSheet from "../ui-components/ModalSheet";

const Item = ({ UsuarioCompleto, item, id, initialName, initialPrice, onClick, EditItem, DeleteItem, handleCounterUp, handleCounterDown, lista, handleDeleteItemUserMember }) => {

  const [name, setName] = useState(initialName)
  const [price, setPrice] = useState(initialPrice)
  const [isExpanded, setIsExpanded] = useState(false)
  const [itemIsChecked, setItemIsChecked] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [open, setOpen] = useState(false)
  const [isActive, setIsActive] = useState("")
  const ItemTextRef = useRef(null)
  const ItemNameRef = useRef(null)
  const ItemPriceRef = useRef(null)

  const handleEdit = (e) => {
    if(name.trim() && price.trim()) {
      EditItem(id, name, price);
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
    if(lista.showPrices && ItemPriceRef.current) {
      ItemPriceRef.current.price = price
    }
  },[lista.showPrices, price])

  useEffect(() => {
    if(item.isChecked) {
      setItemIsChecked(true)
    } else {
      setItemIsChecked(false)
    }
  },[item])

  const handleInputFocus = () => setIsInputFocused(true);
  const handleInputBlur = () => setIsInputFocused(false);
  
  return (
    <Slider onDelete={DeleteItem} onCheck={onClick} disabled={isInputFocused}>
    <div className="item app-margin">
      {lista.showPrices ? (
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
                  padding: "0px",
                  cursor:"pointer"
                }}
              />
              <div className="ItemText" ref={ItemTextRef}>
                <input type="text" aria-label="Nombre del item" ref={ItemNameRef} onKeyDown={(e) => handleKeyDown(e, "ItemName")} onBlur={handleInputBlur} onFocus={handleInputFocus} inputMode="text" enterKeyHint="done" className={`ItemName ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand} style={{ textDecoration: itemIsChecked ? 'line-through' : 'none', color: itemIsChecked ? '#9E9E9E' : 'black' }} onChange={(e) => setName(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1))} value={name}></input>
                <input type="number" placeholder="Precio" aria-label="Precio del item" ref={ItemPriceRef} onKeyDown={(e) => handleKeyDown(e, "ItemPrice")} onBlur={handleInputBlur} onFocus={handleInputFocus} inputMode="decimal" enterKeyHint="done" className="ItemPrice" style={{ textDecoration: itemIsChecked ? 'line-through' : 'none', color: itemIsChecked ? '#9E9E9E' : 'black'}} onChange={priceFormatting} value={price}></input>
              </div>
            </div>
          </div>
          <div className="itemFilaBajo fila-start" style={{position: "relative", margin:"3px 0px 0px 63px"}}>
            <div className="fila-start pointer">
              <div className="fila-start-group" style={{display: lista.showVotes ? "flex" : "none"}}>
                  <span className="material-symbols-outlined icon-small" onClick={handleCounterUp} style={{color: item.counterUp.length > 0 ? "blue" : ""}}>thumb_up</span>
                  <h5 onClick={() => {setOpen(true); setIsActive("A favor")}}>{item.counterUp.length}</h5>
              </div>
              <div className="fila-start-group" style={{display: lista.showVotes ? "flex" : "none"}}>
                  <span className="material-symbols-outlined icon-small" onClick={handleCounterDown} style={{color: item.counterDown.length > 0 ? "red" : ""}}>thumb_down</span>
                  <h5 onClick={() => {setOpen(true); setIsActive("En contra")}}>{item.counterDown.length}</h5>
              </div>
              {(item.counterUp.length > 0 || item.counterDown.length > 0) && (
                  <ModalSheet
                    open={open}
                    setOpen={setOpen}
                  >
                    <MenuTabs
                      style={{left: "0"}}
                      UsuarioCompleto={UsuarioCompleto}
                      item={item}
                      isActive={isActive}
                      setIsActive={setIsActive}
                    />
                  </ModalSheet>
                )}       
            </div>
            <div className="fila-start-group pointer" onClick={() => {setOpen(true); setIsActive("Miembros")}}>
              <span className="material-symbols-outlined icon-small">group</span>
              <h5>{item.itemUserMember.length}</h5>
            </div>
            <ModalSheet
              open={open}
              setOpen={setOpen}
              >
              <MenuTabs
                style={{left: "0"}}
                item={item}
                UsuarioCompleto={UsuarioCompleto}
                handleDeleteItemUserMember={handleDeleteItemUserMember}
                isActive={isActive}
                setIsActive={setIsActive}
              />
            </ModalSheet>
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
              <div className="ItemText" ref={ItemTextRef}>
                <input type="text" aria-label="Nombre del item" ref={ItemNameRef} onKeyDown={(e) => handleKeyDown(e, "ItemName")} onBlur={handleInputBlur} onFocus={handleInputFocus} inputMode="text" enterKeyHint="done" className={`ItemName ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand} style={{ textDecoration: itemIsChecked ? 'line-through' : 'none', color: itemIsChecked ? '#9E9E9E' : 'black' }} onChange={(e) => setName(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1))} value={name}></input>
              </div>
              <div className="fila-start pointer" style={{position: "relative"}}>
                <div className="fila-start-group" style={{display: lista.showVotes ? "flex" : "none"}}>
                    <span className="material-symbols-outlined icon-small" onClick={handleCounterUp} style={{color: item.counterUp.length > 0 ? "blue" : ""}}>thumb_up</span>
                    <h5 onClick={() => {setOpen(true); setIsActive("A favor")}}>{item.counterUp.length}</h5>
                </div>
                <div className="fila-start-group" style={{display: lista.showVotes ? "flex" : "none"}}>
                    <span className="material-symbols-outlined icon-small" onClick={handleCounterDown} style={{color: item.counterDown.length > 0 ? "red" : ""}}>thumb_down</span>
                    <h5 onClick={() => {setOpen(true); setIsActive("En contra")}}>{item.counterDown.length}</h5>
                </div>
                {(item.counterUp.length > 0 || item.counterDown.length > 0) &&
                  <ModalSheet
                    open={open}
                    setOpen={setOpen}
                  >
                    <MenuTabs
                      style={{left: "0"}}
                      UsuarioCompleto={UsuarioCompleto}
                      item={item}
                      isActive={isActive}
                      setIsActive={setIsActive}
                    />
                  </ModalSheet>
                }        
              </div>
            </div>
          </div>
          <div className="itemFilaBajo fila-start" style={{position: "relative", margin:"3px 0px 0px 63px"}}>
            <div className="fila-start-group pointer" onClick={() => {setOpen(true); setIsActive("Miembros")}}>
              <span className="material-symbols-outlined icon-small">group</span>
              <h5>{item.itemUserMember.length}</h5>
            </div>
            <ModalSheet
              open={open}
              setOpen={setOpen}
              >
              <MenuTabs
                style={{left: "0"}}
                item={item}
                UsuarioCompleto={UsuarioCompleto}
                handleDeleteItemUserMember={handleDeleteItemUserMember}
                isActive={isActive}
                setIsActive={setIsActive}
              />
            </ModalSheet>
          </div>
        </>
      )}
    </div>
    </Slider>
  )
}

export default Item