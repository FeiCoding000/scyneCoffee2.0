import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { Menu, MenuItem } from "react-pro-sidebar";
import BarChartIcon from "@mui/icons-material/BarChart";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BugReportIcon from '@mui/icons-material/BugReport';
import QueueList from "../QueueList";


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
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingLeft: "10px",
        marginTop:"30px",
      }}
    >
      <Menu>
        <MenuItem rootStyles={menuItemStyles.root} icon={<MenuBookIcon />} component={<Link to = "/menu"/>}>
          Menu
        </MenuItem>

        <MenuItem rootStyles={menuItemStyles.root} icon={<AdminPanelSettingsIcon />} component={<Link to = "/admin"/>}>
        Admin
        </MenuItem>

        <MenuItem rootStyles={menuItemStyles.root} icon={<ReceiptLongIcon />} component={ <Link to = "/orders" />}>
        Orders
        </MenuItem>

        <MenuItem rootStyles={menuItemStyles.root} icon={<BarChartIcon />} component={ <Link to = "/statistic" />}>
        Statistic
        </MenuItem>

        <MenuItem rootStyles={menuItemStyles.root} icon={<BarChartIcon />} component={ <Link to = "/news" />}>
        News
        </MenuItem>

        <MenuItem rootStyles={menuItemStyles.root} icon={<BugReportIcon />} component={ <Link to = "/bugreport" />}>
        Report
        </MenuItem>
      </Menu>
      <Box style={{ padding: "10px", marginBottom: "160px", backgroundColor: "#f0f0f0", borderRadius: "8px", color: "black" }}>
        <QueueList />
      </Box>
    </Box>
  );
} 

