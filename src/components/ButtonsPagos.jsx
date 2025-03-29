import Button from '../ui-components/Button'
import { useNavigate } from 'react-router-dom'

const ButtonsPagos = ({lista, handleArchive, deleteLista}) => {
    const navigate = useNavigate()
  return (
    <div className="button-main-fixed">
        <div className="fila-between">
            <Button
                buttonCopy={"Archivar lista"}
                onClick={() => {handleArchive(lista); navigate("/")}}
                style={{width: "100%"}}
            />
            <Button
                buttonCopy={"Eliminar lista"}
                onClick={() => deleteLista(lista.id)}
                style={{width: "100%"}}
            />
        </div>
    </div>
  )
}

export default ButtonsPagos
