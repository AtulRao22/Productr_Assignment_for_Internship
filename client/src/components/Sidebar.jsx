import { NavLink } from "react-router-dom";
import vector from "../assets/Vector.svg";
import homeIcon from "../assets/Home.svg";
import shoppingBagIcon from "../assets/Shopping-bag.svg";
import "./Sidebar.css";

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <span>Productr</span>
                <img src={vector} alt="Logo" />
            </div>

            <div className="sidebar-search-container">
                <img
                    src="/Search.svg"
                    alt="Search"
                    className="search-icon"
                />

                <input
                    type="text"
                    placeholder="Search"
                    className="sidebar-search"
                />
            </div>

            <nav>
                <NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>
                    <span className="nav-icon"><img src={homeIcon} alt="Home" /></span> Home
                </NavLink>
                <NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>
                    <span className="nav-icon"><img src={shoppingBagIcon} alt="Products" /></span> Products
                </NavLink>
            </nav>
        </div>
    );
}

export default Sidebar;