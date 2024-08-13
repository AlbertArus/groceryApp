import { useState, useRef } from "react"
import Item from "./Item"
import NewItem from "./NewItem"

const Category = ({ initialName, categories, id, EditCategory, DeleteCategory, items, AddItem, EditItem, DeleteItem, handleCheck }) => {

  const [categoryName, setCategoryName] = useState(initialName);
  const ItemNameInputRef = useRef(null)

  const itemsLength = items.length
  const sumPrices = items.reduce((accumulator, item) => accumulator + Number(item.price), 0)

  const handleAddingItem = () => {
    if (ItemNameInputRef.current) {
      ItemNameInputRef.current.focus()
    }
  }
  
  const handleEdit = (e) => {
    if(categoryName.trim()) {
      EditCategory(id, categoryName);
    }
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter") {
      e.preventDefault();
      handleEdit(e);
    }
  }

  const handleDelete = () => {
    DeleteCategory(id);
  }

  return (
    <div className="categoryList">
      <div className="categoryListheader">
        <div className="headerLista-firstLine">
          <div className="titleCategory" onKeyDown={handleKeyDown}>
            <input type="text" placeholder="Tu categoría" className="ItemName" onChange={(e) => setCategoryName(e.target.value)} value={categoryName}></input>
            <span className="material-symbols-outlined icon-large">keyboard_arrow_down</span>
          </div>
          <h3>{sumPrices} €</h3>
        </div>
        <div className="subHeaderLista-secondLine">
          <h5>Items: {itemsLength}</h5>
          <div className="icons">
            <span className="material-symbols-outlined" onClick={handleAddingItem}>add</span>
            <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
            </div>
        </div>
      </div>
      {items && items.map(item => (
        <Item 
          key={item.id}
          id={item.id}
          categoryId={id}
          item={item}
          isChecked={item.isChecked}
          onClick={() => handleCheck(item.id)}
          EditItem={EditItem}
          DeleteItem={() => DeleteItem(item.id)}
          initialName={item.name}
          initialPrice={item.price}
        />
      ))}
      <NewItem 
        AddItem={AddItem}
        categoryId={id}
        ItemNameInputRef={ItemNameInputRef}
      />
    </div>
  )
}

export default Category