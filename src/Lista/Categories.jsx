import React, {useRef} from "react"
import Category from "../components/Category"
import NewCategory from "../components/NewCategory"

const Categories = ({ items, itemsCategory, handleCheck, categories, AddCategory, EditCategory, DeleteCategory, AddItem, EditItem, DeleteItem, handleThumbUp, handleThumbDown, thumbUp, thumbDown, counterUp, counterDown, votesRef }) => {
  const ItemNameInputRefs = useRef({})
  
  return (
    <div className="app-margin categories">
      <div className="categoriesMargin">
        {categories && categories.map(category => (
          <Category
            key={category.id}
            id={category.id}
            items={items.filter(item=> item.categoryId === category.id)}
            handleCheck={handleCheck}
            EditCategory={EditCategory}
            DeleteCategory={DeleteCategory}
            AddItem={AddItem}
            EditItem={EditItem}
            DeleteItem={DeleteItem}
            initialName={category.categoryName}
            ItemNameInputRef={ItemNameInputRefs.current[category.id] || (ItemNameInputRefs.current[category.id] = React.createRef())} // Objeto con la ref de cada categoría. Si esa (en base a id) no tiene ref, la creo con createRef y la asigno para que ahora [category.id] sí tenga valor (.current)
            itemsCategory={itemsCategory}
            categories={categories}
            handleThumbDown={handleThumbDown}
            handleThumbUp={handleThumbUp}
            thumbUp={thumbUp}
            thumbDown={thumbDown}  
            counterUp={counterUp}
            counterDown={counterDown}
            votesRef={votesRef}
          />
        ))}
      </div>
      <NewCategory
        AddCategory={AddCategory}
        ItemNameInputRef={ItemNameInputRefs}
      />
    </div>
  )
}

export default Categories