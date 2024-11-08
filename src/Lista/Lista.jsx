import { useState, useEffect, useCallback, useRef } from 'react'
import '../App.css'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import Header from './Header'
import SubHeader from './SubHeader'
import Categories from './Categories'
import EStateLista from '../components/EStateLista'
import { useParams } from 'react-router-dom'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../firebase-config'
import SharePopUp from '../components/SharePopUp'
import Search from './Search'
import ToggleItems from './ToggleItems'
import Pagos from '../Pagos/Pagos'
import Toggle from "../ui-components/Toggle"
// import ToggleAreas from './ToggleAreas'

// import Gastos from './Gastos'

const Lista = ({ deleteLista, id, listas, setListas, updateListaItems, updateListaCategories, handleArchive, usuario, sharePopupVisible, setSharePopupVisible, handleOcultarPrecios, handleVotesVisible }) => {

  let params = useParams();
  
  const [isEStateLista, setIsEStateLista] = useState(false)
  const [searchResult, setSearchResult] = useState("")
  const [filteredListaForItems, setFilteredListaForItems] = useState(null)
  const [isToggleSelected, setIsToggleSelected] = useState("Lista")
  const [isToggleShown, setIsToggleShown] = useState(false)
  // const [isEditable, setIsEditable] = useState(false)
  const firstCategoryRef = useRef(null)

  const selectedList = listas.find(lista => lista.id === params.id);
  
  const fetchLista = useCallback(async () => {
    if (!params.id) return;
  
    try {
      const docRef = doc(db, "listas", params.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const listaData = docSnap.data();
        
        setListas(prevListas => prevListas.map(lista => (lista.id === params.id ? listaData : lista)));
        
        if (usuario && !listaData.userMember.includes(usuario.uid)) {
          const updatedUserMember = [...listaData.userMember, usuario.uid];
          await updateDoc(docRef, { userMember: updatedUserMember });

          const updatedCategories = listaData.categories.map(category => ({
            ...category,
            items: category.items.map(item => ({
              ...item,
              itemUserMember: [...item.itemUserMember, usuario.uid]
            }))
          }));
          
          await updateDoc(docRef, {
            categories: updatedCategories
          });

          setListas(prevListas =>
            prevListas.map(lista => 
              lista.id === params.id 
                ? { ...lista, userMember: updatedUserMember, categories: updatedCategories }
                : lista
            )
          );
        }
      } else {
        console.error("No tenemos el documento que buscas...");
      }
    } catch (error) {
      console.error("Error al cargar la lista:", error);
    }
  }, [params.id, setListas, usuario]);

  useEffect(() => {
    const docRef = doc(db, "listas", params.id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const listaData = docSnap.data();
        setListas(prevListas => prevListas.map(lista => (lista.id === params.id ? listaData : lista)));
        // console.log(listas)
      }
    });
  
    return () => unsubscribe(); // Cleanup on component unmount
  }, [params.id, setListas]);  

  const UsuarioCompleto = async (uid) => {
    const userDoc = await getDoc(doc(db, "usuarios", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return `${userData.nombre} ${userData.apellido}`;
    }
    return "Usuario desconocido"; // Fallback si el usuario no se encuentra
  }

  const handleDeleteItemUserMember = (id, uid) => {
    const updatedCategories = selectedList.categories.map(category => (
      {...category, items: category.items.map(item => 
        item.id === id ? {...item, itemUserMember: item.itemUserMember.filter(memberId => memberId !== uid)} : item
      ),
    }))
    updateListaCategories(params.id, updatedCategories);
  }
  
  useEffect(() => {
    fetchLista();
  }, [fetchLista])

  useEffect(() => {
    if(selectedList) {
      const allItems = selectedList.categories.flatMap(category => category.items)
      const anyItemMissingUser = allItems.some(item =>
        !item.itemUserMember.includes(usuario.uid)
      )  
      if (anyItemMissingUser) {
        setIsToggleShown(true)
      }
    }
  },[selectedList, usuario.uid])

  const AddItem = (name, price, categoryId) => {
    const newItem = { id: uuidv4(), listaId: params.id, itemCreator: usuario.uid, itemUserMember: selectedList.userMember, categoryId, name, price, counterUp: [], counterDown: [], isChecked: false };
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
    const updatedCategories = selectedList.categories.map(category => {
      const updatedItems = category.items.map(item => {
      if (item.id === id) {
        return { ...item, name: newName, price: newPrice }
      }
      return item
    })
    return {...category, items: updatedItems}
  })
  
    updateListaCategories(params.id, updatedCategories)
  }

  const DeleteItem = (id) => {  
    // Encuentra el item y su categoría
    let itemToDelete;
    let categoryId;
    selectedList.categories.forEach(category => {
      const item = category.items.find(item => item.id === id);
      if (item) {
        itemToDelete = item;
        categoryId = category.id;
      }
    });
  
    if (!itemToDelete || !categoryId) {
      console.error("No se pudo encontrar el item o la categoría.");
      return;
    }
  
    // Filtra los items actualizados
    const filteredItems = selectedList.categories.flatMap(category =>
      category.items.filter(item => item.id !== id)
    );
  
    // Encuentra y actualiza la categoría
    const categoryUpdated = selectedList.categories.find(category => category.id === categoryId);
    const updatedCategoryItems = categoryUpdated.items.filter(item => item.id !== id);
  
    updateListaItems(params.id, filteredItems);
    updateListaCategories(params.id, selectedList.categories.map(category => {
      if (category.id === categoryId) {
        return { ...category, items: updatedCategoryItems };
      }
      return category;
    }));
  
    let newDeletedItem = { type: 'item', data: itemToDelete };
    console.log("has llamado bien a eliminar", id);
  
    toast((t) => (
      <span style={{ display: "flex", alignItems: "center" }}>
        <span
          className="material-symbols-outlined"
          style={{ marginRight: "8px", color: "#9E9E9E" }}
        >
          warning
        </span>
        {`Has eliminado "${itemToDelete.name}"`}
        <button
          onClick={() => { undoDelete(newDeletedItem); toast.dismiss(t.id); }}
          style={{
            marginLeft: "10px",
            padding: "0",
            backgroundColor: "#FBE7C1",
            border: "none",
            fontFamily: "poppins",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Deshacer
        </button>
      </span>
    ), {
      style: { border: "2px solid #ED9E04", backgroundColor: "#FBE7C1" }
    });
  };
  


  const handleCheck = (id) => {
    const updatedCategories = selectedList.categories.map(category => {
      const updatedItems = category.items.map(item =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
      const categoryItems = updatedItems.filter(item => item.categoryId === category.id);
      if (categoryItems.length === 0) {
        return { ...category, items: categoryItems }
      }
      const allItemsChecked = categoryItems.every(item => item.isChecked);
      return {...category, isChecked: allItemsChecked, items: categoryItems}
    })
    updateListaCategories(params.id, updatedCategories)
  }

  const ItemsChecked = () => {
    const totalCheckedItems = selectedList.categories.reduce((total, category) => {
      return total + category.items.filter(item => item.isChecked).length;
    },0)
    return totalCheckedItems
  }

  const getListaItemsLength = () => {
    return selectedList?.categories.reduce((total, category) => {
      return total + category.items.length;
    }, 0)
  }

  const totalItemsLength = getListaItemsLength()
  // const totalItemsLength = selectedList?.items.length
  const totalCategoriesLength = selectedList?.categories.length

  const AddCategory = (categoryName) => {
    const newCategory = { id: uuidv4(), listaId: params.id, categoryCreator: usuario.uid, categoryName, items: [], isChecked: false }
    const updatedCategories = [...selectedList.categories, newCategory]
    updateListaCategories(selectedList.id, updatedCategories)
  }

  const EditCategory = (id, newCategoryName) => {
    const updatedCategories = selectedList.categories.map(category => {
      if (category.id === id) {
        return { ...category, categoryName: newCategoryName};
      }
      return category;
    });
  
    updateListaCategories(params.id, updatedCategories)
  }

  const DeleteCategory = (id) => {
    const CategoryToDelete = selectedList.categories.find(category => category.id === id)
    const ItemsToDelete = selectedList.items.filter(item => item.categoryId === id)

    const filteredCategories = selectedList.categories.filter(category => category.id !== id)
    updateListaCategories(params.id, filteredCategories)

    let newDeletedItem = { type: 'category', data: { category: CategoryToDelete, items: ItemsToDelete } };

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

  const categoriesSums = selectedList?.categories.map(category => {
    const sumPrice = category.items.reduce((acc, item) => acc + Number(item.price), 0)

    return {...category, sumPrice: sumPrice};
  });

  const totalPrice = categoriesSums?.reduce((total, category) => total + category.sumPrice, 0)
  const formattedTotalPrice = totalPrice?.toLocaleString("es-ES", { style: "currency", currency: "EUR" })

  const handleCounterUp = (id) => {
    const selectedCategories = selectedList.categories.map(category => {
      const updatedItems = category.items.map(item => {
          if (item.id === id) {
            const userInCounterUp = item.counterUp.includes(usuario.uid)
            const userInCounterDown = item.counterDown.includes(usuario.uid)

            const updateCounterUp = userInCounterUp ? item.counterUp.filter(uid => uid !== usuario.uid) : [...item.counterUp, usuario.uid]
            const updateCounterDown = (!userInCounterUp && userInCounterDown) ? item.counterDown.filter(uid => uid !== usuario.uid) : item.counterDown
            return {...item, counterUp: updateCounterUp, counterDown: updateCounterDown}
          }
          return item
        })
        updateListaItems(params.id, updatedItems)
      return {...category, items: updatedItems}
    })
    updateListaCategories(params.id, selectedCategories)
  }

  const handleCounterDown = (id) => {
    const selectedCategories = selectedList.categories.map(category => {
      const updatedItems = category.items.map(item => {
          if (item.id === id) {
            const userInCounterDown = item.counterDown.includes(usuario.uid)
            const userInCounterUp = item.counterUp.includes(usuario.uid)

            const updateCounterDown = userInCounterDown ? item.counterUp.filter(uid => uid !== usuario.uid) : [...item.counterDown, usuario.uid]
            const updateCounterUp = (!userInCounterDown && userInCounterUp) ? item.counterUp.filter(uid => uid !== usuario.uid) : item.counterUp
            return {...item, counterUp: updateCounterUp, counterDown: updateCounterDown}
          }
          return item
        })
        updateListaItems(params.id, updatedItems)
      return {...category, items: updatedItems}
    })
    updateListaCategories(params.id, selectedCategories)
  }

  useEffect(() => {
    if (totalCategoriesLength === 0) {
      setIsEStateLista(true);
    } else {
      setIsEStateLista(false);
    }
  }, [totalCategoriesLength]);

  if(listas.length === 0) {
    return <div>Cargando listas...</div>
  }

  const handleCheckAll = () => {
    const updatedCategories = selectedList.categories.map(category => {
      const updatedItems = category.items.map(item => ({...item, isChecked: true }))

      return {...category, items: updatedItems}
    })
    updateListaCategories(params.id, updatedCategories)
  }

  const handleUnCheckAll = () => {
    const updatedCategories = selectedList.categories.map(category => {
      const updatedItems = category.items.map(item => ({...item, isChecked: false }))

      return {...category, items: updatedItems}
    })
    updateListaCategories(params.id, updatedCategories)
  }

  return (
    <div className="lista app">
      {selectedList && (
        <>
          <Header
            handleVotesVisible={handleVotesVisible}
            deleteLista={() => deleteLista(params.id)}
            handleArchive={handleArchive}
            itemslength={totalItemsLength}
            lista={selectedList}
            items={totalItemsLength}
            price={formattedTotalPrice}
            handleCheckAll={handleCheckAll}
            handleUnCheckAll={handleUnCheckAll}
            usuario={usuario}
            handleOcultarPrecios={handleOcultarPrecios}
            UsuarioCompleto={UsuarioCompleto}
          />
          <Toggle 
            option1={"Lista"}
            option2={"Pagos"}
            form={"bars"}
            isToggleSelected={isToggleSelected}
            setIsToggleSelected={setIsToggleSelected}
          />
          {isToggleSelected === "Lista" ? (
            <>
              {isToggleShown &&
                <Toggle
                  option1={"Todos"}
                  option2={"Mis items"}
                  form={"tabs"}
                  lista={selectedList}
                  setFilteredListaForItems={setFilteredListaForItems}
                  usuario={usuario}
                />
              }
              {!isEStateLista && !isToggleShown &&
                <Search
                  lista={selectedList}
                  setSearchResult={setSearchResult}            
                />
              }
              <SubHeader 
                items={totalItemsLength}
                price={formattedTotalPrice}
                itemsAdquirido={ItemsChecked()}
                categories={selectedList.categories}
                lista={selectedList}
              />
              <Categories
                items={selectedList.categories.flatMap(category => category.items)}
                categories={selectedList.categories}
                handleCheck={handleCheck}
                AddCategory={AddCategory}
                EditCategory={EditCategory}
                DeleteCategory={DeleteCategory}
                AddItem={AddItem}
                EditItem={EditItem}
                DeleteItem={DeleteItem}
                handleCounterDown={handleCounterDown}
                handleCounterUp={handleCounterUp}
                isEStateLista={isEStateLista}
                lista={selectedList}
                setSearchResult={setSearchResult}
                searchResult={searchResult}
                firstCategoryRef={firstCategoryRef}
                UsuarioCompleto={UsuarioCompleto}
                filteredListaForItems={filteredListaForItems}
                handleDeleteItemUserMember={handleDeleteItemUserMember}
                />
              {isEStateLista && 
                <div className="emptyState">
                  <EStateLista 
                    AddCategory={AddCategory}
                  />
                </div>
              }
              {sharePopupVisible && 
                <SharePopUp
                  setSharePopupVisible={setSharePopupVisible}
                />
              }
            </>
          ) : (
            <>
              <Pagos
                lista={selectedList} 
                itemsLength={totalItemsLength}
                price={formattedTotalPrice}
                itemsAdquirido={ItemsChecked()}

              />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Lista