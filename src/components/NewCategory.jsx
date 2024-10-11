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
    <div className="newCategory">
      <div className="fila-between" style={{marginLeft:"3px"}}>
        <span className="material-symbols-outlined addIcon">add</span>
        <form className="ItemText" onKeyDown={handleKeyDown}>
          < input type="text" placeholder="Nueva categoría" className="ItemName" onChange={(e) => setCategoryName(e.target.value)} value={categoryName} />
        </form>
      </div>
    </div>
  )
}

export default NewCategory

