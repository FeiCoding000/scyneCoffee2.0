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
      {/* Navbar 背景全屏，内容居中 */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#464e7e",
          display: "flex",
          flexDirection:"row"
        }}
      >
        <div
          style={{
            maxWidth: "1600px",  // 内容最大宽度
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

      {/* 页面主体 */}
      <div
        style={{
          maxWidth: "1600px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          marginTop: "60px", // 给 Navbar 留空间
          padding: "0 16px",
        }}
      >
        <aside
          style={{
            minWidth: "200px",
            marginRight: "20px",
            position: "sticky",
            top: "60px",
          }}
        >
          <SideBar />
        </aside>

        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
