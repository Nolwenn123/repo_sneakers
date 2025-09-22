import React from 'react';
import './Stocks.css';

const stockLines = [
  { sku: 'FLOA-BLM-36', model: 'FLOA Bloom', audience: 'Femmes', size: '36', available: 42, incoming: 18 },
  { sku: 'FLOA-BLM-38', model: 'FLOA Bloom', audience: 'Femmes', size: '38', available: 27, incoming: 0 },
  { sku: 'FLOA-ROOT-42', model: 'FLOA Rooted', audience: 'Hommes', size: '42', available: 14, incoming: 36 },
  { sku: 'FLOA-DAWN-K34', model: 'FLOA Dawn', audience: 'Enfants', size: '34', available: 21, incoming: 12 },
  { sku: 'FLOA-AERO-41', model: 'FLOA Aéro', audience: 'Unisexe', size: '41', available: 8, incoming: 48 },
];

const alerts = [
  { label: 'Tailles critiques', value: 5, description: 'Tailles < 10 unités' },
  { label: 'Réappros en transit', value: 114, description: 'Prévu sous 7 jours' },
  { label: 'Paires réservées', value: 62, description: 'Commandes web en préparation' },
];

const warehouses = [
  { name: 'Lille', capacity: 82, fill: 68 },
  { name: 'Lyon', capacity: 64, fill: 52 },
  { name: 'Marseille', capacity: 53, fill: 41 },
];

const Stocks: React.FC = () => {
  return (
    <div className="stocks-page">
      <header className="stocks-header">
        <div>
          <h1>Gestion des stocks</h1>
          <p>Pilotage fictif des entrepôts FLOA : surveillez les niveaux et préparez les réassorts.</p>
        </div>
        <div className="stocks-header-badge">Vue démo</div>
      </header>

      <section className="stocks-metrics">
        {alerts.map(alert => (
          <article key={alert.label} className="stock-card">
            <p className="stock-card-label">{alert.label}</p>
            <p className="stock-card-value">{alert.value}</p>
            <p className="stock-card-desc">{alert.description}</p>
          </article>
        ))}
      </section>

      <section className="stocks-grid">
        <article className="stocks-table-card">
          <div className="stocks-table-header">
            <h2>Mouvements par SKU</h2>
            <button type="button" className="stocks-refresh-btn">Actualiser</button>
          </div>
          <table className="stocks-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Modèle</th>
                <th>Public</th>
                <th>Taille</th>
                <th>Disponible</th>
                <th>Réception prévue</th>
              </tr>
            </thead>
            <tbody>
              {stockLines.map(line => (
                <tr key={line.sku}>
                  <td>{line.sku}</td>
                  <td>{line.model}</td>
                  <td>{line.audience}</td>
                  <td>{line.size}</td>
                  <td>
                    <span className={`stock-pill ${line.available < 10 ? 'low' : ''}`}>
                      {line.available}
                    </span>
                  </td>
                  <td>{line.incoming}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="stocks-warehouse-card">
          <h2>Capacité entrepôts</h2>
          <ul>
            {warehouses.map(warehouse => (
              <li key={warehouse.name}>
                <div className="warehouse-header">
                  <span>{warehouse.name}</span>
                  <strong>{warehouse.fill}/{warehouse.capacity}</strong>
                </div>
                <div className="warehouse-bar">
                  <span style={{ width: `${(warehouse.fill / warehouse.capacity) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="warehouse-note">Prévoir une extension pour l’entrepôt de Lille avant Q4.</p>
        </article>
      </section>
    </div>
  );
};

export default Stocks;
