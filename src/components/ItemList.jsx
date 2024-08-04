import CategoryList from "../components/CategoryList"
import Item from "./Item"
import NewItem from "./NewItem"

const ItemList = () => {
  return (
    <div className="itemList">
      <CategoryList 
        nameCategory={"Desayuno"}
        price={"23,71"}
        items={"7"}
      />
      <Item 
        ItemName={"Calabaza molida hecha con aparejada"}
        price={"23,65"}
      />
      <Item 
        ItemName={"Calabaza molida hecha con aparejada"}
        price={"23,65"}
      />
      <Item 
        ItemName={"Calabaza molida hecha con aparejada"}
        price={"23,65"}
      />
      <NewItem />
    </div>
  )
}

export default ItemList