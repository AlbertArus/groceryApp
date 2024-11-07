import { useEffect, useRef, useState } from "react"
import TabItemMenu from "./TabItemMenu";

const MenuTabs = ({item, UsuarioCompleto, handleDeleteItemUserMember, style, isActive, setIsActive }) => {
    const [nombreItemUserMember, setNombreItemUserMember] = useState([]);
    const [nombreCounterUp, setNombreCounterUp] = useState([]);
    const [nombreCounterDown, setNombreCounterDown] = useState([]);
    const tabValues = ["A favor", "En contra", "Miembros"];
    const activeIndex = tabValues.indexOf(isActive);  
    const [contentHeight, setContentHeight] = useState(0);
    const counterUpRef = useRef(null);
    const counterDownRef = useRef(null);
    const itemUserMemberRef = useRef(null);

    useEffect(() => {
      // Actualiza la altura del contenido basado en isActive
      if (isActive === "A favor" && counterUpRef.current) {
        setContentHeight(counterUpRef.current.offsetHeight);
      } else if (isActive === "En contra" && counterDownRef.current) {
        setContentHeight(counterDownRef.current.offsetHeight);
      } else if (isActive === "Miembros" && itemUserMemberRef.current) {
        setContentHeight(itemUserMemberRef.current.offsetHeight);
      }
    }, [isActive]);

    useEffect(() => {
        const fetchItemUserMembers = async () => {
            const names = await Promise.all( // Uso promesa para hacerlo paralelo por cada uid y solo sigue cuando acaban todas
                item.itemUserMember.map(uid => UsuarioCompleto(uid))
            );
            setNombreItemUserMember(names)
        };

        if (item.itemUserMember.length > 0) {
            fetchItemUserMembers()
        }
    }, [item.itemUserMember, UsuarioCompleto]);

    useEffect(() => {
        const fetchItemCounterUp = async () => {
            const names = await Promise.all( // Uso promesa para hacerlo paralelo por cada uid y solo sigue cuando acaban todas
                item.counterUp.map(uid => UsuarioCompleto(uid))
            );
            setNombreCounterUp(names)
        };

        if (item.counterUp.length > 0) {
            fetchItemCounterUp()
        }
    }, [item.counterUp, UsuarioCompleto]);

    useEffect(() => {
        const fetchItemCounterDown = async () => {
            const names = await Promise.all( // Uso promesa para hacerlo paralelo por cada uid y solo sigue cuando acaban todas
                item.counterDown.map(uid => UsuarioCompleto(uid))
            );
            setNombreCounterDown(names)
        };

        if (item.counterDown.length > 0) {
            fetchItemCounterDown()
        }
    }, [item.counterDown, UsuarioCompleto]);

    useEffect(() => {
        const tabsElement = document.querySelector('md-tabs');
        if (tabsElement) {
          const tabValues = ["A favor", "En contra", "Miembros"];
          const activeIndex = tabValues.indexOf(isActive);
          if (activeIndex !== -1) {
            tabsElement.activeTabIndex = activeIndex;
          }
        }
      }, [isActive]);      

  return (
    <div>
        <div className="tabs" style={{alignSelf: "flex-start"}}>
            <md-tabs
            style={{ margin: "0 15px", alignSelf: "flex-start"}}
                
                active-tab-index={activeIndex}
                onClick={(e) => {
                const tabElement = e.target.closest('md-primary-tab, md-secondary-tab');
                if (tabElement) {
                const tabs = Array.from(e.currentTarget.children);
                const index = tabs.indexOf(tabElement);
                const tabValues = ["A favor", "En contra", "Miembros"];
                setIsActive(tabValues[index]);
                }
            }}>
                <md-secondary-tab inline-icon aria-label="A favor">
                    <span className="material-symbols-outlined icon-medium" style={{color: "blue"}}>thumb_up</span>
                    {/* A favor */}
                </md-secondary-tab>
                <md-primary-tab inline-icon aria-label="En contra">
                    <span className="material-symbols-outlined icon-medium" style={{color: "red"}}>thumb_down</span>            
                    {/* En contra */}
                </md-primary-tab>
                <md-primary-tab inline-icon aria-label="Miembros">
                    <span className="material-symbols-outlined icon-medium" style={{color: "black"}}>group</span>
                    {/* Miembros */}
                </md-primary-tab>
            </md-tabs>
        </div>
        <div className="app-margin" style={{minHeight: "40px", marginBottom: contentHeight > 40 ? "20px" : "0px"}}>
        {isActive === "A favor" && (
          <>
          <div ref={counterUpRef}>
            {item.counterUp.map((uid, index) => (
              <TabItemMenu
                key={uid}
                iconName="account_circle"
                itemMenuName={nombreCounterUp[index]}
              />
            ))}
          </div>
          </>
        )}
        {isActive === "En contra" && (
          <>
          <div ref={counterDownRef}>
            {item.counterDown.map((uid, index) => (
              <TabItemMenu
                key={uid}
                iconName="account_circle"
                itemMenuName={nombreCounterDown[index]}
              />
            ))}
          </div>
          </>
        )}
        {isActive === "Miembros" && (
          <>
          <div ref={itemUserMemberRef}>
            {item.itemUserMember.map((uid, index) => (
              <TabItemMenu
                key={uid}
                iconName="account_circle"
                itemMenuName={nombreItemUserMember[index]}
                handleDeleteItemUserMember={() => handleDeleteItemUserMember(item.id, uid)}
              />
            ))}
          </div>
          </>
        )}        
        </div>
    </div>
  )
}

export default MenuTabs
