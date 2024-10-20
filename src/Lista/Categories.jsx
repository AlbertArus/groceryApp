import React, {useRef} from "react"
import Category from "../components/Category"
import NewCategory from "../components/NewCategory"

const Categories = ({ items, itemsCategory, handleCheck, categories, AddCategory, EditCategory, DeleteCategory, AddItem, EditItem, DeleteItem, handleCounterDown, handleCounterUp, votesShown, isEStateLista, preciosOcultos, searchResult, setSearchResult, firstCategoryRef, handleCategoryAdded }) => {
  const ItemNameInputRefs = useRef({})

  const filteredCategories = searchResult ? categories.filter(category => category.categoryName.toLowerCase().includes(searchResult.toLowerCase()) || items.some(item => item.categoryId === category.id && item.name.toLowerCase().includes(searchResult.toLowerCase()))) : categories

  return (
    <div className="app-margin categories">
      <div className="categoriesMargin">
        {filteredCategories && filteredCategories.map(category => {
          const showAllItems = category.categoryName.toLowerCase().includes(searchResult?.toLowerCase())
          return (
            <Category
              key={category.id}
              id={category.id}
              items={showAllItems ? (items.filter(item=> item.categoryId === category.id)) : (items.filter(item => item.categoryId === category.id && item.name.toLowerCase().includes(searchResult.toLowerCase())))} // Si la categoría cumple, se muestran todos. Si no, de esa categoría (que está visible porque en filteredCategories ya valido también), muestro los que cumplen
              handleCheck={handleCheck}
              EditCategory={EditCategory}
              DeleteCategory={DeleteCategory}
              AddItem={AddItem}
              EditItem={EditItem}
              DeleteItem={DeleteItem}
              initialName={category.categoryName}
              ItemNameInputRef={ItemNameInputRefs.current[category.id] || (ItemNameInputRefs.current[category.id] = React.createRef())} // Objeto con la ref de cada categoría. Si esa (en base a id) no tiene ref, la creo con createRef y la asigno para que ahora [category.id] sí tenga valor (.current)
              itemsCategory={itemsCategory}
              categories={categories}
              handleCounterDown={handleCounterDown}
              handleCounterUp={handleCounterUp}
              votesShown={votesShown}
              preciosOcultos={preciosOcultos}
              setSearchResult={setSearchResult}
              searchResult={searchResult}
              firstCategoryRef={firstCategoryRef}
            />
          )
        })}
      </div>
      {!isEStateLista && (
        <NewCategory
          AddCategory={AddCategory}
          isEStateLista={isEStateLista}
        />
      )}
    </div>
  )
}

export default Categories