import { Checkbox } from "@mui/material";
import { useRef, useState, useMemo, useEffect } from "react";

const GastosLista = ({ selectedList, amount, setAmount, setElementsPaid, elementsPaid, setFinalValuePaid }) => {

    const [isCollapsed, setIsCollapsed] = useState(
        selectedList.categories.reduce((acc, category) => {
            acc[category.id] = true;
            return acc;
        }, {})
    );
    const toggleRefs = useRef({});

    const collapseCategory = (categoryId) => {
        setIsCollapsed((prevCollapsed) => ({
            ...prevCollapsed,
            [categoryId]: !prevCollapsed[categoryId],
        }));
        toggleRefs.current[categoryId].style.transform = isCollapsed[categoryId] ? "rotate(90deg)" : "rotate(0deg)";
    };

    const selectedElements = useMemo(() => {
        return elementsPaid.reduce((acc, paid) => {
            if (!acc[paid.category]) {
                acc[paid.category] = new Set();
            }
            acc[paid.category].add(paid.item);
            return acc;
        }, {});
    }, [elementsPaid]);

    const allElementsSelected = useMemo(() => {
        return selectedList.categories.every((category) => {
            const categorySelected = selectedElements[category.id];
            return categorySelected && categorySelected.size === category.items.length;
        });
    }, [selectedList.categories, selectedElements]);

    const handleCheckboxChange = (id, type, itemId) => {
        if (type === "list") {
            // Toggle toda la lista
            setElementsPaid(
                allElementsSelected 
                ? [] 
                : selectedList.categories.flatMap((category) =>
                    category.items.map((item) => ({ 
                        category: category.id, 
                        item: item.id 
                    }))
                )
            );
        } else if (type === "category") {
            // Toggle una categoría específica
            const selectedCategory = selectedList.categories.find((category) => category.id === id);
            const categoryElements = selectedCategory.items.map((item) => ({ 
                category: selectedCategory.id, 
                item: item.id 
            }));
            
            const isCategoryFullySelected = selectedElements[id]?.size === categoryElements.length;

            setElementsPaid(
                isCategoryFullySelected
                ? elementsPaid.filter((paidElement) => paidElement.category !== id)
                : [...elementsPaid.filter((paidElement) => paidElement.category !== id), ...categoryElements]
            );
        } else if (type === "item") {
            // Toggle un item específico
            const itemElement = { category: id, item: itemId };
            const isItemSelected = selectedElements[id]?.has(itemId);

            setElementsPaid(
                isItemSelected
                ? elementsPaid.filter((paidElement) => 
                    !(paidElement.category === id && paidElement.item === itemId)
                  )
                : [...elementsPaid, itemElement]
            );
        }
    }

    // Actualizar collapsed state basado en elementos seleccionados
    useEffect(() => {
        setIsCollapsed(prev => {
            const newCollapsed = { ...prev };
            Object.entries(selectedElements).forEach(([categoryId, items]) => {
                if (items.size > 0) {
                    newCollapsed[categoryId] = false;
                }
            });
            return newCollapsed;
        });
    }, [selectedElements]);

    // Calcular el valor total y actualizar estados
    useEffect(() => {
        const totalPaid = elementsPaid.reduce((total, paidElement) => {
            const category = selectedList.categories.find((category) => category.id === paidElement.category);
            if (paidElement.item) {
                const item = category.items.find((item) => item.id === paidElement.item);
                return total + (item ? parseFloat(item.price) : 0);
            } else {
                return total + (category ? parseFloat(category.sumPrice) : 0);
            }
        }, 0);
        
        setFinalValuePaid(totalPaid.toLocaleString("es-ES", { style: "currency", currency: "EUR" }));
        if (totalPaid > 0) {
            setAmount(totalPaid); // Pongo el if porque si no se ejecuta siempre y el input de Otro gasto empieza con el mismo 0€ que tiene totalPaid 
        }
    }, [elementsPaid, selectedList.categories, setAmount, setFinalValuePaid]);

    return (
        <div style={{marginTop: "10px"}}>
            <div className="newpaymentLists fila-between">
                <div className="fila-start">
                    <Checkbox
                        checked={allElementsSelected}
                        onChange={() => handleCheckboxChange(selectedList.id, "list")}
                        sx={{
                            "&.Mui-checked": {
                                color: "green",
                            },
                            "&:not(.Mui-checked)": {
                                color: "#9E9E9E",
                            },
                            "&.Mui-checked + .MuiTouchRipple-root": {
                                backgroundColor: amount ? "green" : "transparent",
                            },
                            padding: "0px",
                            cursor: "pointer",
                        }}
                    />
                    <h4 style={{ marginLeft: "10px" }}>Toda la lista</h4>
                </div>
                <h4 className="priceMember">
                    {selectedList.listPrice.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                </h4>
            </div>
            {selectedList.categories.map((category) => {
                const isCategoryFullySelected = selectedElements[category.id]?.size === category.items.length;
                return (
                    <div key={category.id} className="newpaymentLists">
                        <div className="fila-between">
                            <div className="fila-start">
                                <Checkbox
                                    checked={isCategoryFullySelected}
                                    onChange={() => handleCheckboxChange(category.id, "category")}
                                    sx={{
                                        "&.Mui-checked": {
                                            color: "green",
                                        },
                                        "&:not(.Mui-checked)": {
                                            color: "#9E9E9E",
                                        },
                                        "&.Mui-checked + .MuiTouchRipple-root": {
                                            backgroundColor: amount ? "green" : "transparent",
                                        },
                                        padding: "0px",
                                        cursor: "pointer",
                                    }}
                                />
                                <div className="fila-start">
                                    <h4 style={{ marginLeft: "10px" }}>
                                        {category.categoryName}
                                    </h4>
                                    <span
                                        className="material-symbols-outlined icon-medium pointer"
                                        ref={(el) => (toggleRefs.current[category.id] = el)}
                                        onClick={() => collapseCategory(category.id)}
                                    >
                                        keyboard_arrow_right
                                    </span>
                                </div>
                            </div>
                            <h4 className="priceMember">
                                {category.sumPrice.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                            </h4>
                        </div>
                        <div className="columna-start" style={{ marginLeft: "32px" }}>
                            {!isCollapsed[category.id] && (
                                <>
                                    {category.items.map((item) => {
                                        const isItemSelected = selectedElements[category.id]?.has(item.id);
                                        return (
                                            <div key={item.id} className="newpaymentLists fila-between">
                                                <div className="fila-start">
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        onChange={() => handleCheckboxChange(category.id, "item", item.id)}
                                                        sx={{
                                                            "&.Mui-checked": {
                                                                color: "green",
                                                            },
                                                            "&:not(.Mui-checked)": {
                                                                color: "#9E9E9E",
                                                            },
                                                            "&.Mui-checked + .MuiTouchRipple-root": {
                                                                backgroundColor: amount ? "green" : "transparent",
                                                            },
                                                            padding: "0px",
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                    <h5 style={{ marginLeft: "10px" }}>
                                                        {item.name}
                                                    </h5>
                                                </div>
                                                <h5 className="priceMember">
                                                    {item.price.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                                                </h5>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GastosLista;