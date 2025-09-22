import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Product.css';
import { useCart } from '../context/CartContext';

type Product = {
  product_id: number;
  name: string;
  price_usd: number;
  hero_image?: string;
};

const SIZES = [
  '35.5', '36', '37', '37.5', '38', '38.5',
  '39', '40', '40.5', '41', '42', '42.5'
];

const features = [
  'Semelle coussinée à mémoire de forme',
  'Mesh respirant en fibres recyclées',
  'Stabilité latérale renforcée pour la ville',
  'Résistance pluie & éclaboussures (norme IPX3)'
];

const highlights = [
  'Livraison express 24h offerte pour les membres FLOA+',
  'Retours gratuits sous 30 jours',
  'Production européenne limitée — série Spring Bloom'
];

const ProductPage: React.FC = () => {
  const { product_id } = useParams<{ product_id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('product')
        .select('*')
        .eq('product_id', Number(product_id))
        .single();

      if (!error && data) {
        setProduct(data);
      }
    }

    fetchProduct();
  }, [product_id]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    if (!selectedSize) {
      setError('Choisissez une taille avant d’ajouter au panier.');
      return;
    }

    addItem({
      id: product.product_id,
      name: product.name,
      price: Number(product.price_usd ?? 0),
      image: product.hero_image,
      size: selectedSize,
    });

    setError(null);
  };

  if (!product) {
    return <div className="product-loading">Chargement...</div>;
  }

  const formattedPrice = Number(product.price_usd ?? 0).toFixed(2);

  return (
    <div className="product-page">
      <section className="product-main-card">
        <div className="product-gallery">
          <div className="product-pill">Nouvelle collection</div>
          <img src={product.hero_image ?? ''} alt={product.name} className="product-hero-image" />
        </div>

        <div className="product-details">
          <header className="product-header">
            <h1>{product.name}</h1>
            <div className="product-price-block">
              <span className="product-price">{formattedPrice} €</span>
              <span className="product-tax">TVA incluse · Frais de port calculés à l’étape suivante</span>
            </div>
            <p className="product-description">
              Imaginée pour les balades citadines et les week-ends bohèmes, cette paire FLOA s’adapte à votre rythme
              grâce à sa semelle amortissante et son maintien tout en douceur.
            </p>
          </header>

          <section className="product-section">
            <div className="product-section-heading">
              <h2>Taille</h2>
              <button type="button" className="product-size-guide">Guide des tailles</button>
            </div>
            <div className="product-sizes">
              {SIZES.map(size => (
                <button
                  type="button"
                  key={size}
                  className={`product-size-btn${selectedSize === size ? ' selected' : ''}`}
                  onClick={() => {
                    setSelectedSize(size);
                    setError(null);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="product-size-note">Taille sélectionnée : {selectedSize}</p>
            )}
          </section>

          <div className="product-actions">
            <button type="button" className="add-to-cart-btn" onClick={handleAddToCart}>
              Ajouter au panier
            </button>
            <button type="button" className="favorite-btn" aria-label="Ajouter aux favoris">
              <span aria-hidden="true">☆</span>
            </button>
          </div>
          {error && <p className="product-error" role="alert">{error}</p>}

          <ul className="product-highlights">
            {highlights.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <aside className="product-side-panel">
        <h2>Pourquoi vous allez l’adorer</h2>
        <ul className="product-feature-list">
          {features.map(feature => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <div className="product-care">
          <h3>Entretien</h3>
          <p>
            Nettoyez délicatement avec une brosse douce et laissez sécher à l’air libre. Nous recommandons un spray
            imperméabilisant écologique une fois par mois pour préserver l’éclat des matériaux.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default ProductPage;
