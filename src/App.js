import { useState, useEffect } from 'react';
import './App.css';
import Header from './Lista/Header';
import SubHeader from './Lista/SubHeader';
import ItemList from './components/ItemList';

function App() {

  const [items, setItems] = useState([])

  
  useEffect(() => {
    const savedItems = localStorage.getItem("items")
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items))
  }, [items])
  
  console.log(localStorage.getItem("items"))

  const AddItem = (name, price) => {
    setItems([...items, {id: items.length + 1, name, price, isChecked: false}])
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
        <ItemList 
          items={items}
          handleCheck={handleCheck}
          AddItem={AddItem}
        />
      </div>
    </div>
  );
}

export default App;
