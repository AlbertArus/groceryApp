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
  }, [getFocused, handleSubmit])

  const handleKeyDown = (e) => {
    if(e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="newCategory">
      <div className="itemLineCommon">
        <span class="material-symbols-outlined addIcon">add</span>
        <form className="ItemText" onKeyDown={handleKeyDown}>
          <input type="text" placeholder="Nueva categoría" className="ItemName" onChange={(e) => setCategoryName(e.target.value)} value={categoryName}></input>
        </form>
      </div>
    </div>
  )
}

export default NewCategory

