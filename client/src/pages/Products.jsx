import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Product.css";

function Products() {
  const navigate = useNavigate();

  return (
    <div className="products-layout">
      <Sidebar />

      <div className="products-content">
        <Navbar title="Products" />

        <div className="products-main" style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
          <div className="empty-state" style={{ padding: "0" }}>
            <div className="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#071074" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <line x1="17" y1="14" x2="17" y2="20" strokeWidth="3" />
                <line x1="14" y1="17" x2="20" y2="17" strokeWidth="3" />
              </svg>
            </div>

            <h2>Feels a little empty over here...</h2>

            <p>
              You can create products without connecting store{"\n"}
              you can add products to store anytime
            </p>

            <button
              className="btn-add-product"
              onClick={() => navigate("/add-product")}
            >
              Add your Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;