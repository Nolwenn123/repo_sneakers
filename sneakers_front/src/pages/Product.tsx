import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Product.css';

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

const ProductPage: React.FC = () => {
  const { product_id } = useParams<{ product_id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('product')
        .select('*')
        .eq('product_id', Number(product_id))
        .single();
      if (!error && data) setProduct(data);
    }
    fetchProduct();
  }, [product_id]);

  if (!product) return <div>Chargement...</div>;

  return (
    <div className="product-page">
      <div className="product-image-section">
        <img src={product.hero_image} alt={product.name} className="product-hero-image" />
      </div>
      <div className="product-info-section">
        <h1>{product.name}</h1>
        <div className="product-price">{product.price_usd.toFixed(2)} €</div>
        <div className="product-size-label">Taille</div>
        <div className="product-sizes">
          {SIZES.map(size => (
            <button
              key={size}
              className={`product-size-btn${selectedSize === size ? ' selected' : ''}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
        <div className="product-actions">
          <button className="add-to-cart-btn">AJOUTER AU PANIER</button>
          <button className="favorite-btn">
            <span style={{fontSize: '2rem'}}>☆</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;