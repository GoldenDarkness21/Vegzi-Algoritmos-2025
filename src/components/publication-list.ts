import { PublicationService } from '../services/publication.service';
import { Publication } from '../types/publication.type';

export class PublicationList extends HTMLElement {
  private publicationService: PublicationService;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.publicationService = PublicationService.getInstance();
  }

  connectedCallback() {
    this.render();
    this.loadPublications();
  }

  private loadPublications() {
    const publications = this.publicationService.getPublications();
    this.renderPublications(publications);
  }

  private renderPublications(publications: Publication[]) {
    const container = this.shadowRoot?.querySelector('.publications-container');
    if (!container) return;

    container.innerHTML = publications.map(pub => this.createPublicationCard(pub)).join('');
  }

  private createPublicationCard(publication: Publication): string {
    return `
      <div class="publication-card">
        <div class="publication-image">
          <img src="${publication.imagen}" alt="${publication.titulo}">
        </div>
        <div class="publication-content">
          <h3 class="publication-title">${publication.titulo}</h3>
          <div class="publication-meta">
            <span class="time">⏱️ ${publication.tiempo}</span>
            <span class="calories">🔥 ${publication.calorias}</span>
          </div>
          <p class="publication-description">${publication.descripcion}</p>
          <div class="ingredients">
            ${publication.ingredientes.map(ing => `
              <span class="ingredient">${ing}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        .publications-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          padding: 24px;
        }

        .publication-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .publication-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .publication-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .publication-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .publication-card:hover .publication-image img {
          transform: scale(1.05);
        }

        .publication-content {
          padding: 20px;
        }

        .publication-title {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: #333;
        }

        .publication-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
          color: #666;
          font-size: 0.9rem;
        }

        .publication-description {
          color: #444;
          line-height: 1.6;
          margin-bottom: 16px;
          font-size: 0.95rem;
        }

        .ingredients {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ingredient {
          background: #E8F5E9;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          color: #388E3C;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .publications-container {
            grid-template-columns: 1fr;
            padding: 16px;
          }
        }
      </style>

      <div class="publications-container"></div>
    `;
  }
}

customElements.define('publication-list', PublicationList); 