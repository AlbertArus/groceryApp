import { useEffect, useRef } from "react"

const Item = ({ ItemName, price, isChecked, onClick }) => {

  const checkboxRef = useRef(null)
  const ItemNameRef = useRef(null)
  const ItemPriceRef = useRef(null)



  useEffect(() => {
    const handleCheckItem = () => {
      if(!isChecked) {
          checkboxRef.current.style.backgroundColor = "green"
          ItemNameRef.current.style.textDecoration = "line-through"
          ItemNameRef.current.style.color = "#9E9E9E"
          ItemPriceRef.current.style.textDecoration = "line-through"
          ItemPriceRef.current.style.color = "#9E9E9E"
      } else if (isChecked) {
        checkboxRef.current.style.backgroundColor = "transparent"
        ItemNameRef.current.style.textDecoration = "none"
        ItemNameRef.current.style.color = "black"
        ItemPriceRef.current.style.textDecoration = "none"
        ItemPriceRef.current.style.color = "black"
      }
    }
    
    handleCheckItem();
  }, [isChecked]);

  return (
    <div className="itemLine">
        <span className="material-symbols-outlined icon-large">drag_indicator</span>
        {/* <input type="checkbox" className="radioButton" onClick={handleClick}></input> */}
        <div className="ItemCheckbox" onClick={onClick} ref={checkboxRef}></div>
        <h4 className="ItemName" ref={ItemNameRef}>{ItemName}</h4>
        <h4 ref={ItemPriceRef}>{price} €</h4>
        <span className="material-symbols-outlined hidden">delete</span>
    </div>
  )
}

export default Item