import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
export default function Layout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#464e7e",
        color: "white",
      }}
    >
      <nav 
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          height:"40px",
          zIndex: 1000,
          backgroundColor: "#464e7e",
          display: "flex",
          flexDirection:"row"
        }}
      >
        <div
          style={{
            maxWidth: "1600px",  
            width: "100%",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
          }}
        >
          <NavBar />
        </div>
      </nav>

      <div
        style={{
          maxWidth: "1600px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          marginTop: "60px", 
          padding: "0 16px",
          position: "relative"
        }}
      >
        <aside className="layout-aside"
          style={{
            position: "fixed",
            top: "40px",
            height:"100%",
            marginLeft:"-20px"
          }}
        >
          <SideBar />
        </aside>

        <main style={{ flex: 1, marginLeft:"160px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
