import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Product.css";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch all products (no status filter) for the main Products page
      const res = await API.get("/products");
      setProducts(res.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "published" ? "unpublished" : "published";
      await API.put(`/products/${id}`, { status: newStatus });
      fetchProducts();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="products-layout">
      <Sidebar />

      <div className="products-content">
        <Navbar title="Products" />

        <div className="products-main">
          {loading && <h3 className="loading-text">Loading products...</h3>}

          {!loading && products.length === 0 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
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
          )}

          {!loading && products.length > 0 && (
            <>
              <div className="products-header-row">
                <h1 className="products-header-title">Products</h1>
                <button 
                  className="btn-header-add"
                  onClick={() => navigate("/add-product")}
                >
                  + Add Products
                </button>
              </div>

              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onStatusToggle={handleStatusToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;