import vector from "../assets/Vector.svg";
import "../pages/Login.css";

function AuthLayout({ children }) {
    return (
        <div className="login-container">
            <div className="login-left">
                <p>Productr&nbsp;<img src={vector} alt="Vector" /></p>
                <div className="small-card">
                    <p>Uplist your </p>
                    <span>product to market</span>
                </div>
            </div>

            <div className="login-right">
                <div className="login-form">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
