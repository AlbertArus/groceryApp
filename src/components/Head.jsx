import { useNavigate } from "react-router-dom";

const Head = ({sectionName, path}) => {
    const navigate = useNavigate()

  return (
    <div className="head">
      <div className="perfilHeader fila-start app-margin">
        <div className="headerArrow">
          <span className="material-symbols-outlined icon-large" onClick={() => navigate(`/${path}`)}>arrow_back</span>
        </div>
        <div className="perfilTitle">{sectionName}</div>
      </div>
    </div>
  )
}

export default Head
