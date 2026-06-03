import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import Select from "../components/Select";
import "./AddProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data.data);
        sessionStorage.setItem("cachedProducts", JSON.stringify(res.data.data));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const cached = sessionStorage.getItem("cachedProducts");
    if (cached) {
      setProducts(JSON.parse(cached));
      fetchProducts();
    } else {
      fetchProducts();
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");

  const [quantityStock, setQuantityStock] = useState("");
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [brandName, setBrandName] = useState("");
  const [exchangeEligible, setExchangeEligible] = useState("Yes");
  const [images, setImages] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cachedProduct = null;
    const cached = sessionStorage.getItem("cachedProducts");
    if (cached) {
      const parsed = JSON.parse(cached);
      cachedProduct = parsed.find(p => p._id === id);
    }

    if (cachedProduct) {
      setProductName(cachedProduct.productName || "");
      setProductType(cachedProduct.productType || "");
      setQuantityStock(cachedProduct.quantityStock?.toString() || "");
      setMrp(cachedProduct.mrp?.toString() || "");
      setSellingPrice(cachedProduct.sellingPrice?.toString() || "");
      setBrandName(cachedProduct.brandName || "");
      setExchangeEligible(cachedProduct.exchangeEligible ? "Yes" : "No");
      if (cachedProduct.productImage) {
        setImages([cachedProduct.productImage]);
      }
      setLoading(false);
    }

    const fetchProduct = async () => {
      try {
        if (!cachedProduct) {
          setLoading(true);
        }
        const res = await API.get(`/products/${id}`);
        const product = res.data.data;

        setProductName(product.productName || "");
        setProductType(product.productType || "");
        setQuantityStock(product.quantityStock?.toString() || "");
        setMrp(product.mrp?.toString() || "");
        setSellingPrice(product.sellingPrice?.toString() || "");
        setBrandName(product.brandName || "");
        setExchangeEligible(product.exchangeEligible ? "Yes" : "No");
        if (product.images && product.images.length > 0) {
          setImages(product.images);
        } else if (product.productImage) {
          setImages([product.productImage]);
        }
      } catch (error) {
        if (!cachedProduct) {
          alert("Failed to load product details");
          navigate("/products");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const triggerBrowse = () => {
    fileInputRef.current.click();
  };

  const compressImage = (base64Str, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressedBase64 = await compressImage(reader.result);
        setImages((prev) => [...prev, compressedBase64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClose = () => {
    navigate("/products");
  };

  const handleUpdate = async () => {
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
      const payload = {
        productName,
        productType,
        quantityStock: Number(quantityStock),
        mrp: Number(mrp),
        sellingPrice: Number(sellingPrice),
        brandName,
        productImage: images[0],
        images: images,
        totalImages: images.length,
        exchangeEligible: exchangeEligible === "Yes"
      };

      await API.put(`/products/${id}`, payload);
      sessionStorage.setItem("toastMessage", "Product updated Successfully");
      sessionStorage.removeItem("cachedProducts");
      sessionStorage.removeItem("cachedProducts_published");
      sessionStorage.removeItem("cachedProducts_unpublished");
      navigate("/products");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="products-layout">
        <Sidebar />
        <div className="products-content">
          <Navbar title="Products" />
          <div className="products-main" style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
            <h3 className="loading-text">Loading product data...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-layout" style={{ position: "relative" }}>
      <Sidebar />
      <div className="products-content" style={{ filter: "blur(1px)", opacity: 0.9, pointerEvents: "none" }}>
        <Navbar title="Products" />
        <div className="products-main">
          {products.length === 0 ? (
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
                <p>You can create products without connecting store</p>
              </div>
            </div>
          ) : (
            <>
              <div className="products-header-row">
                <h1 className="products-header-title">Products</h1>
                <button className="btn-header-add">+ Add Products</button>
              </div>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onStatusToggle={() => { }}
                    onDelete={() => { }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      { }
      <div className="add-product-overlay">
        <div className="add-product-modal">

          <div className="modal-header">
            <h2>Edit Product</h2>
            <button className="btn-close" onClick={handleClose}>&times;</button>
          </div>

          <div className="modal-body">
            { }
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

            { }
            <div className="form-group">
              <label>Product Type</label>
              <Select
                value={productType}
                onChange={(val) => {
                  setProductType(val);
                  setErrors((prev) => ({ ...prev, productType: "" }));
                }}
                options={["Foods", "Electronics", "Clothes", "Beauty Products", "Others"]}
                placeholder="Select product type"
                error={errors.productType}
              />
              {errors.productType && <p className="error-text">{errors.productType}</p>}
            </div>

            { }
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

            { }
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

            { }
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

            { }
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

            { }
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

            { }
            <div className="form-group">
              <label>Exchange or return eligibility</label>
              <Select
                value={exchangeEligible}
                onChange={setExchangeEligible}
                options={["Yes", "No"]}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-create" onClick={handleUpdate}>
              Update
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EditProduct;