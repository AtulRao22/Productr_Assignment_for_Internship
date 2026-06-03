import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import Toast from "../components/Toast";
import DeleteModal from "../components/DeleteModal";
import "./Product.css";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("published");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const msg = sessionStorage.getItem("toastMessage");
    if (msg) {
      setToast({ message: msg });
      sessionStorage.removeItem("toastMessage");
    }
  }, []);

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
      setToast({ message: "Product updated Successfully" });
      fetchProducts();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = (product) => {
    setProductToDelete({ id: product._id, name: product.productName });
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await API.delete(`/products/${productToDelete.id}`);
      setToast({ message: "Product deleted Successfully" });
      setProductToDelete(null);
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
      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} />
      )}
      {productToDelete && (
        <DeleteModal
          productName={productToDelete.name}
          onConfirm={handleConfirmDelete}
          onClose={() => setProductToDelete(null)}
        />
      )}
      <Sidebar />

      <div className="products-content">
        <Navbar title="Home" />

        <div className="products-main">
          {}
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

          {}
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