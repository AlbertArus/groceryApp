import { forwardRef, useEffect, useState } from "react"
import TabItemMenu from "./TabItemMenu";

const MenuTabs = forwardRef(({item, UsuarioCompleto, handleDeleteItemUserMember, style, isActive, setIsActive }, ref) => {
    const [nombreItemUserMember, setNombreItemUserMember] = useState([]);
    const [nombreCounterUp, setNombreCounterUp] = useState([]);
    const [nombreCounterDown, setNombreCounterDown] = useState([]);
    const tabValues = ["A favor", "En contra", "Miembros"];
    const activeIndex = tabValues.indexOf(isActive);

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
        <div className="tabs">
            <md-tabs style={{backgroundColor: "none"}}
                active-tab-index={activeIndex}
                onClick={(e) => {
                console.log('Click event:', e);
                const tabElement = e.target.closest('md-primary-tab');
                if (tabElement) {
                const tabs = Array.from(e.currentTarget.children);
                const index = tabs.indexOf(tabElement);
                console.log('Tab index:', index);
                const tabValues = ["A favor", "En contra", "Miembros"];
                setIsActive(tabValues[index]);
                }
            }}>
                <md-primary-tab inline-icon aria-label="A favor">
                    <span className="material-symbols-outlined icon-large" style={{color: "blue"}}>thumb_up</span>
                    {/* A favor */}
                </md-primary-tab>
                <md-primary-tab inline-icon aria-label="En contra">
                    <span className="material-symbols-outlined icon-large" style={{color: "red"}}>thumb_down</span>            
                    {/* En contra */}
                </md-primary-tab>
                <md-primary-tab inline-icon aria-label="Miembros">
                    <span className="material-symbols-outlined icon-large">group</span>
                    {/* Miembros */}
                </md-primary-tab>
            </md-tabs>
        </div>
        <div className="app-margin">
        {isActive === "A favor" && (
          <>
            {item.counterUp.map((uid, index) => (
              <TabItemMenu
                key={uid}
                iconName="account_circle"
                itemMenuName={nombreCounterUp[index]}
              />
            ))}
          </>
        )}
        {isActive === "En contra" && (
          <>
            {item.counterDown.map((uid, index) => (
              <TabItemMenu
                key={uid}
                iconName="account_circle"
                itemMenuName={nombreCounterDown[index]}
              />
            ))}
          </>
        )}
        {isActive === "Miembros" && (
          <>
            {item.itemUserMember.map((uid, index) => (
              <TabItemMenu
                key={uid}
                iconName="account_circle"
                itemMenuName={nombreItemUserMember[index]}
                handleDeleteItemUserMember={() => handleDeleteItemUserMember(item.id, uid)}
              />
            ))}
          </>
        )}        
        </div>
    </div>
  )
})

export default MenuTabs
