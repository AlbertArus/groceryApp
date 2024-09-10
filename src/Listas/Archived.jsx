import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Archived = ({ listas, AllArchived }) => {





    return (
        <div className="archived" >
            <div className="Home app">
            <div className="header headingPhone">
                <h5 className="Archivadas">Archivadas</h5>
            </div>
                <div className="app-margin">
                    <div className="welcome" style={{ marginBottom: "12px" }}>
                        <h5>{`Tienes ${AllArchived} listas archivadas.`}</h5>
                    </div>
                </div>
                {listas && listas.map(lista => lista.isArchived === true && (
                    <div key={lista.id}>
                        <div className="vistaListas">
                            <Link to={`/list/${lista.id}`} className="linkListas">
                                <div className="fila-between">
                                    <h4>{lista.listaName}</h4>
                                    <span className="material-symbols-outlined">more_vert</span>
                                </div>
                                <div className="fila-start">
                                    <div className="fila-start-group">
                                        <span className="material-symbols-outlined icon-medium">group</span>
                                        <h5>{lista.members} pers.</h5>
                                    </div>
                                    <div className="fila-start-group">
                                        <span className="material-symbols-outlined icon-medium">{""}</span>
                                        <h5>{lista.plan}</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Archived