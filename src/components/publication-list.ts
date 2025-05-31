import { PublicationService } from '../services/publication-service';
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

    
    this.shadowRoot?.querySelectorAll('.publication-card').forEach(card => {
      card.addEventListener('click', () => {
        const publicationId = card.getAttribute('data-id');
        if (publicationId) {
          const publication = publications.find(pub => String(pub.id) === publicationId);
          if (publication) {
            const popup = document.createElement('food-popup');
            //  Esto lo que hace es pasar los datos de la publicación al popup
            popup.setAttribute('image', publication.imagen);
            popup.setAttribute('title', publication.titulo);
            popup.setAttribute('description', publication.descripcion);
            popup.setAttribute('ingredients', JSON.stringify(publication.ingredientes));
            popup.setAttribute('time', publication.tiempo);
            popup.setAttribute('calories', publication.calorias.toString());
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
          column-count: 3; 
          column-gap: 24px; 
          padding: 24px; 
        }

        .publication-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: inline-block;
          width: 100%; 
          margin-bottom: 24px; 
          position: relative; 
          cursor: pointer;
        }

        .publication-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .publication-card img {
          display: block;
          width: 100%;
          height: auto; 
        }


        @media (max-width: 1024px) {
          .publications-container {
            column-count: 2;
          }
        }

        @media (max-width: 768px) {
          .publications-container {
            column-count: 1;
            padding: 16px; 
          }

          .publication-card {
            margin-bottom: 16px; 
          }
        }
      </style>

      <div class="publications-container"></div>
    `;
  }
}

customElements.define('publication-list', PublicationList); 