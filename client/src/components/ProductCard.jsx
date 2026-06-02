import "./ProductCard.css";

function ProductCard({ product, onStatusToggle, onDelete }) {
  const details = [
    { label: "Product type -", value: product.productType },
    { label: "Quantity Stock", value: product.quantityStock },
    { label: "MRP -", value: `₹${product.mrp}` },
    { label: "Selling Price -", value: `₹${product.sellingPrice}` },
    { label: "Brand Name -", value: product.brandName },
    { label: "Total number of images -", value: product.totalImages || 2 },
    { label: "Exchange Eligibility -", value: product.exchangeEligible ? "YES" : "NO" }
  ];

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.productImage || "https://placehold.co/180x180"}
          alt={product.productName}
          className="product-card-image"
        />
        <div className="carousel-dots">
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>

      <h3 className="product-title">{product.productName}</h3>

      <div className="product-details-list">
        {details.map((detail, idx) => (
          <div key={idx} className="product-details-row">
            <span className="product-details-label">{detail.label}</span>
            <span className="product-details-value">{detail.value}</span>
          </div>
        ))}
      </div>

      <div className="product-actions">
        <button
          className={`btn-publish-toggle ${product.status}`}
          onClick={() => onStatusToggle(product._id, product.status)}
        >
          {product.status === "published" ? "Unpublish" : "Publish"}
        </button>
        
        <button 
          className="btn-card-edit" 
          onClick={() => window.location.href = `/edit-product/${product._id}`}
        >
          Edit
        </button>
        
        <button 
          className="btn-card-delete" 
          onClick={() => onDelete(product._id)}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default ProductCard;