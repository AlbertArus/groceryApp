import { Checkbox } from "@mui/material";
import { useRef, useState } from "react";

const GastosLista = ({selectedList, amount,}) => {
    const [isCollapsed, setIsCollapsed] = useState( 
        selectedList.categories.reduce((acc, category) => { //Permite iniciar en true. Marca true por cada id manteniendo que es un objeto. Reduce porque añade valor de cada id al objeto
            acc[category.id] = true
            return acc
        }, {})
    )
    const toggleRefs = useRef({})

    const collapseCategory = (categoryId) => {
        setIsCollapsed((prevCollapsed) => ({
            ...prevCollapsed,
            [categoryId]: !prevCollapsed[categoryId], // Alterna el estado específico de la categoría
        }));
        toggleRefs.current[categoryId].style.transform = isCollapsed[categoryId] ? "rotate(270deg)" : "rotate(0deg)";
    };
    
    console.log(selectedList)

    return (
        <div style={{paddingTop: "20px"}}>
            <div className="newpaymentLists fila-between">
                <div className="fila-start">
                    <Checkbox 
                    checked
                    // onChange={() => {handleCheckboxChange(uid); setErrors(prevErrors => ({...prevErrors, members: false}))}}
                    sx={{
                    '&.Mui-checked': {
                        color: "green"
                    },
                    '&:not(.Mui-checked)': {
                        color: "#9E9E9E"
                    },
                    '&.Mui-checked + .MuiTouchRipple-root': {
                        backgroundColor: amount ? 'green' : 'transparent'
                    },
                    padding: "0px",
                    cursor:"pointer"
                    }}
                    />           
                    <div className="participantsName" style={{marginLeft: "10px"}}>Toda la lista</div>
                </div>
                <h4 className="priceMember" style={{color: amount.trim() === "" ? "grey" : "black"}}>{selectedList.listaName} €</h4>
            </div>
            {selectedList.categories.map(category => {
                return (
                    <div key={category.id} className="newpaymentLists">
                        <div className="fila-between">
                            <div className="fila-start">
                                <Checkbox 
                                checked
                                // onChange={() => {handleCheckboxChange(uid); setErrors(prevErrors => ({...prevErrors, members: false}))}}
                                sx={{
                                    '&.Mui-checked': {
                                    color: "green"
                                },
                                '&:not(.Mui-checked)': {
                                    color: "#9E9E9E"
                                },
                                '&.Mui-checked + .MuiTouchRipple-root': {
                                    backgroundColor: amount ? 'green' : 'transparent'
                                },
                                padding: "0px",
                                cursor:"pointer"
                                }}
                                />
                                <div className="fila-start">
                                    <h4 className="participantsName" style={{marginLeft: "10px"}}>{category.categoryName}</h4>
                                    <span className="material-symbols-outlined icon-large pointer" ref={el => toggleRefs.current[category.id] = el} onClick={() => collapseCategory(category.id)} >keyboard_arrow_down</span>
                                </div>
                            </div>
                            <h4 className="priceMember" style={{color: amount.trim() === "" ? "grey" : "black"}}>{selectedList.listaName} €</h4>
                        </div>
                        <div className="columna-start" style={{marginLeft: "32px"}}>
                            {!isCollapsed[category.id] && (
                                <>
                                {category.items.map(item => {
                                    return (
                                        <div key={item.id} className="newpaymentLists fila-between">
                                            <div className="fila-start">
                                                <Checkbox 
                                                checked
                                                // onChange={() => {handleCheckboxChange(uid); setErrors(prevErrors => ({...prevErrors, members: false}))}}
                                                sx={{
                                                '&.Mui-checked': {
                                                    color: "green"
                                                },
                                                '&:not(.Mui-checked)': {
                                                    color: "#9E9E9E"
                                                },
                                                '&.Mui-checked + .MuiTouchRipple-root': {
                                                    backgroundColor: amount ? 'green' : 'transparent'
                                                },
                                                padding: "0px",
                                                cursor:"pointer"
                                                }}
                                                />
                                                <h5 className="participantsName" style={{marginLeft: "10px"}}>{item.name}</h5>
                                            </div>
                                            <h5 className="priceMember" style={{color: amount.trim() === "" ? "grey" : "black"}}>{item.price} €</h5>
                                        </div>
                                        
                                    )
                                })}
                                </>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default GastosLista
