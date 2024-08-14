import { useState, useEffect, useRef } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
// import { Toast } from 'primereact/toast';
import toast, { Toaster } from 'react-hot-toast'
import Header from './Lista/Header';
import SubHeader from './Lista/SubHeader';
import Categories from './Lista/Categories';

function App() {

  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletedItem, setDeletedItem] = useState(null)
  const ToastRef = useRef(null)
  
  useEffect(() => {
    const savedItems = localStorage.getItem("items");
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (error) {
        console.error("Error parsing items from localStorage:", error);
        localStorage.removeItem("items");
      }
    }
  
    const savedCategories = localStorage.getItem("categories");
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error("Error parsing categories from localStorage:", error);
        localStorage.removeItem("categories");
      }
    }
  
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("items", JSON.stringify(items));
    }
  }, [items, loading]);
  
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("categories", JSON.stringify(categories));
    }
  }, [categories, loading]);

  const AddItem = (name, price, categoryId) => {
    setItems([...items, {id: uuidv4(), categoryId, name:name, price:price, isChecked: false}])
  }

  const EditItem = (id, name, price) => {
    setItems(items.map(item =>
      item.id === id ? {...item, name: name, price: price} : item
    ))
  }

  const DeleteItem = (id) => {
    setItems(items.filter(item =>
      item.id !== id
    ))
    toast((t) => (
      <span style={{display:"flex", alignItems:"center"}}>
        <span className="material-symbols-outlined" style={{marginRight:"8px", color:"#9E9E9E"}}>warning</span>
        Item eliminado!
        <button onClick={() => undoDelete()} style={{marginLeft:"10px", padding:"0", backgroundColor: "#FBE7C1", border:"none", fontFamily:"poppins", fontSize: "16px", cursor: "pointer"}}>
          <semibold>Deshacer</semibold>
        </button>
      </span>
      ), {
        style:{border: "2px solid #ED9E04", backgroundColor:"#FBE7C1"}
      }
    )
  }
  
  const handleCheck = (id) => {
    setItems(items.map(item =>
      item.id === id ? {...item, isChecked: !item.isChecked} : item,
    ));
  };

  const ItemsChecked = () => {
    return items.filter(item => item.isChecked).length;
  };

  const totalItemsLength = items.length

  const AddCategory = (categoryName, categoryPrice) => {
    setCategories([...categories, {id: uuidv4(), categoryName, items: [], categoryPrice, isChecked: false}])
  }

  const EditCategory = (id, categoryName) => {
    setCategories(categories.map(category =>
      category.id === id ? {...category, categoryName} : category
    ))
  }

  const DeleteCategory = (id) => {
    const CategoryToDelete = categories.find(category => category.id === id)
    const ItemsToDelete = items.filter(item => item.id === id)
    setCategories(categories.filter(category =>
      category.id !== id
    ))
    setItems(items.filter(item =>
      item.categoryId !== id
    ))

    setDeletedItem({category: CategoryToDelete, item: ItemsToDelete})

    toast((t) => (
      <span style={{display:"flex", alignItems:"center"}}>
        <span className="material-symbols-outlined" style={{marginRight:"8px", color:"#9E9E9E"}}>warning</span>
        Categoría eliminada!
        <button onClick={() => undoDelete()} style={{marginLeft:"10px", padding:"0", backgroundColor: "#FBE7C1", border:"none", fontFamily:"poppins", fontSize: "16px", fontWeigth: "900", cursor: "pointer"}}>
          Deshacer
        </button>
      </span>
      ), {
        style:{border: "2px solid #ED9E04", backgroundColor:"#FBE7C1"}
      }
    )
  }

  const undoDelete = () => {
    if(deletedItem) {
      setCategories(prevCategories => [...prevCategories, deletedItem.category])
      setItems(prevItems => [...prevItems, deletedItem.items])
    }
    setDeletedItem(null)
  }

  const categoriesSums = categories.map(category => {
    const categoryItems = items.filter(item => item.categoryId === category.id);
    const sumPrice = categoryItems.reduce((acc, item) => acc + Number(item.price), 0);

    return {
      ...category,
      itemsCount: categoryItems.length,
      sumPrice: sumPrice
    };
  });

  const totalPrice = categoriesSums.reduce((total, category) => total + category.sumPrice, 0);

  return (
    <div className="app">
      <div className='app-margin'>
        <Toaster 
          position="bottom-center"
          reverseOrder={false}
        />
        <Header 
          title={"Compra Cerdanya"}
          persons={"4"}
          planIcon={"travel"}
          plan={"Trip"}
        />
        <SubHeader 
          items={totalItemsLength}
          price={totalPrice}
          itemsAdquirido={ItemsChecked()}
          upNumber={"19"}
          downNumber={"6"}
          categories={categories}
        />
        <Categories
          items={items}
          handleCheck={handleCheck}
          categories={categories}
          AddCategory={AddCategory}
          EditCategory={EditCategory}
          DeleteCategory={DeleteCategory}
          AddItem={AddItem}
          EditItem={EditItem}
          DeleteItem={DeleteItem}
          ToastRef={ToastRef}
        />
      </div>
    </div>
  );
}

export default App;