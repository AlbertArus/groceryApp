import SwipeableDrawer from "@mui/material/SwipeableDrawer";

const ModalSheet = ({open, setOpen, children}) => {

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
      };

    return (
        <SwipeableDrawer anchor="bottom" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)} PaperProps={{style: {borderTopLeftRadius:"20px", borderTopRightRadius:"20px"}}}>
            <div style={{ textAlign: "center" }}>
                <div style={{ width: "40px", height: "6px", backgroundColor: "#ccc", borderRadius: "2px", margin: "15px auto"}}></div>
                <div >
                    {children}
                </div>
            </div>
        </SwipeableDrawer>        
    )
}

export default ModalSheet
