import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"
import { ShareButton } from "./ShareButton"
import { useNavigate, useSearchParams } from "react-router-dom"

const OptionsMenuPagos = forwardRef(({ lista, payment, deletePayment, style }, ref) => {
  const [searchParams] = useSearchParams()
  console.log(lista.id)
  console.log(payment.id)
  const url = `${window.location.origin}/list/${lista.id}/${payment.id}?view=${searchParams.get("view")}`
  const listaShared = lista
  const handleShare = ShareButton(url, listaShared)
  const navigate = useNavigate()

  return (
    <div className="optionsMenu" style={style}>
      <ItemMenu
        iconName={"edit"}
        itemMenuName={"Editar gasto"}
        // onClick={() => handleVotesVisible(lista.id, lista.showVotes)}
        />
      <ItemMenu
        iconName={"share"}
        itemMenuName={"Compartir gasto"}
        onClick={handleShare}
      />
      <ItemMenu
        iconName={"delete"}
        itemMenuName={"Eliminar gasto"}
        onClick={() => {deletePayment(payment.id); navigate(`/list/${lista.id}?view=${searchParams.get("view")}`)}}
      />
    </div>
  )
})

export default OptionsMenuPagos