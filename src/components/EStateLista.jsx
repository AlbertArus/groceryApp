
const EStateLista = ({AddCategory}) => {
  const handleAddCategory = () => {
      const defaultCategoryName = "";
      AddCategory(defaultCategoryName); 
  }

  return (
    <div className="emptyState app-margin">
      <img src="/Fotos GroceryApp/_7b52f185-ed1a-44fe-909c-753d4c588278-removebg-preview.png" alt="Set of grocery bags full of items" style={{width:"100%", height:"100%"}}></img>
      <h5 >Completa tu lista. Crea tu primera categoría <br/> y añade tantos items como quieras</h5>
      <h5 className="button_emptyState" onClick={handleAddCategory}>
          Añadir Categoría
      </h5>
    </div>
  )
}

export default EStateLista