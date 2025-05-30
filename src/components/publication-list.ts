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

    // Add click listeners to publication cards
    this.shadowRoot?.querySelectorAll('.publication-card').forEach(card => {
      card.addEventListener('click', () => {
        const publicationId = card.getAttribute('data-id');
        if (publicationId) {
          const publication = publications.find(pub => String(pub.id) === publicationId);
          if (publication) {
            const popup = document.createElement('food-popup');
            // Pasar los datos de la publicación al popup
            popup.setAttribute('image', publication.imagen);
            popup.setAttribute('title', publication.titulo);
            popup.setAttribute('description', publication.descripcion);
            popup.setAttribute('ingredients', JSON.stringify(publication.ingredientes));
            popup.setAttribute('time', publication.tiempo);
            popup.setAttribute('calories', publication.calorias.toString()); // Asegúrate de que calories sea string si es un número
            // Asegúrate de pasar los likes si existen en tu tipo Publication
            // popup.setAttribute('likes', publication.likes.toString());
            document.body.appendChild(popup);
          }
        }
      });
    });
  }

  private createPublicationCard(publication: Publication): string {
    return `
      <div class="publication-card" data-id="${publication.id}">
        <img src="${publication.imagen}" alt="${publication.titulo}">
      </div>
    `;
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        .publications-container {
          column-count: 3; /* Number of columns */
          column-gap: 24px; /* Gap between columns */
          padding: 24px; /* Espacio alrededor del contenedor */
        }

        .publication-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: inline-block; /* Important for column-count */
          width: 100%; /* Take full width of the column */
          margin-bottom: 24px; /* Espacio entre tarjetas en columnas */
          position: relative; /* Mantener si es necesario para otros estilos */
          cursor: pointer;
        }

        .publication-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .publication-card img {
          display: block;
          width: 100%;
          height: auto; /* Auto height for variable image heights */
        }

        /* Eliminados estilos de .publication-title-overlay */

        @media (max-width: 1024px) {
          .publications-container {
            column-count: 2;
          }
        }

        @media (max-width: 768px) {
          .publications-container {
            column-count: 1;
            padding: 16px; /* Ajustar padding en pantallas pequeñas */
          }

          .publication-card {
            margin-bottom: 16px; /* Ajustar espacio entre tarjetas en pantallas pequeñas */
          }
        }
      </style>

      <div class="publications-container"></div>
    `;
  }
}

customElements.define('publication-list', PublicationList); 