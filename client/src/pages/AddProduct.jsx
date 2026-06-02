import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Simple state fields for the form
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [quantityStock, setQuantityStock] = useState("");
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [brandName, setBrandName] = useState("");
  const [exchangeEligible, setExchangeEligible] = useState("Yes");
  const [images, setImages] = useState([]);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Helper to trigger file browse click
  const triggerBrowse = () => {
    fileInputRef.current.click();
  };

  // Convert uploaded image files to Base64 strings for storing
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Delete image thumbnail
  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Close modal and go back to home page
  const handleClose = () => {
    navigate("/home");
  };

  // Submit and create the product
  const handleCreate = async () => {
    // Basic validation checks
    const newErrors = {};
    if (!productName.trim()) {
      newErrors.productName = "Please enter product name";
    }
    if (!productType) {
      newErrors.productType = "Please select product type";
    }
    if (!quantityStock || isNaN(quantityStock) || Number(quantityStock) < 0) {
      newErrors.quantityStock = "Please enter valid stock quantity";
    }
    if (!mrp || isNaN(mrp) || Number(mrp) < 0) {
      newErrors.mrp = "Please enter valid MRP";
    }
    if (!sellingPrice || isNaN(sellingPrice) || Number(sellingPrice) < 0) {
      newErrors.sellingPrice = "Please enter valid selling price";
    } else if (Number(sellingPrice) > Number(mrp)) {
      newErrors.sellingPrice = "Selling price cannot be greater than MRP";
    }
    if (!brandName.trim()) {
      newErrors.brandName = "Please enter brand name";
    }
    if (images.length === 0) {
      newErrors.images = "Please upload at least one image";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Setup payload matching backend model schema
      const payload = {
        productName,
        productType,
        quantityStock: Number(quantityStock),
        mrp: Number(mrp),
        sellingPrice: Number(sellingPrice),
        brandName,
        productImage: images[0], // Pass first base64 string
        exchangeEligible: exchangeEligible === "Yes",
        status: "published" // Auto-publish new creations
      };

      await API.post("/products", payload);
      alert("Product created successfully!");
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <div className="products-layout" style={{ position: "relative" }}>
      {/* Background Page Content */}
      <Sidebar />
      <div className="products-content">
        <Navbar title="Products" />
        <div className="products-main" style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, opacity: 0.3, pointerEvents: "none" }}>
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
            <p>You can create products without connecting store</p>
          </div>
        </div>
      </div>

      {/* Modal Dialog Box */}
      <div className="add-product-overlay">
        <div className="add-product-modal">

          <div className="modal-header">
            <h2>Add Product</h2>
            <button className="btn-close" onClick={handleClose}>&times;</button>
          </div>

          <div className="modal-body">
            {/* Product Name */}
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                placeholder="CakeZone Walnut Brownie"
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  setErrors((prev) => ({ ...prev, productName: "" }));
                }}
                className={`form-input ${errors.productName ? "error-border" : ""}`}
              />
              {errors.productName && <p className="error-text">{errors.productName}</p>}
            </div>

            {/* Product Type */}
            <div className="form-group">
              <label>Product Type</label>
              <select
                value={productType}
                onChange={(e) => {
                  setProductType(e.target.value);
                  setErrors((prev) => ({ ...prev, productType: "" }));
                }}
                className={`form-input ${errors.productType ? "error-border" : ""}`}
              >
                <option className="select-option" value="">Select product type</option>
                <option className="select-option" value="Foods">Foods</option>
                <option className="select-option" value="Electronics">Electronics</option>
                <option className="select-option" value="Clothes">Clothes</option>
                <option className="select-option" value="Beauty Products">Beauty Products</option>
                <option className="select-option" value="Others">Others</option>
              </select>
              {errors.productType && <p className="error-text">{errors.productType}</p>}
            </div>

            {/* Quantity Stock */}
            <div className="form-group">
              <label>Quantity Stock</label>
              <input
                type="text"
                placeholder="Total numbers of Stock available"
                value={quantityStock}
                onChange={(e) => {
                  setQuantityStock(e.target.value);
                  setErrors((prev) => ({ ...prev, quantityStock: "" }));
                }}
                className={`form-input ${errors.quantityStock ? "error-border" : ""}`}
              />
              {errors.quantityStock && <p className="error-text">{errors.quantityStock}</p>}
            </div>

            {/* MRP */}
            <div className="form-group">
              <label>MRP</label>
              <input
                type="text"
                placeholder="Total numbers of Stock available"
                value={mrp}
                onChange={(e) => {
                  setMrp(e.target.value);
                  setErrors((prev) => ({ ...prev, mrp: "" }));
                }}
                className={`form-input ${errors.mrp ? "error-border" : ""}`}
              />
              {errors.mrp && <p className="error-text">{errors.mrp}</p>}
            </div>

            {/* Selling Price */}
            <div className="form-group">
              <label>Selling Price</label>
              <input
                type="text"
                placeholder="Total numbers of Stock available"
                value={sellingPrice}
                onChange={(e) => {
                  setSellingPrice(e.target.value);
                  setErrors((prev) => ({ ...prev, sellingPrice: "" }));
                }}
                className={`form-input ${errors.sellingPrice ? "error-border" : ""}`}
              />
              {errors.sellingPrice && <p className="error-text">{errors.sellingPrice}</p>}
            </div>

            {/* Brand Name */}
            <div className="form-group">
              <label>Brand Name</label>
              <input
                type="text"
                placeholder="Total numbers of Stock available"
                value={brandName}
                onChange={(e) => {
                  setBrandName(e.target.value);
                  setErrors((prev) => ({ ...prev, brandName: "" }));
                }}
                className={`form-input ${errors.brandName ? "error-border" : ""}`}
              />
              {errors.brandName && <p className="error-text">{errors.brandName}</p>}
            </div>

            {/* Upload Product Images */}
            <div className="form-group">
              <div className="upload-label-row">
                <label>Upload Product Images</label>
                {images.length > 0 && (
                  <button type="button" className="btn-add-photos" onClick={triggerBrowse}>
                    Add More Photos
                  </button>
                )}
              </div>

              {images.length === 0 ? (
                <div className="upload-area" onClick={triggerBrowse}>
                  <p>
                    Enter Description{"\n"}
                    <span>Browse</span>
                  </p>
                </div>
              ) : (
                <div className="image-previews-grid">
                  {images.map((img, idx) => (
                    <div key={idx} className="preview-wrapper">
                      <img src={img} alt="Preview" className="preview-image" />
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={() => removeImage(idx)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  handleImageUpload(e);
                  setErrors((prev) => ({ ...prev, images: "" }));
                }}
                className="hidden-file-input"
              />
              {errors.images && <p className="error-text">{errors.images}</p>}
            </div>

            {/* Exchange Eligibility */}
            <div className="form-group">
              <label>Exchange or return eligibility</label>
              <select
                value={exchangeEligible}
                onChange={(e) => setExchangeEligible(e.target.value)}
                className="form-input"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-create" onClick={handleCreate}>
              Create
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddProduct;