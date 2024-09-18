import NewCategory from "./NewCategory"

const EStateLista = ({AddCategory}) => {
    return (
      <div>
        <img src="/Fotos GroceryApp/_7b52f185-ed1a-44fe-909c-753d4c588278-removebg-preview.png" alt="Set of grocery bags full of items" style={{width:"100%", height:"100%"}}></img>
        <h5 style={{display: "flex", textAlign:"center", justifyContent: "center", margin:"0px 30px"}}>Completa tu lista. Crea tu primera categoría y añade tantos items como quieras</h5>
        <button>
            <NewCategory 
                AddCategory={AddCategory}
            />
        </button>
      </div>
    )
  }
  
  export default EStateLista