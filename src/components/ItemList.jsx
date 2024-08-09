import CategoryList from "../components/CategoryList"
import Item from "./Item"
import NewItem from "./NewItem"

const ItemList = ({items, AddItem, EditItem, DeleteItem, handleCheck, ItemListLength}) => {

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
          isChecked={item.isChecked}
          onClick={() => handleCheck(item.id)}
          EditItem={(name, price) => EditItem(item.id, name, price)}
          DeleteItem={() => DeleteItem(item.id)}
          initialName={item.name}
          initialPrice={item.price}
        />
      ))}
      <NewItem 
        AddItem={AddItem}
      />
    </div>
  )
}

export default ItemList