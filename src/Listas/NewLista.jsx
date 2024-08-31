
const NewLista = ({addLista}) => {

    const handleAddition = () => {
        addLista()
    }

    return (
        <div className="NewLista">
            <button className="addingLista">
                <span className="material-symbols-outlined addIcon" onClick={handleAddition}>add</span>
            </button>
        </div>
    )
}

export default NewLista