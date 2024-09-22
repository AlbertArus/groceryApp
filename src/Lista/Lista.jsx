import { useState, useEffect, useRef, useCallback } from 'react'
import '../App.css'
import { v4 as uuidv4 } from 'uuid'
import toast, { Toaster } from 'react-hot-toast'
import Header from './Header'
import SubHeader from './SubHeader'
import Categories from './Categories'
import EStateLista from '../components/EStateLista'
import { useParams } from 'react-router-dom'

const Lista = ({ deleteLista, id, listas, setListas, updateListaItems, updateListaCategories, handleArchive, handleDuplicate }) => {

  let params = useParams();
  // console.log("soy el id de la url", params)
  
  // const [items, setItems] = useState([]);
  // const [categories, setCategories] = useState([]);
  // const [deletedItem, setDeletedItem] = useState(null)
  const [votesShown, setVotesShown] = useState(true)
  const [isEStateLista, setIsEStateLista] = useState(false)
  const votesRef = useRef({})

  const selectedList = listas.find(lista => lista.id === params.id);

  useEffect(() => {
    console.log("soy la lista completa", selectedList)
  },[selectedList])

  const AddItem = (name, price, categoryId) => {
    const newItem = { id: uuidv4(), listaId: params.id, categoryId, name, price, thumbUp: false, thumbDown: false, counterUp: 0, counterDown: 0, isChecked: false };
    const updatedItems = [...selectedList.items, newItem];
    updateListaItems(params.id, updatedItems);
    
    const updatedCategories = selectedList.categories.map(category => 
      category.id === categoryId 
        ? { ...category, items: [...category.items, newItem] }
        : category
    );
    updateListaCategories(params.id, updatedCategories);
  }

  const EditItem = (id, newName, newPrice) => {
    const index = selectedList.items.find(item => item.id === id)
    selectedList.items[index].name = newName 
    selectedList.items[index].price = newPrice
    updateListaItems(params.id, selectedList.items)
  }

  const DeleteItem = (id) => {
    const itemToDelete = selectedList.items.find(item => item.id === id)
    const filteredItems = selectedList.items.filter(item => item.id !== id) 
    updateListaItems(params.id, filteredItems)
    let newDeletedItem = { type: 'item', data: itemToDelete };
    // setDeletedItem(newDeletedItem);

    toast((t) => (
      <span style={{ display: "flex", alignItems: "center" }}>
        <span className="material-symbols-outlined" style={{ marginRight: "8px", color: "#9E9E9E" }}>warning</span>
        {`Has eliminado "${itemToDelete.name}"`}
        <button onClick={() => { undoDelete(newDeletedItem); toast.dismiss(t.id) }} style={{ marginLeft: "10px", padding: "0", backgroundColor: "#FBE7C1", border: "none", fontFamily: "poppins", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
          Deshacer
        </button>
      </span>
    ), {
      style: { border: "2px solid #ED9E04", backgroundColor: "#FBE7C1" }
    }
    )
  }

  const handleCheck = (id) => {
    const updatedItems = selectedList.items.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )

      const updatedCategories = selectedList.categories.map(category => {
          const categoryItems = updatedItems.filter(item => item.categoryId === category.id);
          const allItemsChecked = categoryItems.every(item => item.isChecked);
          return {
            ...category,
            isChecked: allItemsChecked,
            items: categoryItems
          }
        })

      updateListaCategories(params.id, updatedItems)
      updateListaCategories(params.id, updatedCategories)
  }

  const ItemsChecked = () => {
    return selectedList.items.filter(item => item.isChecked).length;
  }

  const totalItemsLength = selectedList.items.length
  const totalCategoriesLength = selectedList.categories.length

  const AddCategory = (categoryName, categoryPrice) => {
    const newCategory = { id: uuidv4(), listaId: params.id, categoryName, items: [], categoryPrice, isChecked: false }
    const updatedCategories = [...selectedList.categories, newCategory]
    updateListaCategories(params.id, updatedCategories)
  }

  const EditCategory = (id, newCategoryName) => {
    const index = selectedList.categories.findIndex(category => category.id === id)
    selectedList.categories[index].categoryName = newCategoryName
    updateListaCategories(params.id, selectedList.categories)
  }

  const DeleteCategory = (id) => {
    const CategoryToDelete = selectedList.categories.find(category => category.id === id)
    const ItemsToDelete = selectedList.items.filter(item => item.categoryId === id)
    // setCategories(categories.filter(category => category.id !== id))
    // setItems(items.filter(item => item.categoryId !== id))

    const filteredCategories = selectedList.categories.filter(category => category.id !== id)
    updateListaCategories(params.id, filteredCategories)

    let newDeletedItem = { type: 'category', data: { category: CategoryToDelete, items: ItemsToDelete } };
    // setDeletedItem(newDeletedItem);

    toast((t) => (
      <span style={{ display: "flex", alignItems: "center" }}>
        <span className="material-symbols-outlined" style={{ marginRight: "8px", color: "#9E9E9E" }}>warning</span>
        {`Has eliminado "${CategoryToDelete.categoryName}"`}
        <button onClick={() => { undoDelete(newDeletedItem); toast.dismiss(t.id) }} style={{ marginLeft: "10px", padding: "0", backgroundColor: "#FBE7C1", border: "none", fontFamily: "poppins", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
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
      if (itemToRestore.type === 'lista') {
        setListas(prevListas => [...prevListas, itemToRestore.data.lista]);
      } else if (itemToRestore.type === 'category') {
        const updatedCategories = [...selectedList.categories, itemToRestore.data.category];
        updateListaCategories(params.id, updatedCategories);
        const updatedItems = [...selectedList.items, ...itemToRestore.data.items];
        updateListaItems(params.id, updatedItems);
      } else if (itemToRestore.type === 'item') {
        const updatedItems = [...selectedList.items, itemToRestore.data];
        updateListaItems(params.id, updatedItems);
      }
    }
  }, [params.id, selectedList, updateListaCategories, updateListaItems, setListas])

  const categoriesSums = selectedList.categories.map(category => {
    const categoryItems = selectedList.items.filter(item => item.categoryId === category.id);
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
    const updatedItems = selectedList.items.map(item => {
        if (item.id === id) {
          if (item.thumbUp) {
            return { ...item, thumbUp: false, counterUp: item.counterUp - 1 }
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
    updateListaItems(params.id, updatedItems)
  }

  const handleThumbDown = (id) => {
    const updatedItems = selectedList.items.map(item => {
        if (item.id === id) {
          if (item.thumbDown) {
            return { ...item, thumbDown: false, counterDown: item.counterDown - 1 }
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
    updateListaItems(params.id, updatedItems)
  }

  const handleVotesVisible = () => {
    setVotesShown(prevState => !prevState)
  }

  useEffect(() => {
    selectedList.items.forEach(item => {
      const currentRef = votesRef.current[item.id]
      if (currentRef) {
        currentRef.style.display = votesShown ? "flex" : "none"
      }
    })
  }, [votesShown, selectedList.items])

  useEffect(() => {
    if (totalCategoriesLength === 0) {
      setIsEStateLista(true);
    } else {
      setIsEStateLista(false);
    }
  }, [totalCategoriesLength]);

  useEffect(() => {
    console.log(selectedList.categories)
  },[selectedList])
  useEffect(() => {
    console.log(selectedList.items)
  },[selectedList])

  return (
    <div className="lista app">
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      {selectedList && (
        <>
          <Header
            listaName={selectedList.listaName}
            members={selectedList.members}
            planIcon={"travel"}
            plan={selectedList.plan}
            descriptionLista={selectedList.descriptionLista}
            handleVotesVisible={handleVotesVisible}
            votesShown={votesShown}
            deleteLista={() => deleteLista(params.id)}
            handleArchive={() => handleArchive(params.id)}
            handleDuplicate={handleDuplicate}
            itemslength={totalItemsLength}
            lista={selectedList}
          />
          <SubHeader 
            items={totalItemsLength}
            price={formattedTotalPrice}
            itemsAdquirido={ItemsChecked()}
            categories={selectedList.categories}
          />
          <Categories
            items={selectedList.items}
            handleCheck={handleCheck}
            categories={selectedList.categories}
            AddCategory={AddCategory}
            EditCategory={EditCategory}
            DeleteCategory={DeleteCategory}
            AddItem={AddItem}
            EditItem={EditItem}
            DeleteItem={DeleteItem}
            handleThumbDown={handleThumbDown}
            handleThumbUp={handleThumbUp}
            thumbUp={selectedList.items.thumbUp}
            thumbDown={selectedList.items.thumbDown}
            counterUp={selectedList.items.counterUp}
            counterDown={selectedList.items.counterDown}
            votesRef={votesRef}
          />
          {isEStateLista && 
            <div className="emptyState">
              <EStateLista 
                AddCategory={AddCategory}
              />
            </div>
          }
        </>
      )}
    </div>
  )
}

export default Lista