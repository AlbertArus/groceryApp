import { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import Header from './Lista/Header';
import SubHeader from './Lista/SubHeader';
import Categories from './Lista/Categories';

function App() {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const savedItems = localStorage.getItem("items")
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    } 

    setLoading(false)
  }, [])
  
  useEffect(() => {
    if(!loading) {
      localStorage.setItem("items", JSON.stringify(items))
    }
  }, [items, loading])

  const AddItem = (name, price) => {
    setItems([...items, {id: uuidv4(), name, price, isChecked: false}])
  }

  const EditItem = (id, name, price) => {
    setItems(items.map(item =>
      item.id === id ? {...item, name: name, price: price} : item
    ))
  }

  const DeleteItem = (id) => {
    setItems(items.filter(item =>
      item.id === id ? "" : item
    ))
  }
  
  const handleCheck = (id) => {
    setItems(items.map(item =>
      item.id === id ? {...item, isChecked: !item.isChecked} : item,
    ));
  };

  const ItemsChecked = () => {
    return items.filter(item => item.isChecked).length;
  };

  const ItemListLength = items.length

  return (
    <div className="app">
      <div className='app-margin'>
        <Header 
          title={"Compra Cerdanya"}
          persons={"4"}
          planIcon={"travel"}
          plan={"Trip"}
        />
        <SubHeader 
          items={ItemListLength}
          price={"44,76"}
          itemsAdquirido={ItemsChecked()}
          upNumber={"19"}
          downNumber={"6"}
        />
        <Categories
          items={items}
          handleCheck={handleCheck}
          AddItem={AddItem}
          EditItem={EditItem}
          DeleteItem={DeleteItem}
          nameCategory={"Desayuno"}
          price={"23"}
        />
      </div>
    </div>
  );
}

export default App;