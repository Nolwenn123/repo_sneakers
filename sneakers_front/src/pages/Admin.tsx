import React, { useMemo, useState } from 'react';
import './Admin.css';

const monthlySales = [
  { month: 'Janvier', value: 42 },
  { month: 'Février', value: 56 },
  { month: 'Mars', value: 64 },
  { month: 'Avril', value: 58 },
  { month: 'Mai', value: 72 },
  { month: 'Juin', value: 89 },
];

const topProducts = [
  { name: 'FLOA Bloom Women', sales: 312 },
  { name: 'FLOA Rooted Men', sales: 287 },
  { name: 'FLOA Sunrise Women', sales: 241 },
];

const acquisition = [
  { channel: 'Instagram Ads', share: 42 },
  { channel: 'TikTok', share: 27 },
  { channel: 'Newsletter', share: 18 },
  { channel: 'Ambassadeurs', share: 13 },
];

const tickets = [
  { subject: 'Taille inexacte', status: 'Ouvert', owner: 'Camille' },
  { subject: 'Retard de livraison', status: 'En cours', owner: 'Léa' },
  { subject: 'Demande de facture', status: 'Résolu', owner: 'Sam' },
];

const Admin: React.FC = () => {
  const lastMonth = monthlySales[monthlySales.length - 1]?.month ?? 'Juin';
  const [selectedMonth, setSelectedMonth] = useState(lastMonth);

  const highlightedValue = useMemo(() => {
    const current = monthlySales.find(entry => entry.month === selectedMonth);
    return current?.value ?? 0;
  }, [selectedMonth]);

  const maxMonthlySale = useMemo(
    () => Math.max(...monthlySales.map(entry => entry.value)),
    []
  );

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Dashboard administrateur</h1>
          <p>
            Pilotage fictif de FLOA : suivez l’évolution des ventes, campagnes et
            retours clients en un clin d’œil.
          </p>
        </div>
        <div className="admin-badge">Mode aperçu</div>
      </header>

      <section className="admin-cards">
        <article className="metric-card">
          <h2>Revenu juin</h2>
          <p className="metric-value">89 000 $</p>
          <span className="metric-trend positive">+18% vs mai</span>
        </article>
        <article className="metric-card">
          <h2>Commandes</h2>
          <p className="metric-value">1 276</p>
          <span className="metric-trend positive">+9% cette semaine</span>
        </article>
        <article className="metric-card">
          <h2>Nouveaux clients</h2>
          <p className="metric-value">382</p>
          <span className="metric-trend neutral">Conversion 3,1%</span>
        </article>
        <article className="metric-card">
          <h2>Taux de retour</h2>
          <p className="metric-value">4,3%</p>
          <span className="metric-trend negative">-1,1 pts vs 2023</span>
        </article>
      </section>

      <section className="admin-grid">
        <article className="chart-card">
          <div className="chart-header">
            <h2>Ventes mensuelles</h2>
            <select
              value={selectedMonth}
              onChange={event => setSelectedMonth(event.target.value)}
            >
              {monthlySales.map(entry => (
                <option key={entry.month} value={entry.month}>
                  {entry.month}
                </option>
              ))}
            </select>
          </div>
          <div className="bar-chart">
            {monthlySales.map(entry => {
              const isActive = entry.month === selectedMonth;
              const height = Math.max((entry.value / maxMonthlySale) * 180, 20);
              return (
                <div key={entry.month} className={`bar ${isActive ? 'active' : ''}`}>
                  <div className="bar-shape" style={{ height: `${height}px` }} />
                  <span className="bar-month">{entry.month}</span>
                </div>
              );
            })}
          </div>
          <p className="chart-legend">
            {selectedMonth} · {highlightedValue} paires vendues
          </p>
        </article>

        <article className="chart-card">
          <h2>Acquisition clients</h2>
          <ul className="acquisition-list">
            {acquisition.map(channel => (
              <li key={channel.channel}>
                <span>{channel.channel}</span>
                <strong>{channel.share}%</strong>
              </li>
            ))}
          </ul>
          <p className="chart-legend">
            Objectif : diversifier en renforçant les partenariats influenceurs.
          </p>
        </article>

        <article className="chart-card">
          <h2>Meilleures ventes</h2>
          <ul className="top-products">
            {topProducts.map(product => (
              <li key={product.name}>
                <span>{product.name}</span>
                <strong>{product.sales} ventes</strong>
              </li>
            ))}
          </ul>
          <p className="chart-legend">
            Les modèles féminins représentent 54% du chiffre d’affaires.
          </p>
        </article>

        <article className="chart-card">
          <h2>Support clients</h2>
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Sujet</th>
                <th>Statut</th>
                <th>Assigné</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => {
                const statusClass = ticket.status
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/\s+/g, '-');
                return (
                  <tr key={ticket.subject}>
                    <td>{ticket.subject}</td>
                    <td>
                      <span className={`status ${statusClass}`}>{ticket.status}</span>
                    </td>
                    <td>{ticket.owner}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="chart-legend">
            Temps moyen de résolution : 7h12 — objectif .
          </p>
        </article>
      </section>
    </div>
  );
};

export default Admin;
