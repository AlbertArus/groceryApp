import { useEffect, useState } from "react";


const NewCategory = ({AddCategory, ItemNameInputRef}) => {

  const [categoryName, setCategoryName] = useState("")
  const [getFocused, setGetFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    if(categoryName.trim()) {
      AddCategory(categoryName);
      setCategoryName("")
      setGetFocused(true)
    }
  }

  useEffect(() => {
    if (getFocused && ItemNameInputRef.current) {
      ItemNameInputRef.current.focus()
      setGetFocused(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFocused, handleSubmit]) //Comentario es de ChatGPT para sacar aviso de que añada en dependencia el ItemNameInputRef y lo callo porque no debería añadirlo

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
          <input type="text" placeholder="Nueva categoría" className="ItemName" onChange={(e) => setCategoryName(e.target.value)} value={categoryName}></input>
        </form>
      </div>
    </div>
  )
}

export default NewCategory

