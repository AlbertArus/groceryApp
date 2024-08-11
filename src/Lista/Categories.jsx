import CategoryList from "../components/CategoryList"
import NewCategory from "../components/NewCategory"

const Categories = ({ items, handleCheck, AddItem, EditItem, DeleteItem}) => {
  return (
    <div>
      <CategoryList 
        items={items}
        // ItemListLength={ItemListLength}
        handleCheck={handleCheck}
        AddItem={AddItem}
        EditItem={EditItem}
        DeleteItem={DeleteItem}
        nameCategory={"Desayuno"}
        price={"23"}
      />
      <NewCategory 
      
      />
    </div>
  )
}

export default Categories