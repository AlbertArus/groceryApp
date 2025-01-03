import { useEffect, useRef, useState } from "react"
import Item from "./Item"
import NewItem from "./NewItem"

const Category = ({ UsuarioCompleto, initialName, ItemNameInputRef, categories, id, EditCategory, DeleteCategory, items, AddItem, EditItem, DeleteItem, handleCheck, handleCounterDown, handleCounterUp, lista, searchResult, setSearchResult, firstCategoryRef, handleDeleteItemUserMember, category }) => {

  const [categoryName, setCategoryName] = useState(initialName);
  const [isCollapsed, setIsCollapsed] = useState(false)
  const toggleRef = useRef(null)
  const checkCategoryRef = useRef(null)

  const itemsLength = items.length  
  const SumPriceFiltered = items.reduce((total, item) => {
    return (total + Number(item.price))
  },0)
  const FormattedSumPriceFiltered = SumPriceFiltered.toLocaleString("es-ES", { style: "currency", currency: "EUR" })

  useEffect(() => {
    if(categories.length === 1 && firstCategoryRef.current) {
      firstCategoryRef.current.focus()
    }
  },[categoryName, categories.length, ItemNameInputRef, firstCategoryRef])

  const handleCategoryKeyDown = (event) => {
    if (event.key === "Enter" && ItemNameInputRef.current) {
      ItemNameInputRef.current.focus()
    }
  }

  useEffect(() => {
    if(toggleRef.current) {
      toggleRef.current.style.transform = isCollapsed ? "rotate(270deg)" : "rotate(0deg)";
    }
  }, [isCollapsed]);

  const hasItems = category.items.length > 0
  const categoryChecked = hasItems && (category.isChecked === true || category.items.every(item => item.isChecked))

    useEffect(() => {
        setIsCollapsed(categoryChecked)
    },[category, categoryChecked])

  const handleAddingItem = (id) => {
    setIsCollapsed(false)
    setTimeout(() => {
        if (ItemNameInputRef.current) {
          ItemNameInputRef.current.focus(); // Temporizador para dar tiempo a que el DOM monte el componente New Item y entonces poder hacer focus
        }
      }, 0);
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

  return (
    <div className="categoryList">
      <div className="categoryListheader app-margin">
        <div className="fila-between">
          <div className="titleCategory" style={{width: "100%"}} onKeyDown={handleKeyDown} >
            <span className="material-symbols-outlined icon-large pointer" ref={toggleRef} onClick={collapseCategory} >keyboard_arrow_down</span>
            <input type="text" placeholder="Nombra tu categoría" aria-label="Nombre de la categoría" ref={firstCategoryRef} className="ItemName" style={{width: "100%"}} inputMode="text" enterKeyHint="done" onKeyDown={handleCategoryKeyDown} onChange={(e) => setCategoryName(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1))} value={categoryName}></input>
          </div>
          <h4 style={{fontWeight:"500", display: lista.showPrices ? "flex" : "none"}}>{FormattedSumPriceFiltered}</h4>
        </div>
        <div className="fila-between">
          <div className="fila-start firstPart">
            <h5>Items: {itemsLength}</h5>
            <span className="material-symbols-outlined icon-medium" ref={checkCategoryRef} style={{color:"green", marginLeft:"8px", display: categoryChecked ? "block" : "none"}}>task_alt</span>
          </div>
          <div className="icons">
            <span className="material-symbols-outlined icon-medium pointer" onClick={() => handleAddingItem(id)}>add</span>
            <span className="material-symbols-outlined icon-medium pointer" onClick={handleDelete}>delete</span>
            </div>
        </div>
      </div>
      {!isCollapsed && (
        <>
          {items && items.map(item => (
            <Item 
              key={item.id}
              item={item}
              onClick={() => handleCheck(item.id)}
              EditItem={EditItem}
              DeleteItem={() => DeleteItem(item.id)}
              initialName={item.name}
              initialPrice={item.price}
              handleCounterDown={() => handleCounterDown(item.id)}
              handleCounterUp={() => handleCounterUp(item.id)}  
              lista={lista}
              setSearchResult={setSearchResult}
              searchResult={searchResult}
              UsuarioCompleto={UsuarioCompleto}
              handleDeleteItemUserMember={handleDeleteItemUserMember}
            />
          ))}
          <NewItem 
            AddItem={AddItem}
            categoryId={id}
            ItemNameInputRef={ItemNameInputRef}
            lista={lista}
            />
        </>
      )}
    </div>
  )
}

export default Category