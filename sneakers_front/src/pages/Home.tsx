import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import jambesImg from '../assets/images/jambes.jpeg';
import './Home.css';

type Product = {
  product_id: number;
  name: string;
  price_usd: number;
  hero_image?: string;
};

type GenderFilter = 'all' | 'women' | 'men' | 'unisex' | 'kids';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [productColors, setProductColors] = useState<Record<number, string[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortMode, setSortMode] = useState<'default' | 'newest'>('default');
  const [isPromoView, setIsPromoView] = useState(false);
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('product').select('*');
      if (!error && data) setProducts(data);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchColors() {
      const { data, error } = await supabase
        .from('product_colour')
        .select('product_id, colour:colour_id(name)');

      if (!error && data) {
        const rows = data as Array<{
          product_id: number;
          colour?: { name?: string | null } | Array<{ name?: string | null }>;
        }>;

        const byProduct = rows.reduce<Record<number, string[]>>((acc, item) => {
          const colourEntries = Array.isArray(item.colour)
            ? item.colour
            : item.colour
            ? [item.colour]
            : [];

          if (!acc[item.product_id]) {
            acc[item.product_id] = [];
          }

          colourEntries.forEach(entry => {
            const trimmed = entry?.name?.trim();
            if (trimmed && !acc[item.product_id].includes(trimmed)) {
              acc[item.product_id].push(trimmed);
            }
          });

          return acc;
        }, {});

        setProductColors(byProduct);
      }
    }

    fetchColors();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const promoParam = searchParams.get('promo');
    const sortParam = searchParams.get('sort');

    setIsPromoView(promoParam === 'true');

    setSortMode(sortParam === 'new' ? 'newest' : 'default');

    if (categoryParam) {
      const categoryMap: Record<string, GenderFilter> = {
        all: 'all',
        women: 'women',
        men: 'men',
        unisex: 'unisex',
        kids: 'kids',
      };

      const mappedCategory = categoryMap[categoryParam] ?? 'all';

      if (mappedCategory !== genderFilter) {
        setGenderFilter(mappedCategory);
      }
    } else if (genderFilter !== 'all') {
      setGenderFilter('all');
    }
  }, [genderFilter, searchParams]);

  useEffect(() => {
    if (isPromoView && products.length > 0) {
      const selection = [...products]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(products.length, 6));
      setPromoProducts(selection);
    } else if (!isPromoView) {
      setPromoProducts([]);
    }
  }, [isPromoView, products]);

  const toggleFavorite = (id: number) => {
    let newFavs: number[];
    if (favorites.includes(id)) {
      newFavs = favorites.filter(f => f !== id);
    } else {
      newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  const handleGenderFilterChange = (value: GenderFilter) => {
    setGenderFilter(value);

    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete('promo');
    nextParams.delete('sort');

    if (value === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', value);
    }

    setSearchParams(nextParams, { replace: true });
  };

  const handleClearFilters = () => {
    setGenderFilter('all');
    setColorFilter('all');
    setPriceFilter('all');

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('category');
    nextParams.delete('promo');
    nextParams.delete('sort');

    setSearchParams(nextParams, { replace: true });
  };

  const availableColors = useMemo(() => {
    const colourSet = new Set<string>();
    Object.values(productColors).forEach(colours => {
      colours.forEach(colour => colourSet.add(colour));
    });
    return Array.from(colourSet).sort((a, b) => a.localeCompare(b));
  }, [productColors]);

  const filteredProducts = useMemo(() => {
    if (isPromoView) {
      return products;
    }

    const normalisedSearch = searchTerm.trim().toLowerCase();

    const result = products.filter(product => {
      const { price_usd } = product;
      const productName = product.name.toLowerCase();

      const derivedGender: GenderFilter = (() => {
        if (/(kid|junior|child|enfant|youth)/i.test(productName)) {
          return 'kids';
        }
        if (productName.includes('women')) {
          return 'women';
        }
        if (productName.includes('men')) {
          return 'men';
        }
        return 'unisex';
      })();

      const colours = productColors[product.product_id] ?? [];

      if (genderFilter !== 'all' && derivedGender !== genderFilter) {
        return false;
      }

      if (
        colorFilter !== 'all' &&
        !colours.some(colour => colour.toLowerCase() === colorFilter.toLowerCase())
      ) {
        return false;
      }

      if (priceFilter !== 'all') {
        const [min, max] = (() => {
          switch (priceFilter) {
            case '0-100':
              return [0, 100];
            case '100-200':
              return [100, 200];
            case '200-300':
              return [200, 300];
            case '300+':
              return [300, Infinity];
            default:
              return [0, Infinity];
          }
        })();

        if (price_usd < min || price_usd > max) {
          return false;
        }
      }

      if (normalisedSearch && !productName.includes(normalisedSearch)) {
        return false;
      }

      return true;
    });

    if (sortMode === 'newest') {
      return [...result].sort((a, b) => b.product_id - a.product_id);
    }

    return result;
  }, [colorFilter, genderFilter, isPromoView, priceFilter, productColors, products, searchTerm, sortMode]);

  const displayedProducts = isPromoView ? promoProducts : filteredProducts;

  return (
    <main className="home-main">
      <section className="home-banner" aria-hidden="true">
        <img src={jambesImg} alt="Chaussures marron" className="home-banner-image" />
      </section>

      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-hero-kicker">Nouvelle saison</p>
          <h1>Des sneakers qui font éclore chaque pas</h1>
          <p className="home-hero-subtitle">
            Découvrez les modèles FLOA, pensés pour révéler votre élégance naturelle avec
            des matériaux durables, des couleurs pastel et une légèreté florale.
          </p>
          <div className="home-hero-actions">
            <Link to="/product/1" className="home-cta">
              Explorer la collection
            </Link>
            <button
              type="button"
              className="home-secondary"
              onClick={() => setIsFilterOpen(true)}
            >
              ⤿ Afficher les filtres
            </button>
          </div>

          <ul className="home-hero-stats">
            <li>
              <strong>120+</strong>
              <span>Modèles en stock</span>
            </li>
            <li>
              <strong>72h</strong>
              <span>Production locale</span>
            </li>
            <li>
              <strong>4.9/5</strong>
              <span>Avis clients</span>
            </li>
          </ul>
        </div>

        <div className="home-hero-visual">
          <img src={jambesImg} alt="Chaussures marron" className="home-hero-image" />
          <div className="home-hero-bubble">
            <span className="bubble-title">Collection Bloom</span>
            <span className="bubble-price">À partir de 129 €</span>
          </div>
        </div>
      </section>

      <section className="home-controls" aria-label="Recherche et filtres">
        <div className="search-bar">
          <input
            type="search"
            placeholder="Rechercher une paire..."
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          />
        </div>
        <button
          type="button"
          className="filter-toggle"
          onClick={() => setIsFilterOpen(prev => !prev)}
          aria-expanded={isFilterOpen}
          aria-controls="filters-panel"
        >
          <span aria-hidden="true">⚙️</span>
          <span className="filter-label">Filtres</span>
        </button>
      </section>

      {isFilterOpen && (
        <section id="filters-panel" className="filters-panel">
          <div className="filter-group">
            <label htmlFor="gender-filter">Genre</label>
            <select
              id="gender-filter"
              value={genderFilter}
              onChange={event => handleGenderFilterChange(event.target.value as GenderFilter)}
            >
              <option value="all">Tous</option>
              <option value="women">Femmes</option>
              <option value="men">Hommes</option>
              <option value="unisex">Unisexe</option>
              <option value="kids">Enfants</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="color-filter">Couleur</label>
            <select
              id="color-filter"
              value={colorFilter}
              onChange={event => setColorFilter(event.target.value)}
            >
              <option value="all">Toutes</option>
              {availableColors.map(colour => (
                <option key={colour} value={colour}>
                  {colour}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="price-filter">Prix</label>
            <select
              id="price-filter"
              value={priceFilter}
              onChange={event => setPriceFilter(event.target.value)}
            >
              <option value="all">Tous les prix</option>
              <option value="0-100">0 - 100 $</option>
              <option value="100-200">100 - 200 $</option>
              <option value="200-300">200 - 300 $</option>
              <option value="300+">300 $ et +</option>
            </select>
          </div>

          <button
            type="button"
            className="clear-filters"
            onClick={handleClearFilters}
          >
            Réinitialiser
          </button>
        </section>
      )}

      <section className="shoes-list">
        {displayedProducts.length === 0 && (
          <p className="empty-state">
            {isPromoView
              ? 'Aucune sélection promo disponible pour le moment.'
              : 'Aucun produit ne correspond à votre recherche.'}
          </p>
        )}

        {displayedProducts.map((product, index) => {
          const colours = productColors[product.product_id];

          return (
          <div
            key={product.product_id}
            className="shoe-card"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {isPromoView && <span className="promo-badge">Promo</span>}
            <Link
              to={`/product/${product.product_id}`}
              className="shoe-card-link"
            >
              {product.hero_image && (
                <img src={product.hero_image} alt={product.name} />
              )}
              <div>
                <h3>{product.name}</h3>
                <p className="shoe-price">{product.price_usd} $</p>
                {colours && colours.length > 0 && (
                  <p className="shoe-colors">{colours.join(', ')}</p>
                )}
              </div>
            </Link>

            {/* Cœur favoris */}
            <button
              className={`fav-btn ${
                favorites.includes(product.product_id) ? 'fav' : ''
              }`}
              onClick={() => toggleFavorite(product.product_id)}
            >
              ♥
            </button>
          </div>
          );
        })}
      </section>
    </main>
  );
};

export default Home;
