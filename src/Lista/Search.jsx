import { useEffect, useRef, useState } from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

const Search = ({setSearchResult}) => {
    const [focused, setFocused] = useState(false)
    const [open, setOpen] = useState(false)
    const searchValueRef = useRef(null)

    const handleSearch = (e) => {
        const searchValue = searchValueRef.current?.value.trim()
        setSearchResult(searchValue)
    }

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

    const handleDeleteSearch = () => {
        searchValueRef.current.value = ""
        setSearchResult("")
        searchValueRef.current.focus()
    }

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
      };

    return (
        <div className="search fila-between app-margin" style={{flex:"none"}}>
            <div className="search-container fila-start" style={{width: "100%"}}>
                <input type="text" placeholder="Busca lo que quieras" onClick={handleSearch} onFocus={() => setFocused(true)} onChange={handleSearch} ref={searchValueRef}/>
                <span className="material-symbols-outlined" style={{marginLeft: "8px", display: !focused ? "flex" : "none"}} onClick={handleSearch}>search</span>
                <span className="material-symbols-outlined" style={{marginLeft: "8px", display: focused ? "flex" : "none"}} onClick={handleDeleteSearch}>close</span>
            </div>
            <div className="search-container" style={{padding: "5px 5px 0px 5px", marginLeft:"10px"}}>
                <span className="material-symbols-outlined" onClick={toggleDrawer(true)}>filter_list</span>
            </div>
            <SwipeableDrawer anchor="bottom" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)} PaperProps={{style: {borderTopLeftRadius:"20px", borderTopRightRadius:"20px"}}}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: "40px", height: "6px", backgroundColor: "#ccc", borderRadius: "2px", margin: "15px auto"}}></div>
                    <p>Filtrar opciones aquí</p>
                    <p>Filtrar opciones aquí</p>
                    <p>Filtrar opciones aquí</p>
                    <p>Filtrar opciones aquí</p>
                </div>
            </SwipeableDrawer>
        </div>
    )
}

export default Search
