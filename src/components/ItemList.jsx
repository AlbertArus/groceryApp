import Category from "../components/Category"
import Item from "./Item"
import NewItem from "./NewItem"

const ItemList = ({items, AddItem, EditItem, DeleteItem, handleCheck, ItemListLength}) => {

  return (
    <div className="itemList">
        <Category 
          nameCategory={"Desayuno"}
          price={"23"}
          items={items}
        />
      {items && items.map(item => (
        <Item 
          key={item.id}
          id={item.id}
          item={item}
          isChecked={item.isChecked}
          onClick={() => handleCheck(item.id)}
          EditItem={EditItem}
          // EditItem={(name, price) => EditItem(id, name, price)}
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