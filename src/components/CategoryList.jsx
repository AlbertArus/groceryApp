import { useRef } from "react"
import Item from "./Item"
import NewItem from "./NewItem"

const CategoryList = ({ nameCategory, price, items, AddItem, EditItem, DeleteItem, handleCheck }) => {

  const ItemNameInputRef = useRef(null)

  const handleAddingItem = () => {
    if (ItemNameInputRef.current) {
      ItemNameInputRef.current.focus()
    }
  }
  
  const ItemListLength = items.length

  const SumPrices = items.reduce((accumulator, item) => accumulator + Number(item.price), 0)
  console.log(items.length)

  return (
    <div className="categoryList">
      <div className="categoryListheader">
        <div className="headerLista-firstLine">
          <div className="titleCategory">
            <h3>{nameCategory}</h3>
            <span class="material-symbols-outlined icon-large">keyboard_arrow_down</span>
          </div>
          <h3>{SumPrices} €</h3>
        </div>
        <div className="subHeaderLista-secondLine">
          <h5>Items: {ItemListLength}</h5>
          <span class="material-symbols-outlined" onClick={handleAddingItem}>add</span>
        </div>
      </div>
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
        ItemNameInputRef={ItemNameInputRef}
      />
    </div>
  )
}

export default CategoryList