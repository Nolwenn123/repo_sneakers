import React, { useEffect, useState } from 'react';
import Navbar from '../tools/Navbar';
import jambesImg from '../assets/images/jambes.jpeg';
import './Home.css';
import { supabase } from '../supabaseClient';

// ...supprime le tableau shoes...

type Product = {
  id: number;
  name: string;
  price_usd: number;
  image_url?: string;
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
      <Navbar />
      <main className="home-main">
        <section className="intro-section">
          <img src={jambesImg} alt="Chaussures marron" className="intro-shoe" />
        </section>
        <section className="shoes-list">
          {products.map((product) => (
            <div key={product.id} className="shoe-card">
              {/* Affiche une image si tu as une colonne image_url */}
              {product.image_url && (
                <img src={product.image_url} alt={product.name} />
              )}
              <div>
                <h3>{product.name}</h3>
                <p>{product.price_usd} $</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
};

export default Home;