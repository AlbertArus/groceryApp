import React from 'react'
import Head from '../components/Head'

const Pagos = ({lista, itemsLength}) => {
  return (
    <div className='app'>
      {/* <Head 
        // path={`list/:${lista.id}`}
        sectionName={"Pagos"}
      />
    <div className="app-margin">
        <div className="welcome" style={{ marginBottom: "12px" }}>
            <h2 style={{fontWeight: "500"}}>{`Resumen de ${lista.nombre}!`}</h2>
            <h5>{itemsLength === 1 ? "Tienes 1 item" : `Tienes ${itemsLength} items`}</h5>
        </div>
    </div> */}
    {/* {isEStateHome && 
        <div className="emptyState">
            <EStateHome 
                addLista={addLista}
            />
        </div>
    }
    {!isEStateHome && (
        <ToggleLista
            usuario={usuario}
            listas={listas}
            setFilteredListas={setFilteredListas}
        />
    )}       */}
    </div>
  )
}

export default Pagos
