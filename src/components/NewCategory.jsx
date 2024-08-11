

const NewCategory = () => {
  return (
    <div className="newCategory">
      <div className="itemLineCommon">
        <span class="material-symbols-outlined addIcon">add</span>
        <form className="ItemText">
          <input type="text" placeholder="Nueva categoría" className="ItemName"></input>
        </form>
      </div>
    </div>
  )
}

export default NewCategory

