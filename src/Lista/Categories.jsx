import React, {useRef} from "react"
import Category from "../components/Category"
import NewCategory from "../components/NewCategory"

const Categories = ({ items, itemsCategory, handleCheck, categories, AddCategory, EditCategory, DeleteCategory, AddItem, EditItem, DeleteItem, handleCounterDown, handleCounterUp, votesShown, isEStateLista, preciosOcultos, searchResult, setSearchResult, firstCategoryRef, UsuarioCompleto, filteredListaForItems, handleDeleteItemUserMember }) => {
  const ItemNameInputRefs = useRef({})

  const filteredCategories = categories.filter((category) => {
    const categoryMatchesSearch =
      category.categoryName.toLowerCase().includes(searchResult?.toLowerCase());

    const filteredItemsBySearch = items.filter(
      (item) =>
        item.categoryId === category.id &&
        (categoryMatchesSearch ||
          item.name.toLowerCase().includes(searchResult?.toLowerCase()))
    );

    // Aplicamos filtro de 'Mis items' si está habilitado
    const filteredItems = filteredListaForItems
      ? filteredItemsBySearch.filter((item) =>
          filteredListaForItems.some(
            (filteredItem) => filteredItem.id === item.id
          )
        )
      : filteredItemsBySearch;

    // Mostrar la categoría solo si hay ítems después del filtrado
    return searchResult || filteredListaForItems
      ? filteredItems.length > 0
      : true; // Mostrar todas las categorías si no hay filtros activos
  });
  
  return (
    <div className="app-margin categories">
      <div className="categoriesMargin">
      {/* Solo entran las categorías que cumplan mínimo una condición (search o Mis items) y ahora definimos qué items mostrar */}
      {filteredCategories.map((category) => {
          // Filtrar los items que deben mostrarse dentro de la categoría
          const filteredItemsBySearch = items.filter(
            (item) =>
              item.categoryId === category.id &&
              (category.categoryName
                .toLowerCase()
                .includes(searchResult?.toLowerCase()) ||
                item.name.toLowerCase().includes(searchResult?.toLowerCase()))
          );

          const filteredItems = filteredListaForItems
            ? filteredItemsBySearch.filter((item) =>
                filteredListaForItems.some(
                  (filteredItem) => filteredItem.id === item.id
                )
              )
            : filteredItemsBySearch;
            return (
            <Category
              key={category.id}
              id={category.id}
              items={filteredItems} // Si la categoría cumple, se muestran todos. Si no, de esa categoría (que está visible porque en filteredCategories ya valido también), muestro los que cumplen
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
              UsuarioCompleto={UsuarioCompleto}
              handleDeleteItemUserMember={handleDeleteItemUserMember}
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