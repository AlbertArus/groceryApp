import Head from "../components/Head"
import { useParams } from "react-router-dom"

const PaymentDetail = () => {
  const {id} = useParams()

  return (
    <div className="app">
      <Head 
        path={`list/${id}`}
        sectionName={""}
      
      />
    </div>
  )
}

export default PaymentDetail
