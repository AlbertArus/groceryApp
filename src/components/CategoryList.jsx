const CategoryList = ({ nameCategory, price, items }) => {
  return (
    <div className="categoryList">
      <div className="headerLista-firstLine">
        <div className="titleCategory">
          <h3>{nameCategory}</h3>
          <span class="material-symbols-outlined icon-xlarge">keyboard_arrow_down</span>
        </div>
        <h3>{price} €</h3>
      </div>
      <div className="subHeaderLista-secondLine">
        <h4>Items: {items}</h4>
        <span class="material-symbols-outlined">add</span>
      </div>
    </div>
  )
}

export default CategoryList