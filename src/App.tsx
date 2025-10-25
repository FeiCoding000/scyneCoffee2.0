import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout/Layout";
import OrderPage from "./pages/OrderPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import MenuPage from "./pages/MenuPage";
import './index.css';

function App() {
    return (
        <Router basename="/scyneCoffee2.0">
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/orders" element={ <OrderPage/>} />
                    <Route path="/admin" element={ <AdminPage/>} />
                    <Route path="/menu" element={ <MenuPage/>} />
                </Route>

                <Route path="/" element={<HomePage/>} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Router>



    );
}

export default App;
