import "./DeleteModal.css";

function DeleteModal({ productName, onConfirm, onClose }) {
  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <h3>Delete Product</h3>
          <button className="delete-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 1.5L10.5 10.5M1.5 10.5L10.5 1.5"
                stroke="#98A2B3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="delete-modal-body">
          <p>
            Are you sure you really want to delete this Product<br />
            <span className="product-name-quote">“ {productName} ” ?</span>
          </p>
        </div>
        <div className="delete-modal-footer">
          <button className="btn-delete-confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
