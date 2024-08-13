import { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import Header from './Lista/Header';
import SubHeader from './Lista/SubHeader';
import Categories from './Lista/Categories';

function App() {

  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  
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

  useEffect(() => {
    if(!loading)
    console.log("Items:", localStorage.getItem("items"));
    console.log("Categories:", localStorage.getItem("categories"));
  }, [items, categories, loading])

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
    setCategories(categories.filter(category =>
      category.id !== id
    ))
    setItems(items.filter(item =>
      item.categoryId !== id
    ))
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

  console.log(items)

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
          items={totalItemsLength}
          price={totalPrice}
          itemsAdquirido={ItemsChecked()}
          upNumber={"19"}
          downNumber={"6"}
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
        />
      </div>
    </div>
  );
}

export default App;