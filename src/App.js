import './App.css';
import HeadingPhone from './components/HeadingPhone';
import Header from './Lista/Header';
import SubHeader from './Lista/SubHeader';
import FullList from './Lista/FullList';
import NewList from './Lista/NewList';

function App() {
  return (
    <div className="app">
      <HeadingPhone />
      <div className='app-margin'>
        <Header 
          title={"Compra Cerdanya"}
          persons={"4"}
          planIcon={"travel"}
          plan={"Trip"}
        />
        <SubHeader 
          items={"44"}
          price={"44,76"}
          itemsAdquirido={"23"}
          upNumber={"19"}
          downNumber={"6"}
        />
        <FullList />
        <NewList />
      </div>
    </div>
  );
}

export default App;
