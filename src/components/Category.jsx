import { useEffect, useRef, useState } from "react"
// import toast, { Toaster } from 'react-hot-toast'
import Item from "./Item"
import NewItem from "./NewItem"

const Category = ({ initialName, ItemNameInputRef, categories, id, ToastRef, EditCategory, DeleteCategory, items, AddItem, EditItem, DeleteItem, handleCheck }) => {

  const [categoryName, setCategoryName] = useState(initialName);
  const [isCollapsed, setIsCollapsed] = useState(false)
  const toggleRef = useRef(null)
  const checkCategoryRef = useRef(null)

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

  const collapseCategory = () => {
    setIsCollapsed(prevCollapsed => !prevCollapsed)
  }

  const currentCategory = categories.find(category => category.id === id);
  const isChecked = currentCategory ? currentCategory.isChecked : false;
  
  useEffect(() => {
    if(toggleRef.current) {
      toggleRef.current.style.transform = isCollapsed ? "rotate(180deg)" : "rotate(0deg)";
    }
  }, [isCollapsed]);

  useEffect(() => {
    if(checkCategoryRef.current) {
      checkCategoryRef.current.style.display = isChecked ? "block" : "none";
    }
    if(isChecked) {
      console.log('Category is checked, collapsing');
      setIsCollapsed(true);
    }
  }, [isChecked]);

  // useEffect(() => {
  //   setIsChecked(checkCategory)
  //   console.log("items checked", isChecked)
  // },[categories])
  
  // useEffect(() => {
  //   if(checkCategoryRef.current) {
  //     checkCategoryRef.current.style.display = isChecked ? "block" : "none"
  //     collapseCategory()
  //     console.log("colapsado", isCollapsed)
  //   }
  // },[isChecked])

  // useEffect(() => {
  //   if(checkCategoryRef.current) {
  //     checkCategoryRef.current.style.display = isChecked ? "block" : "none"
  //     collapseCategory()
  // }}, [categories, checkCategory])

  return (
    <div className="categoryList">
      <div className="categoryListheader">
        <div className="headerLista-firstLine">
          <div className="titleCategory" onKeyDown={handleKeyDown}>
            <input type="text" placeholder="Tu categoría" className="ItemName" onChange={(e) => setCategoryName(e.target.value)} value={categoryName}></input>
            <span className="material-symbols-outlined icon-large" ref={toggleRef} onClick={collapseCategory}>keyboard_arrow_down</span>
          </div>
          <h3>{sumPrices} €</h3>
        </div>
        <div className="subHeaderLista-secondLine">
          <div className="subHeaderLista-secondLine firstPart">
            <h5>Items: {itemsLength}</h5>
            <span className="material-symbols-outlined icon-medium" ref={checkCategoryRef} style={{color:"green", marginLeft:"8px"}}>task_alt</span>
          </div>
          <div className="icons">
            <span className="material-symbols-outlined" onClick={handleAddingItem}>add</span>
            <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
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