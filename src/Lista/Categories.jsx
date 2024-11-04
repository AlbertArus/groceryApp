import React, { useRef } from "react";
import Category from "../components/Category";
import NewCategory from "../components/NewCategory";

const Categories = ({
  items,
  itemsCategory,
  handleCheck,
  categories,
  AddCategory,
  EditCategory,
  DeleteCategory,
  AddItem,
  EditItem,
  DeleteItem,
  handleCounterDown,
  handleCounterUp,
  isEStateLista,
  lista,
  searchResult,
  setSearchResult,
  firstCategoryRef,
  UsuarioCompleto,
  filteredListaForItems,
  handleDeleteItemUserMember
}) => {
  const ItemNameInputRefs = useRef({});

  // Filtra categorías según búsqueda y toggle
  const filteredCategories = categories.filter((category) => {
    const categoryNameMatchesSearch = searchResult
      ? category.categoryName.toLowerCase().includes(searchResult.toLowerCase())
      : true;

    const categoryItems = items.filter((item) => item.categoryId === category.id);

    const filteredItemsBySearch = searchResult
      ? categoryItems.filter((item) =>
          item.name.toLowerCase().includes(searchResult.toLowerCase())
        )
      : categoryItems;

    const finalFilteredItems = filteredListaForItems
      ? filteredItemsBySearch.filter((item) =>
          filteredListaForItems.some(
            (filteredItem) => filteredItem.id === item.id
          )
        )
      : filteredItemsBySearch;

    // Mostrar la categoría solo si tiene ítems después del filtrado
    return finalFilteredItems.length > 0 || categoryNameMatchesSearch;
  });

  return (
    <div className="categories">
      <div className="categoriesMargin">
        {filteredCategories.map((category) => {
          const categoryItems = items.filter((item) => item.categoryId === category.id);

          const filteredItemsBySearch = searchResult
            ? categoryItems.filter((item) =>
                item.name.toLowerCase().includes(searchResult.toLowerCase())
              )
            : categoryItems;

          const finalFilteredItems = filteredListaForItems
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
              items={finalFilteredItems} // Items filtrados correctamente
              handleCheck={handleCheck}
              EditCategory={EditCategory}
              DeleteCategory={DeleteCategory}
              AddItem={AddItem}
              EditItem={EditItem}
              DeleteItem={DeleteItem}
              initialName={category.categoryName}
              ItemNameInputRef={
                ItemNameInputRefs.current[category.id] ||
                (ItemNameInputRefs.current[category.id] = React.createRef())
              }
              itemsCategory={itemsCategory}
              categories={categories}
              handleCounterDown={handleCounterDown}
              handleCounterUp={handleCounterUp}
              lista={lista}
              setSearchResult={setSearchResult}
              searchResult={searchResult}
              firstCategoryRef={firstCategoryRef}
              UsuarioCompleto={UsuarioCompleto}
              handleDeleteItemUserMember={handleDeleteItemUserMember}
            />
          );
        })}
      </div>
      {!isEStateLista && (
        <NewCategory 
          AddCategory={AddCategory}
          isEStateLista={isEStateLista}
        />
      )}
    </div>
  );
};

export default Categories;
