import { useEffect, useState } from 'react';
import './CookieBanner.css';

const COOKIE_STORAGE_KEY = 'floa-cookie-consent';
const CONSENT_TTL = 1000 * 60 * 60 * 24 * 90; // 90 days

type ConsentValue = 'accepted' | 'declined';

type StoredConsent = {
  value: ConsentValue;
  timestamp: number;
};

const CookieBanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_STORAGE_KEY);

    if (!storedConsent) {
      setIsOpen(true);
      return;
    }

    try {
      const parsed: StoredConsent = JSON.parse(storedConsent);

      if (!parsed?.timestamp || Date.now() - parsed.timestamp > CONSENT_TTL) {
        localStorage.removeItem(COOKIE_STORAGE_KEY);
        setIsOpen(true);
      }
    } catch (error) {
      // Legacy value without metadata, treat as expired
      localStorage.removeItem(COOKIE_STORAGE_KEY);
      setIsOpen(true);
    }
  }, []);

  const persistChoice = (value: ConsentValue) => {
    const payload: StoredConsent = {
      value,
      timestamp: Date.now(),
    };

    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(payload));
    setIsOpen(false);
    setShowDetails(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="cookie-overlay" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
      <div className="cookie-card">
        <div className="cookie-header">
          <div className="cookie-emoji" aria-hidden="true">🍓</div>
          <div>
            <h2 id="cookie-title">Vos petites douceurs numériques</h2>
            <p>
              Pour faire fleurir votre expérience FLOA, nous utilisons un soupçon de cookies.
              Ils ne sont pas comestibles, mais ils rendent la visite plus parfumée.
            </p>
          </div>
        </div>

        {showDetails ? (
          <div className="cookie-details">
            <div>
              <strong>Essentiels</strong>
              <p>Indispensables au fonctionnement du site (panier, authentification, sécurité).</p>
            </div>
            <div>
              <strong>Performance</strong>
              <p>Pour comprendre quelles collections font chavirer les cœurs et améliorer la boutique.</p>
            </div>
            <div>
              <strong>Marketing</strong>
              <p>Nous permet de proposer des campagnes fleurie sur-mesure, avec modération.</p>
            </div>
          </div>
        ) : (
          <p className="cookie-summary">
            En acceptant, vous laissez nos pétales analyser votre parcours pour personnaliser le site.
            Vous pouvez refuser – la promenade sera simplement un peu moins parfumée.
          </p>
        )}

        <div className="cookie-actions">
          <button type="button" className="cookie-secondary" onClick={() => setShowDetails(prev => !prev)}>
            {showDetails ? 'Masquer les détails' : 'Personnaliser'}
          </button>
          <div className="cookie-primary-actions">
            <button type="button" className="cookie-decline" onClick={() => persistChoice('declined')}>
              Tout refuser
            </button>
            <button type="button" className="cookie-accept" onClick={() => persistChoice('accepted')}>
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
