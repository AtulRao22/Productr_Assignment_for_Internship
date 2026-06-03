import "./ProductCard.css";

function ProductCard({ product, onStatusToggle, onDelete }) {
  const details = [
    { label: "Product type -", value: product.productType },
    { label: "Quantity Stock -", value: product.quantityStock },
    { label: "MRP -", value: `₹ ${product.mrp}` },
    { label: "Selling Price -", value: `₹ ${product.sellingPrice}` },
    { label: "Brand Name -", value: product.brandName },
    { label: "Total Number of images -", value: product.totalImages || 2 },
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
        {((product.totalImages !== undefined ? product.totalImages : (product.images?.length || 1)) > 1) && (
          <div className="carousel-dots">
            {Array.from({ length: product.totalImages || (product.images?.length || 2) }).map((_, idx) => (
              <div
                key={idx}
                className={`dot ${idx === 0 ? "active" : ""}`}
              />
            ))}
          </div>
        )}
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
          onClick={() => onDelete(product)}
          title="Delete Product"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(212, 212, 212, 1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;