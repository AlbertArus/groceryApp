// import NewCategory from "./NewCategory"

// const EStateLista = ({AddCategory}) => {
//     return (
//       <div>
//         <img src="/Fotos GroceryApp/_7b52f185-ed1a-44fe-909c-753d4c588278-removebg-preview.png" alt="Set of grocery bags full of items" style={{width:"100%", height:"100%"}}></img>
//         <h5 style={{display: "flex", textAlign:"center", justifyContent: "center", margin:"0px 30px"}}>Completa tu lista. Crea tu primera categoría y añade tantos items como quieras</h5>
//         <button>
//             <NewCategory 
//                 AddCategory={AddCategory}
//             />
//         </button>
//       </div>
//     )
//   }
  
//   export default EStateLista

const EStateLista = ({AddCategory}) => {
  const handleAddCategory = () => {
      const defaultCategoryName = "";
      AddCategory(defaultCategoryName); 
  }

  return (
    <div style={{display: "flex", flexDirection:"column", textAlign:"center", justifyContent: "center"}}>
      <img src="/Fotos GroceryApp/_7b52f185-ed1a-44fe-909c-753d4c588278-removebg-preview.png" alt="Set of grocery bags full of items" style={{width:"100%", height:"100%"}}></img>
      <h5 style={{margin:"0px 30px"}}>Completa tu lista. Crea tu primera categoría y añade tantos items como quieras</h5>
      <button onClick={handleAddCategory} style={{padding: "10px 20px", backgroundColor: "#9E9E9E", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", width:"40%", height:"40%",display: "flex", justifyContent: "center"}}>
          Añadir Categoría
      </button>
    </div>
  )
}

export default EStateLista