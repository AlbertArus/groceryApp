import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import '../App.css'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import Header from './Header'
import SubHeader from './SubHeader'
import Categories from './Categories'
import { useParams, useSearchParams } from 'react-router-dom'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase-config'
import SharePopUp from '../components/SharePopUp'
import Search from './Search'
import Pagos from '../Pagos/Pagos'
import Toggle from "../ui-components/Toggle"
import EmptyState from '../ui-components/EmptyState'
import PagoDeuda from '../Pagos/PagoDeuda'
import IdentifyUser from '../components/IdentifyUser'
import LoadingPage from '../components/LoadingPage'

const Lista = ({ deleteLista, listas, setListas, updateListaItems, updateListaCategories, usuario, sharePopupVisible, setSharePopupVisible, UsuarioCompleto, updateLista, AddPayment, showIdentifyList, setShowIdentifyList, handleArchive, handleShowVotes, handleShowPrices }) => {

  let params = useParams();
  
  const [isEStateLista, setIsEStateLista] = useState(false)
  const [searchResult, setSearchResult] = useState("")
  const [filteredListaForItems, setFilteredListaForItems] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams();
  const [isToggleSelected, setIsToggleSelected] = useState(() => {
    return searchParams.get("view") === "payments" ? "Pagos" : "Lista";
  })
  const [isToggleActive, setIsToggleActive] = useState(() => {
    if (searchParams.get("view") === "payments") {
        return searchParams.get("area") === "pagos" ? "Pagos" : "Resumen"
    } else {
        return searchParams.get("area") === "misitems" ? "Mis items" : "Todos"
    }
  })
  const [isToggleShown, setIsToggleShown] = useState(false)
  const firstCategoryRef = useRef(null)
  const selectedList = listas.find(lista => lista.id === params.id);
  const [isScrolled, setIsScrolled] = useState(false)
  const [deletedElement, setDeletedElement] = useState([])

  const fetchLista = useCallback(async () => {
    if (!params.id) return;
  
    try {
      const docRef = doc(db, "listas", params.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
          const listaData = docSnap.data();
          setListas(prevListas => prevListas.map(lista => (lista.id === params.id ? listaData : lista)));
        
        if (usuario && !listaData.userMember.includes(usuario.uid)) {
            setShowIdentifyList(true)
        }
      } else {
        console.error("No tenemos el documento que buscas...");
      }
    } catch (error) {
      console.error("Error al cargar la lista:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, setListas, usuario]);

  useEffect(() => {
    const docRef = doc(db, "listas", params.id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const listaData = docSnap.data();
        setListas(prevListas => prevListas.map(lista => (lista.id === params.id ? listaData : lista)));
      }
    });
  
    return () => unsubscribe(); // Cleanup on component unmount
  }, [params.id, setListas]);  

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
      const anyItemMissingUser = allItems.some(item => {
        return !item.itemUserMember.includes(usuario.uid)
    })  
    setIsToggleShown(anyItemMissingUser)
    }
  },[selectedList, usuario.uid])

  useEffect(() => {
    const view = searchParams.get("view")
    const area = searchParams.get("area")

    if (view === "payments") {
        setIsToggleSelected("Pagos")
        setIsToggleActive(area === "pagos" ? "Pagos" : "Resumen")
    } else {
        setIsToggleSelected("Lista")
        setIsToggleActive(isToggleShown && area === "misitems" ? "Mis items" : "Todos")
    }
  }, [searchParams, isToggleShown])

  useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 40)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
        window.removeEventListener("scroll", handleScroll)
    }
    },[])

  const AddItem = (name, price, categoryId) => {
    const newItem = { id: uuidv4(), listaId: params.id, itemCreator: usuario.uid, itemUserMember: selectedList.userMember, categoryId, name, price, counterUp: [], counterDown: [], isChecked: false, isPaid: false, payer: "" };
    const updatedItems = [...selectedList.items, newItem];
    updateListaItems(params.id, updatedItems);
    
    const updatedCategories = selectedList.categories.map(category => {
        if(category.id === categoryId) {
            const newItems = [...category.items, newItem]
            const allItemsChecked = newItems.every(item => item.isChecked);
            return { ...category, items: newItems, isChecked: allItemsChecked };
        }
        return category;
    });
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
    const itemToDelete = selectedList.categories.flatMap(category => category.items).find(item => item.id === id);
    
    const categoryItemToDelete = selectedList.categories.find(category => category.id === itemToDelete.categoryId);
    const updatedCategoryItems = categoryItemToDelete.items.filter(item => item.id !== id);
    const updatedCategory = {...categoryItemToDelete, items: updatedCategoryItems}
    const updatedCategories = selectedList.categories.map(category =>
        category.id === updatedCategory.id ? updatedCategory : category
      );

    if (!itemToDelete) {
        console.error("No se pudo encontrar el item o la categoría.");
        return;
    }

    const elementsToDelete = [...deletedElement, itemToDelete]
    setDeletedElement(elementsToDelete)
  
    updateLista(selectedList.id, "categories", updatedCategories)
    setListas(prevListas => prevListas.map(lista => ({
        ...lista,
        categories: lista.categories.map(category => 
          category.id === categoryItemToDelete.id 
            ? { ...category, items: updatedCategoryItems }
            : category
        )
    })));

    const updatedSelectedList = {...selectedList, categories: updatedCategories} // para enviar a undoDelete el estado local actualizado

    const handleUndo = () => {
        undoDelete(itemToDelete, categoryItemToDelete, updatedSelectedList, "item");
        clearTimeout(timeoutId);
    };

    const timeoutId = setTimeout(() => {
        toast.dismiss();
      }, 5000);
  
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
          onClick={() => { handleUndo(); toast.dismiss(t.id); }}
          style={{ marginLeft: "10px", padding: "0", backgroundColor: "#FBE7C1", border: "none", fontFamily: "poppins", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}
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
  const totalCategoriesLength = selectedList?.categories.length

  const AddCategory = (categoryName) => {
    const newCategory = { id: uuidv4(), listaId: params.id, categoryCreator: usuario.uid, categoryName, items: [], isChecked: false, isPaid: false }
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

    const filteredCategories = selectedList.categories.filter(category => category.id !== id)
    const updatedSelectedList = {...selectedList, categories: filteredCategories} // para enviar a undoDelete el estado local actualizado
    updateLista(selectedList.id, "categories", filteredCategories)
    setListas(prevListas => prevListas.map(lista => ({
        ...lista, categories: filteredCategories
        })
    ))  

    const elementsToDelete = [...deletedElement, CategoryToDelete]
    setDeletedElement(elementsToDelete)

    const handleUndo = () => {
        undoDelete(CategoryToDelete, filteredCategories, updatedSelectedList, "category"); // Envío filteredCategories porque debo enviar algo en esa posición pero no lo uso
        clearTimeout(timeoutId);
    };

    const timeoutId = setTimeout(() => {
        toast.dismiss();
      }, 5000);

    toast((t) => (
      <span style={{ display: "flex", alignItems: "center" }}>
        <span className="material-symbols-outlined" style={{ marginRight: "8px", color: "#9E9E9E" }}>warning</span>
        {`Has eliminado "${CategoryToDelete.categoryName}"`}
        <button onClick={() => { handleUndo(); toast.dismiss(t.id) }} style={{ marginLeft: "10px", padding: "0", backgroundColor: "#FBE7C1", border: "none", fontFamily: "poppins", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
          Deshacer
        </button>
      </span>
    ), {
      style: { border: "2px solid #ED9E04", backgroundColor: "#FBE7C1" },
    }
    )
  }

  const undoDelete = useCallback((itemToRestore, categoryItemToDelete, selectedList, type) => {
    if (itemToRestore) {
        if (type === "category") {
            const updatedCategories = [...selectedList.categories, itemToRestore];
            updateLista(selectedList.id, "categories", updatedCategories)
            setListas(prevListas => prevListas.map(lista =>
                lista.id === selectedList.id ? {...selectedList, categories: [...selectedList.categories, itemToRestore]} : lista
            ))
            setDeletedElement(prev => prev.filter(element => element.id !== itemToRestore.id))
        } else if (type === "item") {
            const updatedCategories = selectedList.categories.map(category => {
            if (category.id === categoryItemToDelete.id) {
                return { 
                ...category, 
                items: [...category.items, itemToRestore]
                };
            }
            return category;
            });
            updateLista(selectedList.id, "categories", updatedCategories);
            setListas(prevListas => prevListas.map(lista =>
                lista.id === selectedList.id ? {...lista, categories: lista.categories.map(category => category.id === categoryItemToDelete.id ? {...category, items: [...category.items, itemToRestore]} : category)} : lista
            ))
            setDeletedElement(prev => prev.filter(element => element.id !== itemToRestore.id))
        }
    }
  }, [setListas, updateLista]);
  
  const categoryPrice = useMemo(() => { // Recuerdo qué contenía y solo cuando cambia ejecuto
    return selectedList?.categories?.map(category => {
      const sumPrice = category.items.reduce((acc, item) => acc + Number(item.price), 0);
      return { ...category, sumPrice: sumPrice };
    });
  }, [selectedList?.categories]);

  const listPrice = useMemo(() => {
    if (!categoryPrice?.length) {
        return 0
    }
    const totalPrice = categoryPrice.reduce((total, category) => total + category.sumPrice, 0);
    const formattedTotalPrice = totalPrice?.toLocaleString("es-ES", { style: "currency", currency: "EUR" })
    return formattedTotalPrice

  }, [categoryPrice]);

  useEffect(() => {
    if (selectedList && selectedList.categories !== 0) {
        if(categoryPrice && JSON.stringify(selectedList.categories) !== JSON.stringify(categoryPrice)) { // Aplano contenido a un string para poder compararlo y solo actualizar si son distintos (puede haber update en dependencia y useMemo ejecuta, pero update de 0)
            updateLista(selectedList.id, "categories", categoryPrice);
        }
    updateLista(selectedList?.id, "listPrice", listPrice)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }}, [categoryPrice, selectedList?.categories]);
    
  const handleAddCategory = () => {
    const defaultCategoryName = "";
    AddCategory(defaultCategoryName); 
  }

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
  if(!selectedList) {
    return <LoadingPage />
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

    const totalGastoLista = selectedList?.payments?.reduce((total, payment) => {
        // Filtrar pagos que no sean "Reembolso"
        if (payment.paymentName !== "Reembolso") {
            return total + Number(payment.amount);
        }
        return total; // No acumules si no pasa el filtro
    }, 0);

    // const FilteredListPrice = filteredListaForItems?.reduce((total, item) => {
    //     return (total + Number(item.price))
    // },0) ?? 0

    // const FormattedFilteredListPrice = () => {
    //     if(filteredListaForItems !== null) {
    //         return FilteredListPrice.toLocaleString("es-ES", { style: "currency", currency: "EUR" })
    //     } else {
    //         return selectedList.listPrice
    //     }
    // }

    const FormattedFilteredListPrice = () => {
        const totalPrice = Array.isArray(filteredListaForItems) && filteredListaForItems.length > 0
            ? filteredListaForItems.reduce((total, item) => {
                const price = parseFloat(item?.price) || 0; // Asegurarse de que el precio sea un número válido
                return total + price;
            }, 0)
            : selectedList?.listPrice
    
        return totalPrice.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
    }

  return (
    <div className="lista app">
      {selectedList && (
        <>
            {showIdentifyList && (
                <IdentifyUser
                    listas={listas}
                    setListas={setListas}
                    usuario={usuario}
                    UsuarioCompleto={UsuarioCompleto}
                    updateLista={updateLista}
                    showIdentifyList={showIdentifyList}
                    setShowIdentifyList={setShowIdentifyList}
                />
            )}
          <Header
            deleteLista={() => deleteLista(params.id)}
            itemslength={totalItemsLength}
            lista={selectedList}
            handleCheckAll={handleCheckAll}
            handleUnCheckAll={handleUnCheckAll}
            UsuarioCompleto={UsuarioCompleto}
            updateLista={updateLista}
            totalGastoLista={totalGastoLista}
            isScrolled={isScrolled}
            setIsScrolled={setIsScrolled}
            price={FormattedFilteredListPrice()}
            filteredListaForItems={filteredListaForItems}
            handleArchive={handleArchive}
            handleShowVotes={handleShowVotes}
            handleShowPrices={handleShowPrices}
          />
          <Toggle 
            option1={"Lista"}
            option2={"Pagos"}
            form={"bars"}
            isToggleSelected={isToggleSelected}
            setIsToggleSelected={setIsToggleSelected}
            setSearchParams={setSearchParams}
            isScrolled={isScrolled}
            setIsScrolled={setIsScrolled}
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
                  isToggleActive={isToggleActive}
                  setIsToggleActive={setIsToggleActive}
                  setSearchParams={setSearchParams}
                  isScrolled={isScrolled}
                  setIsScrolled={setIsScrolled}        
                />
              }
              {!isEStateLista && !isToggleShown &&
                <Search
                  lista={selectedList}
                  setSearchResult={setSearchResult}            
                />
              }
              <SubHeader 
                itemslength={totalItemsLength}
                itemsAdquirido={ItemsChecked()}
                categories={selectedList.categories}
                lista={selectedList}
                price={FormattedFilteredListPrice()}
                filteredListaForItems={filteredListaForItems}
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
              {isEStateLista && (
                    <EmptyState
                    img={"_7b52f185-ed1a-44fe-909c-753d4c588278-removebg-preview"}
                    alt={"Set of grocery bags full of items"}
                    description={"Completa tu lista. Crea tu primera categoría y añade tantos items como quieras"}
                    onClick={handleAddCategory}
                    buttonCopy={"Añadir Categoría"}
                    />
              )}
              {sharePopupVisible && 
                <SharePopUp
                  setSharePopupVisible={setSharePopupVisible}
                />
              }
            </>
          ) : (
            <>
            <Toggle 
              option1={"Resumen"}
              option2={"Pagos"}
              form={"tabs"}
              origin={"Pagos"}
              lista={selectedList}
              usuario={usuario}
              isToggleActive={isToggleActive}
              setIsToggleActive={setIsToggleActive}
              setSearchParams={setSearchParams}
              isScrolled={isScrolled}
              setIsScrolled={setIsScrolled}  
            />
            {isToggleActive === "Resumen" ? (
              <Pagos
                lista={selectedList} 
                itemsLength={totalItemsLength}
                price={listPrice}
                itemsAdquirido={ItemsChecked()}
                UsuarioCompleto={UsuarioCompleto}
                updateLista={updateLista}
                totalGastoLista={totalGastoLista}
              />
            ) : (
              <PagoDeuda
              lista={selectedList} 
              UsuarioCompleto={UsuarioCompleto}
              AddPayment={AddPayment}
              />
            )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Lista