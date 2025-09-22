import React, { useMemo, useState } from 'react';
import './Cart.css';
import { useCart, type CartItem } from '../context/CartContext';

type StepKey = 'information' | 'delivery' | 'payment' | 'billing' | 'confirmation';

const steps: { key: StepKey; label: string }[] = [
  { key: 'information', label: 'Informations' },
  { key: 'delivery', label: 'Livraison' },
  { key: 'payment', label: 'Paiement' },
  { key: 'billing', label: 'Facturation' },
  { key: 'confirmation', label: 'Confirmation' },
];

const Cart: React.FC = () => {
  const { items: cartItems, updateQuantity, removeItem } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [checkoutData, setCheckoutData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    deliveryOption: 'standard',
    paymentMethod: 'card',
    cardName: '',
    cardNumber: '',
    billingAddress: '',
    billingCity: '',
    billingPostalCode: '',
    notes: '',
  });

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price ?? 0) * item.quantity, 0),
    [cartItems]
  );

  const shippingCost = checkoutData.deliveryOption === 'express' ? 19 : 0;
  const total = subtotal + shippingCost;
  const canProceed = cartItems.length > 0;

  const handleDecreaseQuantity = (item: CartItem) => {
    const nextQuantity = Math.max(0, item.quantity - 1);
    updateQuantity(item.id, item.size ?? null, nextQuantity);
  };

  const handleIncreaseQuantity = (item: CartItem) => {
    updateQuantity(item.id, item.size ?? null, item.quantity + 1);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setCheckoutData(prev => ({ ...prev, [name]: value }));
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    const step = steps[currentStep].key;

    switch (step) {
      case 'information':
        return (
          <div className="form-grid">
            <label>
              Prénom
              <input
                name="firstName"
                value={checkoutData.firstName}
                onChange={handleInputChange}
                placeholder="Marie"
                required
              />
            </label>
            <label>
              Nom
              <input
                name="lastName"
                value={checkoutData.lastName}
                onChange={handleInputChange}
                placeholder="Dupont"
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={checkoutData.email}
                onChange={handleInputChange}
                placeholder="marie.dupont@email.com"
                required
              />
            </label>
            <label>
              Téléphone
              <input
                name="phone"
                value={checkoutData.phone}
                onChange={handleInputChange}
                placeholder="06 12 34 56 78"
              />
            </label>
          </div>
        );

      case 'delivery':
        return (
          <div className="delivery-options">
            <label className="radio-card">
              <input
                type="radio"
                name="deliveryOption"
                value="standard"
                checked={checkoutData.deliveryOption === 'standard'}
                onChange={handleInputChange}
              />
              <div className="radio-card-content">
                <strong>Standard</strong>
                <p>Gratuit - 4 à 6 jours ouvrés</p>
              </div>
            </label>
            <label className="radio-card">
              <input
                type="radio"
                name="deliveryOption"
                value="express"
                checked={checkoutData.deliveryOption === 'express'}
                onChange={handleInputChange}
              />
              <div className="radio-card-content">
                <strong>Express</strong>
                <p>19 $ - Livraison en 24h</p>
              </div>
            </label>
            <label className="notes" htmlFor="notes">
              Instructions de livraison (optionnel)
              <textarea
                id="notes"
                name="notes"
                value={checkoutData.notes}
                onChange={handleInputChange}
                placeholder="Code porte, étage, préférences..."
                rows={3}
              />
            </label>
          </div>
        );

      case 'payment':
        return (
          <div className="payment-grid">
            <div className="payment-methods">
              <label className="radio-pill">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={checkoutData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                />
                <span>Carte bancaire</span>
              </label>
              <label className="radio-pill">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={checkoutData.paymentMethod === 'paypal'}
                  onChange={handleInputChange}
                />
                <span>PayPal</span>
              </label>
              <label className="radio-pill">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="applepay"
                  checked={checkoutData.paymentMethod === 'applepay'}
                  onChange={handleInputChange}
                />
                <span>Apple Pay</span>
              </label>
            </div>
            {checkoutData.paymentMethod === 'card' && (
              <div className="form-grid">
                <label>
                  Nom sur la carte
                  <input
                    name="cardName"
                    value={checkoutData.cardName}
                    onChange={handleInputChange}
                    placeholder="MARIE DUPONT"
                  />
                </label>
                <label>
                  Numéro de carte
                  <input
                    name="cardNumber"
                    value={checkoutData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                  />
                </label>
              </div>
            )}
          </div>
        );

      case 'billing':
        return (
          <div className="form-grid">
            <label>
              Adresse de facturation
              <input
                name="billingAddress"
                value={checkoutData.billingAddress}
                onChange={handleInputChange}
                placeholder="12 rue des Fleurs"
              />
            </label>
            <label>
              Ville
              <input
                name="billingCity"
                value={checkoutData.billingCity}
                onChange={handleInputChange}
                placeholder="Paris"
              />
            </label>
            <label>
              Code postal
              <input
                name="billingPostalCode"
                value={checkoutData.billingPostalCode}
                onChange={handleInputChange}
                placeholder="75001"
              />
            </label>
          </div>
        );

      case 'confirmation':
      default:
        return (
          <div className="confirmation">
            <h3>Prêt à pétiller ✨</h3>
            <p>
              Merci ! Toutes les informations sont prêtes. Il ne vous reste plus
              qu’à valider pour finaliser cette commande fictive.
            </p>
            <ul>
              <li>
                <strong>Contact :</strong> {checkoutData.firstName} {checkoutData.lastName}
              </li>
              <li>
                <strong>Email :</strong> {checkoutData.email || '—'}
              </li>
              <li>
                <strong>Livraison :</strong>{' '}
                {checkoutData.deliveryOption === 'express'
                  ? 'Express (24h)'
                  : 'Standard (4-6 jours)'}
              </li>
              <li>
                <strong>Paiement :</strong>{' '}
                {checkoutData.paymentMethod === 'card'
                  ? 'Carte bancaire'
                  : checkoutData.paymentMethod === 'paypal'
                  ? 'PayPal'
                  : 'Apple Pay'}
              </li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="cart-container">
      <h1>Mon panier</h1>

      <div className="stepper">
        {steps.map((step, index) => (
          <button
            key={step.key}
            type="button"
            className={`step ${index === currentStep ? 'active' : ''} ${
              index < currentStep ? 'completed' : ''
            }`}
            onClick={() => goToStep(index)}
          >
            <span className="step-index">{index + 1}</span>
            <span className="step-label">{step.label}</span>
          </button>
        ))}
      </div>

      <div className="cart-layout">
        <div className="cart-main">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Votre panier est vide pour le moment.</p>
          ) : (
            cartItems.map(item => (
              <div key={`${item.id}-${item.size ?? 'default'}`} className="cart-item">
                {item.image && (
                  <img src={item.image} alt={item.name} className="cart-img" />
                )}
                <div className="cart-info">
                  <h3>{item.name}</h3>
                  {item.size && <span className="cart-meta">Taille {item.size}</span>}
                  <div className="cart-quantity-row">
                    <button
                      type="button"
                      onClick={() => handleDecreaseQuantity(item)}
                      aria-label="Diminuer la quantité"
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleIncreaseQuantity(item)}
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <span className="cart-item-price">{(item.price * item.quantity).toFixed(2)} $</span>
                  <button
                    className="trash-btn"
                    onClick={() => removeItem(item.id, item.size ?? null)}
                    aria-label="Supprimer du panier"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="checkout-panel">
          <h2>{steps[currentStep].label}</h2>
          <div className="step-content">{renderStepContent()}</div>

          <div className="totals">
            <div>
              <span>Sous-total</span>
              <strong>{subtotal.toFixed(2)} $</strong>
            </div>
            <div>
              <span>Livraison</span>
              <strong>{shippingCost === 0 ? 'Offerte' : `${shippingCost.toFixed(2)} $`}</strong>
            </div>
            <div className="total">
              <span>Total</span>
              <strong>{total.toFixed(2)} $</strong>
            </div>
          </div>

          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Étape précédente
            </button>
            <button
              type="button"
              className="primary"
              onClick={handleNext}
              disabled={currentStep === steps.length - 1 || !canProceed}
            >
              Continuer
            </button>
          </div>

          {currentStep === steps.length - 1 && (
            <button type="button" className="cta" disabled={!canProceed}>
              Valider ma commande
            </button>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Cart;
