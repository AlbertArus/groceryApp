import { useEffect, useRef, useState } from "react"
// import ModalSheet from "../ui-components/ModalSheet";
// import TabItemMenu from "../components/TabItemMenu";

const Search = ({setSearchResult }) => {
    const [focused, setFocused] = useState(false)
    // const [open, setOpen] = useState(false)
    // const [open, setOpen] = useState(false)
    const searchValueRef = useRef(null)

    useEffect(() => {
        const handleSearchFocus = (event) => {
            if(searchValueRef.current && !searchValueRef.current.contains(event.target)) {
                setFocused(false)
            }
        }

        document.addEventListener("click", handleSearchFocus)
        return () => {
            document.removeEventListener("click", handleSearchFocus)
        }
    },[])

    const handleSearch = (e) => {
        const searchValue = searchValueRef.current?.value.trim()
        setSearchResult(searchValue)
    }

    const handleDeleteSearch = () => {
        searchValueRef.current.value = ""
        setSearchResult("")
        searchValueRef.current.focus()
    }

    return (
        <div className="search fila-between">
            <div className="search fila-between">
                <div className="search-container fila-start" style={{width: "100%"}}>
                    <input type="text" placeholder="Busca lo que quieras" onClick={handleSearch} onFocus={() => setFocused(true)} onChange={handleSearch} ref={searchValueRef}/>
                    <span className="material-symbols-outlined" style={{marginLeft: "8px", display: !focused ? "flex" : "none"}} onClick={handleSearch}>search</span>
                    <span className="material-symbols-outlined" style={{marginLeft: "8px", display: focused ? "flex" : "none"}} onClick={handleDeleteSearch}>close</span>
                </div>
                {/* <div className="search-container" style={{padding: "5px 5px 0px 5px", marginLeft:"10px"}}>
                    <span className="material-symbols-outlined" onClick={() => setOpen(true)}>filter_list</span>
                </div>
                <ModalSheet 
                    open={open}
                    setOpen={setOpen}
                >
                    <TabItemMenu 
                        itemMenuName={"No hay filtros disponibles"}
                    />
                </ModalSheet> */}
            </div>
        </div>
    )
}

export default Search
