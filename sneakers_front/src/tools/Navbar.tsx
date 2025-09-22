import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import flowerIcon from '../assets/images/flower-icon.png';
import floalogo from '../assets/images/FLOA.png';
import profileIcon from '../assets/images/profil_icon.png';
import cartIcon from '../assets/images/panier_icon.png';
import adminIcon from '../assets/images/stat.png';
import stockIcon from '../assets/images/stock.png';

type NavbarProps = {
  userEmail: string | null
  isAdmin: boolean
}

const Navbar: React.FC<NavbarProps> = ({ userEmail, isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentCategory = params.get('category') ?? 'all';
  const sortParam = params.get('sort');
  const isPromoActive = params.get('promo') === 'true';
  const isHome = location.pathname === '/';

  const goToHomeWithParams = (options: { category?: string; promo?: boolean; sort?: 'new' | null }) => {
    const next = new URLSearchParams();

    if (options.category && options.category !== 'all') {
      next.set('category', options.category);
    }

    if (options.promo) {
      next.set('promo', 'true');
    }

    if (options.sort === 'new') {
      next.set('sort', 'new');
    }

    navigate({ pathname: '/', search: next.toString() });
  };

  const isDefaultHomeView = isHome && !isPromoActive && currentCategory === 'all' && sortParam !== 'new';

  const menuItems = [
    {
      key: 'new',
      label: 'Nouveautés',
      onClick: () => goToHomeWithParams({ category: 'all', sort: 'new' }),
      isActive: isHome && !isPromoActive && sortParam === 'new',
    },
    {
      key: 'women',
      label: 'Femmes',
      onClick: () => goToHomeWithParams({ category: 'women' }),
      isActive: isHome && !isPromoActive && currentCategory === 'women',
    },
    {
      key: 'men',
      label: 'Hommes',
      onClick: () => goToHomeWithParams({ category: 'men' }),
      isActive: isHome && !isPromoActive && currentCategory === 'men',
    },
    {
      key: 'kids',
      label: 'Enfants',
      onClick: () => goToHomeWithParams({ category: 'kids' }),
      isActive: isHome && !isPromoActive && currentCategory === 'kids',
    },
    {
      key: 'promo',
      label: 'Promo',
      onClick: () => goToHomeWithParams({ category: 'all', promo: true }),
      isActive: isHome && isPromoActive,
    },
  ];

  return (
    <header>
      <div className="navbar-top">
        <Link to="/">
          <img src={floalogo} alt="FLOA logo" className="floa-logo" />
        </Link>
        <p className="slogan">Un pétale après l’autre</p>
        <img src={flowerIcon} alt="Flower Icon" className="flower-icon" />
        {userEmail && (
          <span className="navbar-email">{userEmail}</span>
        )}
      </div>
       <nav className="navbar-menu">
        <div className="navbar-links">
          <ul>
            {menuItems.map(item => (
              <li key={item.key}>
                <button
                  type="button"
                  className={`navbar-menu-button${item.isActive || (item.key === 'new' && isDefaultHomeView) ? ' active' : ''}`}
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-icons">
          {isAdmin && (
            <>
              <Link to="/admin" className="navbar-icon-button" aria-label="Espace administrateur">
                <img src={adminIcon} alt="Icône admin" className="navbar-icon" />
              </Link>
              <Link to="/stocks" className="navbar-icon-button" aria-label="Gestion des stocks">
                <img src={stockIcon} alt="Icône stocks" className="navbar-icon" />
              </Link>
            </>
          )}
          <Link to="/profile" className="navbar-icon-button" aria-label="Profil">
            <img src={profileIcon} alt="Profil" className="navbar-icon" />
          </Link>
          <Link to="/cart" className="navbar-icon-button" aria-label="Panier">
            <img src={cartIcon} alt="Panier" className="navbar-icon" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
