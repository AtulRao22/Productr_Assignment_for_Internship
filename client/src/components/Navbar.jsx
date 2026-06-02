import "./Navbar.css";
import ProfileIcon from "../assets/people.png";

function Navbar({ title = "Home" }) {
    return (
        <div className="navbar">
            <div className="navbar-title">
                <span className="navbar-title-icon">
                    {title === "Home" ? (
                        <img src="/home.svg" alt="Home" />
                    ) : (
                        <img
                            src="/Shopping-bag.svg"
                            alt="Products"
                        />
                    )}
                </span>                <span>{title}</span>
            </div>

            <div className="navbar-profile-container">
                <div className="navbar-avatar">
                    <img
                        src={ProfileIcon}
                        alt="Avatar"
                    />
                </div>
                <span className="navbar-arrow">▼</span>
            </div>
        </div>
    );
}

export default Navbar;