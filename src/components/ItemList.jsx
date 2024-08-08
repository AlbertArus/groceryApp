import CategoryList from "../components/CategoryList"
import Item from "./Item"
import NewItem from "./NewItem"

const ItemList = ({items, AddItem, handleCheck, ItemListLength}) => {

  return (
    <div className="itemList">
        <CategoryList 
          nameCategory={"Desayuno"}
          price={"23"}
          items={ItemListLength}
        />
      {items && items.map(item => (
        <Item 
          key={item.id}
          ItemName={item.name}
          price={item.price}
          isChecked={item.isChecked}
          onClick={() => handleCheck(item.id)}
        />
      ))}
      <NewItem 
        AddItem={AddItem}
      />
    </div>
  )
}

export default ItemList