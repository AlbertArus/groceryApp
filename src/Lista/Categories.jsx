import {useRef} from "react"
import Category from "../components/Category"
import NewCategory from "../components/NewCategory"

const Categories = ({ items, itemsCategory, handleCheck, categories, AddCategory, EditCategory, DeleteCategory, AddItem, EditItem, DeleteItem}) => {
  const ItemNameInputRef = useRef(null)
  // const categoriesLength = categories.length
  
  return (
    <div>
      {categories && categories.map(category => (
        <Category
          key={category.id}
          id={category.id}
          items={items.filter(item=> item.categoryId === category.id)}
          // ItemListLength={ItemListLength}
          handleCheck={handleCheck}
          EditCategory={EditCategory}
          DeleteCategory={DeleteCategory}
          AddItem={AddItem}
          EditItem={EditItem}
          DeleteItem={DeleteItem}
          initialName={category.categoryName}
          ItemNameInputRef={ItemNameInputRef}
          itemsCategory={itemsCategory}
          categories={categories}
        />
      ))}
      <NewCategory 
        AddCategory={AddCategory}
        ItemNameInputRef={ItemNameInputRef}
      />
    </div>
  )
}

export default Categories