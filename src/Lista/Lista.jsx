import { useState, useEffect, useCallback } from 'react'
import '../App.css'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import Header from './Header'
import SubHeader from './SubHeader'
import Categories from './Categories'
import EStateLista from '../components/EStateLista'
import { useParams } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase-config'
import SharePopUp from '../components/SharePopUp'

const Lista = ({ deleteLista, id, listas, setListas, updateListaItems, updateListaCategories, handleArchive, handleDuplicate, usuario, sharePopupVisible, setSharePopupVisible }) => {

  let params = useParams();
  
  const [votesShown, setVotesShown] = useState(true)
  const [isEStateLista, setIsEStateLista] = useState(false)
  const [preciosOcultos, setPreciosOcultos] = useState(false)

  const selectedList = listas.find(lista => lista.id === params.id);
  // console.log({listas, params})

  const fetchLista = useCallback(async () => {
    if (!params.id) return;
  
    try {
      const docRef = doc(db, "listas", params.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const listaData = docSnap.data();
        
        // Actualiza la lista en el estado local
        setListas(prevListas => prevListas.map(lista => (lista.id === params.id ? listaData : lista)));
        
        // Si el usuario no está ya en la lista de userMember
        if (usuario && !listaData.userMember.includes(usuario.uid)) {
          // Agrega el usuario a la lista en Firestore
          await updateDoc(docRef, { userMember: [...listaData.userMember, usuario.uid] });
          
          // Actualiza el campo 'itemUserMember' en los ítems anidados
          const updatedItems = listaData.categories.map(category => 
            category.items.map(item => ({
              ...item,
              itemUserMember: [...item.itemUserMember, usuario.uid]
            }))
          );
          
          // Actualiza Firestore con los ítems modificados
          await updateDoc(docRef, {
            'categories.items': updatedItems
          });
        }
      } else {
        console.error("No hay tal documento!");
      }
    } catch (error) {
      console.error("Error al cargar la lista:", error);
    }
  }, [params.id, setListas, usuario]);
  

  // const fetchLista = useCallback(async () => {
  //   if (!params.id) return;
  
  //   try {
  //     const docRef = doc(db, "listas", params.id);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       const listaData = docSnap.data();
  //       if (usuario && !listaData.userMember.includes(usuario.uid)) {
  //         // Añadir el usuario a userMember de la lista
  //         const updatedUserMember = [...listaData.userMember, {uid: usuario.uid, nombre: usuario.nombre, apellido: usuario.apellido}];
          
  //         // Actualizar itemUserMember en todos los items
  //         const updatedCategories = listaData.categories.map(category => ({
  //           ...category,
  //           items: category.items.map(item => ({
  //             ...item,
  //             itemUserMember: [...item.itemUserMember, {uid: usuario.uid, nombre: usuario.nombre, apeliido: usuario.apellido}]
  //           }))
  //         }));
  //         // console.log(listaData.userMember)
  //         // console.log('updatedUserMember:', updatedUserMember);
  //         // console.log('updatedCategories:', updatedCategories);
  
  //         // Actualizar la lista en Firestore
  //         await updateDoc(docRef, { 
  //           userMember: updatedUserMember,
  //           categories: updatedCategories
  //         });
  
  //         // Actualizar el estado local
  //         listaData.userMember = updatedUserMember;
  //         listaData.categories = updatedCategories;
  //       }
  
  //       // Actualizar el estado de las listas
  //       setListas(prevListas => prevListas.map(lista => 
  //         lista.id === params.id ? listaData : lista
  //       ));
  //     } else {
  //       console.error("No existe tal documento!");
  //     }
  //   } catch (error) {
  //     console.error("Error al cargar la lista:", error);
  //   }
  // }, [params.id, setListas, usuario]);

  useEffect(() => {
    fetchLista();
  }, [fetchLista]);

  const AddItem = (name, price, categoryId) => {
    const newItem = { id: uuidv4(), listaId: params.id, itemUserMember: selectedList.userMember, categoryId, name, price, counterUp: [], counterDown: [], isChecked: false };
    const updatedItems = [...selectedList.items, newItem];
    updateListaItems(params.id, updatedItems);
    
    const updatedCategories = selectedList.categories.map(category => 
      category.id === categoryId 
        ? { ...category, items: [...category.items, newItem] }
        : category
    );
    updateListaCategories(params.id, updatedCategories);
  }

  // const handleItemUserMember = (id) => {
  //   const selectedCategories = selectedList.categories.map(category => {
  //     const updatedItems = category.items.map(item => {
  //         if (item.id === id) {
  //           const loadItemUserMember = item.counterDown.includes(usuario.uid)
  //           const userInCounterUp = item.counterUp.includes(usuario.uid)

  //           const updateCounterDown = userInCounterDown ? item.counterUp.filter(uid => uid !== usuario.uid) : [...item.counterDown, usuario.uid]
  //           const updateCounterUp = (!userInCounterDown && userInCounterUp) ? item.counterUp.filter(uid => uid !== usuario.uid) : item.counterUp
  //           return {...item, counterUp: updateCounterUp, counterDown: updateCounterDown}
  //         }
  //         return item
  //       })
  //       updateListaItems(params.id, updatedItems)
  //     return {...category, items: updatedItems}
  //   })
  //   updateListaCategories(params.id, selectedCategories)
  // }

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
    const itemToDelete = selectedList.items.find(item => item.id === id)
    const filteredItems = selectedList.items.filter(item => item.id !== id)
    const categoryId = itemToDelete.categoryId
    const categoryUpdated = selectedList.categories.find(category => category.id === categoryId)
    const updatedCategoryItems = categoryUpdated.items.filter(item => item.id !== id)
    updateListaItems(params.id, filteredItems)
    updateListaCategories(params.id, selectedList.categories.map(category => {
      if(category.id === categoryId) {
        return {...category, items: updatedCategoryItems}
      }
      return category
    }))
    let newDeletedItem = { type: 'item', data: itemToDelete };

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
    // updateListaItems(params.id, updatedItems)
    updateListaCategories(params.id, updatedCategories)
  }

  const ItemsChecked = () => {
    const totalCheckedItems = selectedList.categories.reduce((total, category) => {
      return total + category.items.filter(item => item.isChecked).length;
    },0)
    return totalCheckedItems
  }

  // console.log({selectedList})

//   const getListaItemsLength = (id) => {
//     const lista = listas.find(lista => lista.id === id)
//     return lista.categories.reduce((total, category) => {
//         return total + category.items.length
//     }, 0)
// }

  const getListaItemsLength = () => {
    return selectedList?.categories.reduce((total, category) => {
      return total + category.items.length;
    }, 0);
  };

  const totalItemsLength = getListaItemsLength()
  // const totalItemsLength = selectedList?.items.length
  const totalCategoriesLength = selectedList?.categories.length

  const AddCategory = (categoryName) => {
    const newCategory = { id: uuidv4(), listaId: params.id, categoryName, items: [], isChecked: false }
    const updatedCategories = [...selectedList.categories, newCategory]
    updateListaCategories(params.id, updatedCategories)
  }

  const EditCategory = (id, newCategoryName) => {
    const updatedCategories = selectedList.categories.map(category => {
      if (category.id === id) {
        return { ...category, categoryName: newCategoryName};
      }
      return category;
    });
  
    updateListaCategories(params.id, updatedCategories)
  };

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
    const categoryItems = selectedList.items.filter(item => item.categoryId === category.id);
    const sumPrice = categoryItems.reduce((acc, item) => acc + Number(item.price), 0)

    return {...category, itemsCount: categoryItems.length, sumPrice: sumPrice};
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

  const handleVotesVisible = () => {
    setVotesShown(prevState => !prevState)
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

  const handleOcultarPrecios = () => {
    setPreciosOcultos(prevState => !prevState)
  }

  return (
    <div className="lista app">
      {selectedList && (
        <>
          <Header
            handleVotesVisible={handleVotesVisible}
            votesShown={votesShown}
            deleteLista={() => deleteLista(params.id)}
            handleArchive={() => handleArchive(params.id)}
            handleDuplicate={handleDuplicate}
            itemslength={totalItemsLength}
            lista={selectedList}
            items={totalItemsLength}
            price={formattedTotalPrice}
            handleCheckAll={handleCheckAll}
            handleUnCheckAll={handleUnCheckAll}
            usuario={usuario}
            preciosOcultos={preciosOcultos}
            handleOcultarPrecios={handleOcultarPrecios}
          />
          <SubHeader 
            items={totalItemsLength}
            price={formattedTotalPrice}
            itemsAdquirido={ItemsChecked()}
            categories={selectedList.categories}
            preciosOcultos={preciosOcultos}
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
            votesShown={votesShown}
            preciosOcultos={preciosOcultos}
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
      )}
    </div>
  )
}

export default Lista