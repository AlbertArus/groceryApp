import { useNavigate } from "react-router-dom";

const Head = ({sectionName, path, handleMenuVisibility, state, component: Component, lista, payment, deletePayment, style}) => {
    const navigate = useNavigate()
    console.log(state)

  return (
    <div className="head">
      <div className="fila-between app-margin" style={{position: "relative"}}>
        <div className="perfilHeader fila-start">
          <div className="headerArrow">
            <span className="material-symbols-outlined icon-large" onClick={() => navigate(`/${path}`)}>arrow_back</span>
          </div>
          <div className="perfilTitle">{sectionName}</div>
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
