import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Product.css";

function Home() {
  const [activeTab, setActiveTab] = useState("published");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products?status=${activeTab}`);
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
  }, [activeTab]);

  return (
    <div className="products-layout">
      <Sidebar />

      <div className="products-content">
        <Navbar title="Home" />

        <div className="products-main">
          {/* Tab Navigation */}
          <div className="tabs-container">
            <button
              onClick={() => setActiveTab("published")}
              className={`tab-btn ${activeTab === "published" ? "active" : ""}`}
            >
              Published
            </button>

            <button
              onClick={() => setActiveTab("unpublished")}
              className={`tab-btn ${activeTab === "unpublished" ? "active" : ""}`}
            >
              Unpublished
            </button>
          </div>

          {/* Loading state */}
          {loading && <h3 className="loading-text">Loading products...</h3>}

          {!loading && products.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#071074" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <line x1="17" y1="14" x2="17" y2="20" strokeWidth="3" />
                  <line x1="14" y1="17" x2="20" y2="17" strokeWidth="3" />
                </svg>
              </div>

              <h2>No {activeTab === "published" ? "Published" : "Unpublished"} Products</h2>

              <p>
                Your {activeTab === "published" ? "Published" : "Unpublished"} Products will appear here{"\n"}
                Create your first product to publish
              </p>
            </div>
          )}

          {!loading && products.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;