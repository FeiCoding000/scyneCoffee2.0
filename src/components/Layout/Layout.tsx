import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app-layout" style={{ 
      display: "flex", 
      flexDirection: "column", 
      padding: "0", 
      margin: "0",
      minHeight: "100vh",
      backgroundColor: "#464e7e",
      color: "white",
      width: "100%",
    }}>
      <nav style={{ 
        position: "fixed", 
        top: "0px", 
        width: "100%", 
        zIndex: 1000, 
        backgroundColor: "inherit" 
      }}>
        <NavBar />
      </nav>

      <div className="app-main-content" style={{
        marginTop: "50px",    
        display: "flex",
        flexDirection: "row",
        flex: 1             
      }}>
        <aside style={{
          position: "fixed", 
          top: "50px",      
          left: "0",        
          width: "auto",
        }}>
          <SideBar />
        </aside>
        <main style={{ 
          marginLeft: "100px", 
          width: "100%", 
          padding: "0 5%" 
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}