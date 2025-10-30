import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#464e7e",
        color: "white",
        alignItems: "center",      // 水平居中
        justifyContent: "flex-start", // 从顶部开始，可根据需要改成 center
        padding: "0",
        margin: "0",
      }}
    >
      {/* NavBar 固定在顶部 */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#464e7e",
        }}
      >
        <NavBar />
      </nav>


      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "60px",       
          width: "100%",
          maxWidth: "1600px",      
          padding: "0 16px",
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            minWidth: "200px",
            marginRight: "20px",
            position: "sticky",
            top: "60px", 
            alignSelf: "flex-start", 
          }}
        >
          <SideBar />
        </aside>

        {/* Main 内容 */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",     
            justifyContent: "flex-start",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
