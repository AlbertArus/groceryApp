import { useRef } from "react"

const Search = ({setSearchResult}) => {
    const searchValueRef = useRef(null)

    const handleSearch = (e) => {
        const searchValue = searchValueRef.current?.value.trim()

        setSearchResult(searchValue)
        console.log("search updated")
    }    

    return (
        <div className="search fila-between app-margin" style={{flex:"none"}}>
            <div className="search-container fila-start" style={{width: "auto"}}>
                <input type="text" placeholder="Busca lo que quieras" onChange={handleSearch} ref={searchValueRef}/>
                <span className="material-symbols-outlined" style={{marginLeft: "8px"}} onClick={handleSearch}>search</span>
            </div>
            <div className="search-container" style={{padding: "5px 5px 0px 5px"}}>
                <span className="material-symbols-outlined">filter_list</span>
            </div>
        </div>
    )
}

export default Search
