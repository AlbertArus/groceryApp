import { useState, useEffect, useRef, useCallback } from 'react'
import '../App.css'
import { v4 as uuidv4 } from 'uuid'
// import { Toast } from 'primereact/toast'
import toast, { Toaster } from 'react-hot-toast'
import Header from './Header'
import SubHeader from './SubHeader'
import Categories from './Categories'

const Lista = () => {

  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletedItem, setDeletedItem] = useState(null)
  const [votesShown, setVotesShown] = useState(true)
  const [thumbUp, setThumbUp] = useState(false)
  const [counterUp, setCounterUp] = useState(0)
  const [thumbDown, setThumbDown] = useState(false)
  const [counterDown, setCounterDown] = useState(0)
  const votesRef = useRef({})

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

  // useEffect(() => {
  //   if (!loading) {
  //     console.log(localStorage.getItem("categories"))
  //   }
  // }, [categories, loading]);

  const AddItem = (name, price, categoryId) => {
    const newItem = {id: uuidv4(), categoryId, name:name, price:price, thumbUp: false, thumbDown: false, counterUp: 0, counterDown: 0, isChecked: false}
    setItems(prevItems => [...prevItems, newItem])
    addItemToCategory(newItem)
  }

  const EditItem = (id, name, price) => {
    setItems(items.map(item =>
      item.id === id ? {...item, name: name, price: price} : item
    ))
  }

  const DeleteItem = (id) => {
    const itemToDelete = items.find(item => item.id === id)
    setItems(items.filter(item => item.id !== id))
    const newDeletedItem = { type: 'item', data: itemToDelete };
    setDeletedItem(newDeletedItem);

    toast((t) => (
      <span style={{ display: "flex", alignItems: "center" }}>
        <span className="material-symbols-outlined" style={{ marginRight: "8px", color: "#9E9E9E" }}>warning</span>
        {`Has eliminado "${itemToDelete.name}"`}
        <button onClick={() => {undoDelete(newDeletedItem); toast.dismiss(t.id)}} style={{ marginLeft: "10px", padding: "0", backgroundColor: "#FBE7C1", border: "none", fontFamily: "poppins", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
          Deshacer
        </button>
      </span>
      ), {
        style: { border: "2px solid #ED9E04", backgroundColor: "#FBE7C1" }
      }
    )
  }
  
  const handleCheck = (id) => {
    setItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === id ? {...item, isChecked: !item.isChecked} : item
      )
      
      setCategories(prevCategories => 
        prevCategories.map(category => {
          const categoryItems = newItems.filter(item => item.categoryId === category.id);
          const allItemsChecked = categoryItems.every(item => item.isChecked);
          return { 
            ...category, 
            isChecked: allItemsChecked,
            items: categoryItems
          }
        })
      )
  
      return newItems;
    })
  }

  const ItemsChecked = () => {
    return items.filter(item => item.isChecked).length;
  }

  const totalItemsLength = items.length

  const AddCategory = (categoryName, categoryPrice) => {
    setCategories([...categories, {id: uuidv4(), categoryName, items: [], categoryPrice, isChecked: false}])
  }

  const addItemToCategory = (item) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === item.categoryId ? {...category, items:[...category.items, item]} : category
      )
    )
  }

  const EditCategory = (id, categoryName) => {
    setCategories(categories.map(category =>
      category.id === id ? {...category, categoryName} : category
    ))
  }

  const DeleteCategory = (id) => {
    const CategoryToDelete = categories.find(category => category.id === id)
    const ItemsToDelete = items.filter(item => item.categoryId === id)
    setCategories(categories.filter(category => category.id !== id))
    setItems(items.filter(item =>item.categoryId !== id))

    const newDeletedItem = { type: 'category', data: { category: CategoryToDelete, items: ItemsToDelete } };
    setDeletedItem(newDeletedItem);

    toast((t) => (
      <span style={{ display: "flex", alignItems: "center" }}>
        <span className="material-symbols-outlined" style={{ marginRight: "8px", color: "#9E9E9E" }}>warning</span>
        {`Has eliminado "${CategoryToDelete.categoryName}"`}
        <button onClick={() => {undoDelete(newDeletedItem); toast.dismiss(t.id)}} style={{ marginLeft: "10px", padding: "0", backgroundColor: "#FBE7C1", border: "none", fontFamily: "poppins", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
          Deshacer
        </button>
      </span>
      ), {
        style: { border: "2px solid #ED9E04", backgroundColor: "#FBE7C1" }
      }
    )
  }

  const undoDelete = useCallback((itemToRestore) => {
    if (itemToRestore) {
      if (itemToRestore.type === 'category') {
        setCategories(prevCategories => [...prevCategories, itemToRestore.data.category]);
        setItems(prevItems => [...prevItems, ...itemToRestore.data.items]);
      } else if (itemToRestore.type === 'item') {
        setItems(prevItems => [...prevItems, itemToRestore.data]);
      }
      setDeletedItem(null);
    }
  }, [])

  const categoriesSums = categories.map(category => {
    const categoryItems = items.filter(item => item.categoryId === category.id);
    const sumPrice = categoryItems.reduce((acc, item) => acc + Number(item.price), 0)

    return { 
      ...category, 
      itemsCount: categoryItems.length, 
      sumPrice: sumPrice
    };
  });

  const totalPrice = categoriesSums.reduce((total, category) => total + category.sumPrice, 0)
  const formattedTotalPrice = totalPrice.toLocaleString("es-ES", { style: "currency", currency: "EUR" })

  const handleThumbUp = (id) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if(item.id === id) {
          if (item.thumbUp) {
            return {...item, thumbUp: false, counterUp: item.counterUp -1}
          } else {
            if (item.thumbDown) {
              return { ...item, thumbUp: true, thumbDown: false, counterDown: item.counterDown - 1, counterUp: item.counterUp + 1 };
            } else {
              return { ...item, thumbUp: true, counterUp: item.counterUp + 1 };
            }
          }
        }
        return item
      })      
    )
  }
  
  const handleThumbDown = (id) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if(item.id === id) {
          if (item.thumbDown) {
            return {...item, thumbDown: false, counterDown: item.counterDown -1}
          } else {
            if (item.thumbUp) {
              return { ...item, thumbDown: true, thumbUp: false, counterUp: item.counterUp - 1, counterDown: item.counterDown + 1 };
            } else {
              return { ...item, thumbDown: true, counterDown: item.counterDown + 1 };
            }
          }
        }
        return item
      })
    )
  }

  const handleVotesVisible = () => {
    setVotesShown(prevState => !prevState)
  }

  useEffect(() => {
    items.forEach(item => {
      const currentRef = votesRef.current[item.id]
      if(currentRef) {
        currentRef.style.display = votesShown ? "flex" : "none"
      }
    })
  },[votesShown, items])

  return (
    <div className="app">
        <Toaster 
          position="bottom-center"
          reverseOrder={false}
        />
        <Header 
          title={"Compra Cerdanya"}
          persons={"4"}
          planIcon={"travel"}
          plan={"Trip"}
          handleVotesVisible={handleVotesVisible}
          votesShown={votesShown}
        />
        <SubHeader 
          items={totalItemsLength}
          price={formattedTotalPrice}
          itemsAdquirido={ItemsChecked()}
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
          handleThumbDown={handleThumbDown}
          handleThumbUp={handleThumbUp}
          thumbUp={thumbUp}
          thumbDown={thumbDown}
          counterUp={counterUp}
          counterDown={counterDown}
          votesRef={votesRef}
        />
    </div>
  )
}

export default Lista