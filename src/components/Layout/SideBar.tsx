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
        <MenuItem rootStyles={menuItemStyles.root} icon={<MenuBookIcon />} component={<Link to = "/menu"/>}>
          Menu
        </MenuItem>

        <MenuItem rootStyles={menuItemStyles.root} icon={<BarChartIcon />} component={<Link to = "/admin"/>}>
        Admin
        </MenuItem>

        <MenuItem rootStyles={menuItemStyles.root} icon={<ForumIcon />} component={ <Link to = "/orders" />}>
        Orders
        </MenuItem>

        <MenuItem rootStyles={menuItemStyles.root} icon={<ForumIcon />} component={ <Link to = "/statistic" />}>
        Statistic
        </MenuItem>
      </Menu>
    </Box>
  );
}
