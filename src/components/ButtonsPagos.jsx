import { useState } from 'react'
import Button from '../ui-components/Button'
import { useNavigate } from 'react-router-dom'

const ButtonsPagos = ({lista, handleArchive, deleteLista}) => {
    const [inactive, setInactive] = useState(false)
    const navigate = useNavigate()
  return (
    <div className="button-main-fixed">
        <div className="fila-between">
            <Button
                buttonCopy={"Archivar lista"}
                onClick={() => {handleArchive(lista); navigate("/"); setInactive(true)}}
                style={{width: "100%", marginRight: "7.5px"}}
            />
            <Button
                buttonCopy={"Eliminar lista"}
                onClick={() => {deleteLista(lista.id); setInactive(true)}}
                style={{width: "100%", marginLeft: "7.5px"}}
            />
        </div>
    </div>
  )
}

export default ButtonsPagos
