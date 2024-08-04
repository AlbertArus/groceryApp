import { useState } from "react"
import CategoryList from "../components/CategoryList"
import Item from "./Item"
import NewItem from "./NewItem"

const ItemList = () => {

  const [items, setItems] = useState([
    {id: 1, name: "Calabaza molida hecha con aparejada", price: "22,21", isChecked: false},
    {id: 2, name: "Calabaza molida hecha con aparejada", price: "12,89", isChecked: false},
    {id: 3, name: "Calabaza molida hecha con aparejada", price: "3,75", isChecked: false},
    {id: 4, name: "Calabaza molida hecha con aparejada", price: "3,75", isChecked: false},
    {id: 5, name: "Calabaza molida hecha con aparejada", price: "3,75", isChecked: false}
  ])

  const handleCheck = (id) => {
    setItems(items.map(item =>
      item.id === id ? {...item, isChecked: !item.isChecked} : item
    ));
    console.log("click")
  };

  const ItemListLength = items.length


  return (
    <div className="itemList">
      <CategoryList 
        nameCategory={"Desayuno"}
        price={"23,71"}
        items={ItemListLength}
      />
      {items.map(item => (
        <Item 
          key={item.id}
          ItemName={item.name}
          price={item.price}
          isChecked={item.isChecked}
          onClick={() => handleCheck(item.id)}
        />
      ))}
      <NewItem />
    </div>
  )
}

export default ItemList