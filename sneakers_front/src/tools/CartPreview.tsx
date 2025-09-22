import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPreview.css';

const CartPreview: React.FC = () => {
  const { items, isCartOpen, closeCart, totalPrice } = useCart();

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isCartOpen]);

  if (!isCartOpen) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeCart();
    }
  };

  return (
    <div
      className="cart-preview-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-preview-title"
      onClick={handleOverlayClick}
    >
      <div className="cart-preview-panel">
        <button
          type="button"
          className="cart-preview-close"
          onClick={closeCart}
          aria-label="Fermer l’aperçu du panier"
        >
          ×
        </button>

        <h2 id="cart-preview-title">Votre panier</h2>

        {items.length === 0 ? (
          <p className="cart-preview-empty">Votre panier est vide.</p>
        ) : (
          <>
            <div className="cart-preview-body">
              <ul className="cart-preview-list">
                {items.map(item => (
                  <li key={`${item.id}-${item.size ?? 'default'}`} className="cart-preview-item">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="cart-preview-image" />
                    )}
                    <div className="cart-preview-content">
                      <p className="cart-preview-name">{item.name}</p>
                      {item.size && <span className="cart-preview-meta">Taille {item.size}</span>}
                      <span className="cart-preview-meta">Quantité : {item.quantity}</span>
                    </div>
                    <span className="cart-preview-price">{(item.price * item.quantity).toFixed(2)} $</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cart-preview-footer">
              <span className="cart-preview-total">Total : {totalPrice.toFixed(2)} $</span>
              <Link to="/cart" className="cart-preview-link" onClick={closeCart}>
                Voir le panier
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPreview;
