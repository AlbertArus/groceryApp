import { useNavigate } from "react-router-dom";

const Head = ({sectionName, path, handleMenuVisibility, state, component: Component, lista, payment, deletePayment, style}) => {
    const navigate = useNavigate()

  return (
    <div className="head">
        <div className="fila-between app-margin" style={{position: "relative", padding: "4px 0px"}}>
            <div className="fila-start">
                <span className="material-symbols-outlined icon-large" style={{marginRight: "18px", marginLeft: "-3.5px"}} onClick={() => navigate(`/${path}`)}>arrow_back</span>
                <h3>{sectionName}</h3>
            </div>
            {state !== undefined && (
            <span className="material-symbols-outlined icon-large" onClick={handleMenuVisibility}>more_vert</span>
            )}
            {state && Component && <Component lista={lista} payment={payment} style={style} deletePayment={deletePayment}/> }
        </div>
    </div>
  )
}

export default Head
