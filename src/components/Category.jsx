import { useEffect, useRef, useState } from "react"
import Item from "./Item"
import NewItem from "./NewItem"

const Category = ({ initialName, ItemNameInputRef, categories, id, EditCategory, DeleteCategory, items, AddItem, EditItem, DeleteItem, handleCheck, handleThumbUp, handleThumbDown, votesRef }) => {

  const [categoryName, setCategoryName] = useState(initialName);
  const [isCollapsed, setIsCollapsed] = useState(false)
  const toggleRef = useRef(null)
  const checkCategoryRef = useRef(null)

  const itemsLength = items.length
  const sumPrices = items.reduce((accumulator, item) => accumulator + Number(item.price), 0)
  const FormattedSumPrices = sumPrices.toLocaleString("es-ES", { style: "currency", currency: "EUR" })

  const handleAddingItem = (id) => {
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

  useEffect(() => {
    if(toggleRef.current) {
      toggleRef.current.style.transform = isCollapsed ? "rotate(270deg)" : "rotate(0deg)";
    }
  }, [isCollapsed]);

  const currentCategory = categories.find(category => category.id === id)
  const categoryChecked = currentCategory && currentCategory.isChecked===true

  useEffect(() => {
    if(categoryChecked) {
      setIsCollapsed(true)
    } else {
      setIsCollapsed(false)
    }
  },[categoryChecked])

  // useEffect(() => {
  //   const currentCategory = categories.find(category => category.id === id)
    
  //   if (currentCategory && currentCategory.isChecked===true) {
  //     if (checkCategoryRef.current) {
  //       checkCategoryRef.current.style.display = "block"
  //     }
  //     setIsCollapsed(true)
  //   } else {
  //     if (checkCategoryRef.current) {
  //       checkCategoryRef.current.style.display = "none"
  //     }
  //     setIsCollapsed(false)
  //   }
  // }, [categories, id])

  return (
    <div className="categoryList">
      <div className="categoryListheader">
        <div className="fila-between">
          <div className="fila-start titleCategory" onKeyDown={handleKeyDown}>
            <input type="text" placeholder="Tu categoría" className="ItemName" onChange={(e) => setCategoryName(e.target.value)} value={categoryName}></input>
            <span className="material-symbols-outlined icon-large" ref={toggleRef} onClick={collapseCategory} >keyboard_arrow_down</span>
          </div>
          <h4 style={{fontWeight:"500"}}>{FormattedSumPrices}</h4>
        </div>
        <div className="fila-between">
          <div className="fila-between firstPart">
            <h5>Items: {itemsLength}</h5>
            <span className="material-symbols-outlined icon-medium" ref={checkCategoryRef} style={{color:"green", marginLeft:"8px", display: categoryChecked ? "block" : "none"}}>task_alt</span>
          </div>
          <div className="icons">
            <span className="material-symbols-outlined icon-medium" onClick={() => handleAddingItem(id)}>add</span>
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