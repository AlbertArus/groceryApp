import Category from "../components/Category"
import NewCategory from "../components/NewCategory"

const Categories = ({ items, handleCheck, categories, AddCategory, EditCategory, DeleteCategory, AddItem, EditItem, DeleteItem}) => {
  
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
        />
      ))}
      <NewCategory 
        AddCategory={AddCategory}
      />
    </div>
  )
}

export default Categories