import React, { useEffect, useState } from 'react';
import jambesImg from '../assets/images/jambes.jpeg';
import './Home.css';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';


// ...supprime le tableau shoes...

type Product = {
  product_id: number;
  name: string;
  price_usd: number;
  hero_image?: string;
};

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('product')
        .select('*');
      if (!error && data) {
        setProducts(data);
      }
    }
    fetchProducts();
  }, []);

  return (
    <>
      <main className="home-main">
        <section className="intro-section">
          <img src={jambesImg} alt="Chaussures marron" className="intro-shoe" />
        </section>
        <section className="shoes-list">
          {products.map((product) => (
            <Link to={`/product/${product.product_id}`} key={product.product_id} className="shoe-card-link">

            <div className="shoe-card">
              {/* Affiche une image si tu as une colonne image_url */}
              {product.hero_image && (
                <img src={product.hero_image} alt={product.name} />
              )}
              <div>
                <h3>{product.name}</h3>
                <p>{product.price_usd} $</p>
              </div>
            </div>
            </Link>

          ))}
        </section>
      </main>
    </>
  );
};

export default Home;