import { PublicationService } from '../services/publication.service';

export class PublicationPopup extends HTMLElement {
  private publicationService: PublicationService;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.publicationService = PublicationService.getInstance();
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    const form = this.shadowRoot?.querySelector('form');
    const closeBtn = this.shadowRoot?.querySelector('.close-btn');
    const overlay = this.shadowRoot?.querySelector('.overlay');
    const imageInput = this.shadowRoot?.querySelector('#imagen') as HTMLInputElement;
    const imagePreview = this.shadowRoot?.querySelector('#image-preview') as HTMLImageElement;

    form?.addEventListener('submit', (e) => this.handleSubmit(e));
    closeBtn?.addEventListener('click', () => this.closePopup());
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) this.closePopup();
    });

    imageInput?.addEventListener('change', (event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
          if (e.target && e.target.result) {
            imagePreview.src = e.target.result as string;
            imagePreview.style.display = 'block';
          }
        };

        reader.readAsDataURL(input.files[0]);
      } else {
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
      }
    });
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const imageFile = formData.get('imagen') as File;
    let imageDataUrl: string = '';

    if (imageFile && imageFile.size > 0) {
      imageDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            resolve(event.target.result as string);
          } else {
            reject(new Error("Failed to read image file"));
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(imageFile);
      });
    }

    const publication = {
      titulo: formData.get('titulo') as string,
      descripcion: formData.get('descripcion') as string,
      imagen: imageDataUrl,
      tiempo: formData.get('tiempo') as string,
      calorias: formData.get('calorias') as string,
      ingredientes: (formData.get('ingredientes') as string).split(',').map(i => i.trim())
    };

    if (!publication.imagen) {
      console.error("No image selected for publication");
      return;
    }

    this.publicationService.addPublication(publication);
    this.closePopup();
    this.dispatchEvent(new CustomEvent('publication-added'));
  }

  private closePopup() {
    const popup = this.shadowRoot?.querySelector('.popup') as HTMLElement;
    popup.classList.add('closing');
    setTimeout(() => {
      this.remove();
    }, 300);
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-in-out;
          padding: 16px;
        }

        .popup {
          background: white;
          border-radius: 24px;
          max-width: 600px;
          width: 100%;
          max-height: 95vh;
          overflow-y: auto;
          box-shadow: 0 12px 30px rgba(0,0,0,0.2);
          font-family: 'Poppins', sans-serif;
          transform: translateY(30px);
          opacity: 0;
          animation: slideUp 0.4s ease forwards;
          position: relative;
        }

        .popup.closing {
          animation: slideDown 0.3s ease forwards;
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #333;
          transition: transform 0.2s ease;
          z-index: 10;
        }

        .close-btn:hover {
          transform: scale(1.2);
        }

        form {
          padding: 32px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        input, textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: rgb(30, 155, 51);
        }

        textarea {
          min-height: 100px;
          resize: vertical;
        }

        button[type="submit"] {
          background-color: rgb(30, 155, 51);
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.3s ease;
          width: 100%;
        }

        button[type="submit"]:hover {
          transform: scale(1.02);
          background-color: rgb(25, 135, 45);
        }

        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(30px);
          }
        }
      </style>

      <div class="overlay">
        <div class="popup">
          <button class="close-btn">&times;</button>
          <form>
            <div class="form-group">
              <label for="titulo">Título</label>
              <input type="text" id="titulo" name="titulo" required>
            </div>
            <div class="form-group">
              <label for="tiempo">Tiempo de preparación</label>
              <input type="text" id="tiempo" name="tiempo" required>
            </div>
            <div class="form-group">
              <label for="calorias">Calorías</label>
              <input type="text" id="calorias" name="calorias" required>
            </div>
            <div class="form-group">
              <label for="descripcion">Descripción</label>
              <textarea id="descripcion" name="descripcion" required></textarea>
            </div>
            <div class="form-group">
              <label for="ingredientes">Ingredientes (separados por comas)</label>
              <textarea id="ingredientes" name="ingredientes" required></textarea>
            </div>
            <div class="form-group">
              <label for="imagen">Seleccionar imagen</label>
              <input type="file" id="imagen" name="imagen" accept="image/*" required>
              <img id="image-preview" src="#" alt="Previsualización de imagen" style="display: none; max-width: 100%; margin-top: 10px; border-radius: 8px;">
            </div>
            <button type="submit">Crear Publicación</button>
          </form>
        </div>
      </div>
    `;
  }
}

customElements.define('publication-popup', PublicationPopup); 