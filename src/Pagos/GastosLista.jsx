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
        return elementsPaid.reduce((total, elementPaid) => {
            if (!total[elementPaid.category]) { // Revisa si la categoría del elementPaid aún no está en el total
                total[elementPaid.category] = new Set(); // Lo añade al set, que es un grupo de valores únicos
            }
            total[elementPaid.category].add(elementPaid.item);
            return total;
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
            const filteredItems = selectedList.categories.flatMap((category) =>
                category.items
                    .filter((item) => item.payer === "" && !item.isPaid)
                    .map((item) => ({
                        category: category.id,
                        item: item.id,
                    }))
            );
    
            setElementsPaid(allElementsSelected ? [] : filteredItems);
        } else if (type === "category") {
            const selectedCategory = selectedList.categories.find((category) => category.id === id);
        
            const filteredCategoryElements = selectedCategory.items
                .filter((item) => item.payer === "" && !item.isPaid)
                .map((item) => ({
                    category: selectedCategory.id,
                    item: item.id,
                }));
        
            const isCategoryFullySelected = selectedElements[id]?.size === filteredCategoryElements.length; //Si los seleccionados (selectedElements) son iguales a los seleccionables (cumplen las condiciones de no haber sido pagados), toda la categoría está seleccionada
        
            setElementsPaid(
                isCategoryFullySelected
                    ? elementsPaid.filter((paidElement) => paidElement.category !== id)
                    : [...elementsPaid.filter((paidElement) => paidElement.category !== id), ...filteredCategoryElements]
            );
        } else if (type === "item") {
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

    useEffect(() => {
        const totalToPay = elementsPaid.reduce((total, paidElement) => {
            const category = selectedList.categories.find((category) => category.id === paidElement.category);
            if (paidElement.item) {
                const item = category.items.find((item) => item.id === paidElement.item);
                return total + (item ? parseFloat(item.price) : 0);
            } else {
                return total + (category ? parseFloat(category.sumPrice) : 0);
            }
        }, 0);
        
        setFinalValuePaid(totalToPay.toLocaleString("es-ES", { style: "currency", currency: "EUR" }));
        if (totalToPay > 0) {
            setAmount(totalToPay); // Pongo el if porque si no se ejecuta siempre y el input de Otro gasto empieza con el mismo 0€ que tiene totalPaid 
        }
    }, [elementsPaid, selectedList.categories, setAmount, setFinalValuePaid]);

    const totalPaidCategory = selectedList.categories.map(category => {
        const itemsPaidCategory = category.items.filter(item => item.payer !== "" && item.isPaid)
        const priceItemsPaidCategory = itemsPaidCategory.reduce((total, item) => {
            return total + Number(item.price || 0)
        },0)
        return priceItemsPaidCategory
    })

    const totalPaid = totalPaidCategory.reduce((total, category) => total + category,0)

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
                    {(selectedList?.listPrice - totalPaid)}
                </h4>
            </div>
            {selectedList.categories.map((category, index) => {
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
                                {(category.sumPrice - totalPaidCategory[index]).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
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
                                                    {item.payer === "" ? (
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={() => handleCheckboxChange(category.id, "item", item.id)}
                                                            // disabled={item.payer !== "" ? true : false}
                                                            sx={{
                                                                "&.Mui-checked": {
                                                                    color: "green"
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
                                                        ) : (
                                                            <Checkbox
                                                            checked={true}
                                                            disabled={true}
                                                            // onChange={() => handleCheckboxChange(category.id, "item", item.id)}
                                                            sx={{
                                                                "&.Mui-checked": {
                                                                    color: "grey",
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
                                                        )
                                                    }
                                                    
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