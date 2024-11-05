import { useState } from "react";

const NewCategory = ({AddCategory}) => {

  const [categoryName, setCategoryName] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    if(categoryName.trim()) {
      AddCategory(categoryName);
      setCategoryName("")
    }
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="newCategory app-margin">
      <div className="fila-between" style={{marginLeft:"3px"}}>
        <span className="material-symbols-outlined addIcon">add</span>
        <form className="ItemText" onKeyDown={handleKeyDown}>
          < input type="text" placeholder="Nueva categoría" aria-label="Nombre de nueva categoría" className="ItemName" onChange={(e) => setCategoryName(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1))} value={categoryName} />
        </form>
      </div>
    </div>
  )
}

export default NewCategory

