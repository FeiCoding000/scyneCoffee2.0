import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { Menu, MenuItem } from "react-pro-sidebar";
import BarChartIcon from "@mui/icons-material/BarChart";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ForumIcon from "@mui/icons-material/Forum";

export default function SideBar() {
  const menuItemStyles = {
    root: {
      fontSize: "16px",
      fontFamily: "Arial, sans-serif",
      "&:hover": {
        backgroundColor: "#7069d5",
        color: "#000000ff",
      },
      "&.ps-active": {
        backgroundColor: "#01051bff",
        color: "#000000ff",
      },
    },
  };
  return (
    <Box
      className="sidebar"
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        paddingLeft: "10px",
      }}
    >
      <Menu>
        <MenuItem rootStyles={menuItemStyles.root} icon={<MenuBookIcon />}>
          <Link to="/menu" style={{ textDecoration: "none", color: "inherit" }}>
            Menu
          </Link>
        </MenuItem>

        <MenuItem rootStyles={menuItemStyles.root} icon={<BarChartIcon />}>
          <Link
            to="/admin"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Admin
          </Link>
        </MenuItem>

        <MenuItem rootStyles={menuItemStyles.root} icon={<ForumIcon />}>
          <Link
            to="/orders"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Orders
          </Link>
        </MenuItem>
      </Menu>
    </Box>
  );
}
