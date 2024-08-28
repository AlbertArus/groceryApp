import { useEffect, useRef, useState } from "react"
// import toast, { Toaster } from 'react-hot-toast'
import Item from "./Item"
import NewItem from "./NewItem"

const Category = ({ initialName, ItemNameInputRef, categories, id, EditCategory, DeleteCategory, items, AddItem, EditItem, DeleteItem, handleCheck, handleThumbUp, handleThumbDown, thumbUp, thumbDown, counterUp, counterDown, votesRef }) => {

  const [categoryName, setCategoryName] = useState(initialName);
  const [isCollapsed, setIsCollapsed] = useState(false)
  const toggleRef = useRef(null)
  const checkCategoryRef = useRef(null)

  const itemsLength = items.length
  const sumPrices = items.reduce((accumulator, item) => accumulator + Number(item.price), 0)
  const FormattedSumPrices = sumPrices.toLocaleString("es-ES", { style: "currency", currency: "EUR" })

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

  const collapseCategory = () => {
    setIsCollapsed(prevCollapsed => !prevCollapsed)
  }

  const currentCategory = categories.find(category => category.id === id);
  const isChecked = currentCategory ? currentCategory.isChecked : false;

  useEffect(() => {
    if(toggleRef.current) {
      toggleRef.current.style.transform = isCollapsed ? "rotate(270deg)" : "rotate(0deg)";
    }
  }, [isCollapsed]);

  useEffect(() => {
    if(checkCategoryRef.current) {
      checkCategoryRef.current.style.display = isChecked ? "block" : "none";
    }
    if(isChecked) {
      setIsCollapsed(true);
    }
  }, [isChecked]);
 


  return (
    <div className="categoryList">
      <div className="categoryListheader">
        <div className="fila-between">
          <div className="titleCategory" onKeyDown={handleKeyDown}>
            <input type="text" placeholder="Tu categoría" className="ItemName" onChange={(e) => setCategoryName(e.target.value)} value={categoryName}></input>
            <span className="material-symbols-outlined icon-large" ref={toggleRef} onClick={collapseCategory}>keyboard_arrow_down</span>
          </div>
          <h4 style={{fontWeight:"500"}}>{FormattedSumPrices}</h4>
        </div>
        <div className="fila-between">
          <div className="fila-between firstPart">
            <h5>Items: {itemsLength}</h5>
            <span className="material-symbols-outlined icon-medium" ref={checkCategoryRef} style={{color:"green", marginLeft:"8px"}}>task_alt</span>
          </div>
          <div className="icons">
            <span className="material-symbols-outlined icon-medium" onClick={handleAddingItem}>add</span>
            <span className="material-symbols-outlined icon-medium" onClick={handleDelete}>delete</span>
            </div>
        </div>
      </div>
      {!isCollapsed && (
        <>
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
              handleThumbDown={() => handleThumbDown(item.id)}
              handleThumbUp={() => handleThumbUp(item.id)}
              thumbUp={item.thumbUp}
              thumbDown={item.thumbDown}    
              counterUp={item.counterUp}
              counterDown={item.counterDown}
              votesRef={votesRef}
            />
          ))}
          <NewItem 
            AddItem={AddItem}
            categoryId={id}
            ItemNameInputRef={ItemNameInputRef}
          />
        </>
      )}
    </div>
  )
}

export default Category