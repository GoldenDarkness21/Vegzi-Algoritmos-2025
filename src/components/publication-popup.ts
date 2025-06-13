import { PublicationService } from '../services/publication-service';
import { RecipeService } from '../services/recipe.service';
import { supabase } from '../services/supabase';

export class PublicationPopup extends HTMLElement {
  private publicationService: PublicationService;
  private recipeService: RecipeService;
  private form!: HTMLFormElement;
  private fileInput!: HTMLInputElement;
  private previewContainer!: HTMLDivElement;
  private progressBars: Map<string, HTMLProgressElement> = new Map();

  constructor() {
    super();
    console.log('PublicationPopup: Constructor ejecutado.');
    this.attachShadow({ mode: 'open' });
    this.publicationService = PublicationService.getInstance();
    this.recipeService = RecipeService.getInstance();
  }

  connectedCallback() {
    console.log('PublicationPopup: connectedCallback ejecutado.');
    this.render();
    this.form = this.shadowRoot!.querySelector('form')!;
    this.fileInput = this.shadowRoot!.querySelector('input[type="file"]')!;
    this.previewContainer = this.shadowRoot!.querySelector('.preview-container')!;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    const closeBtn = this.shadowRoot?.querySelector('.close-btn');
    const overlay = this.shadowRoot?.querySelector('.overlay');
    
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    closeBtn?.addEventListener('click', () => this.closePopup());
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) this.closePopup();
    });

    const dropZone = this.shadowRoot?.querySelector('.file-input-container');
    if (dropZone) {
      dropZone.addEventListener('click', () => this.fileInput.click());
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = (e as DragEvent).dataTransfer?.files;
        if (files) this.handleFiles(files);
      });
    }

    this.fileInput.addEventListener('change', (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) this.handleFiles(files);
    });
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const imageFile = formData.get('imagen') as File;
    let imageUrl: string = '';

    if (imageFile && imageFile.size > 0) {
        const filesToUpload = new DataTransfer();
        filesToUpload.items.add(imageFile);
        imageUrl = (await this.handleFiles(filesToUpload.files)) || '';
        if (!imageUrl) {
            console.error("Fallo al obtener la URL de la imagen después de la subida.");
            return;
        }
    } else {
        console.log('No se seleccionó ninguna imagen o el archivo está vacío. La publicación se creará sin imagen.');
    }

    const recipe = {
      image: imageUrl,
      title: formData.get('titulo') as string,
      description: formData.get('descripcion') as string,
      ingredients: (formData.get('ingredientes') as string).split(',').map(i => i.trim()),
      time: formData.get('tiempo') as string,
      calories: parseInt(formData.get('calorias') as string) || 0,
      likes: 0
    };

    try {
      // Guardar en Firestore
      await this.recipeService.createRecipe(recipe);
      
      // Guardar en el servicio de publicaciones (si es necesario)
      this.publicationService.addPublication({
        titulo: recipe.title,
        descripcion: recipe.description,
        imagen: recipe.image,
        tiempo: recipe.time,
        calorias: recipe.calories.toString(),
        ingredientes: recipe.ingredients
      });

      this.closePopup();
      this.dispatchEvent(new CustomEvent('publication-added'));
    } catch (error) {
      console.error('Error al guardar la receta:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }

  private async handleFiles(files: FileList): Promise<string | null> {
    const statusElement = this.shadowRoot?.querySelector('.upload-status');
    if (statusElement) {
      statusElement.textContent = 'Subiendo archivos...';
    }

    if (files.length === 0) {
        if (statusElement) statusElement.textContent = 'No se seleccionaron archivos.';
        return null;
    }

    const file = files[0];

    if (!this.isValidFile(file)) {
        if (statusElement) statusElement.textContent = 'Tipo de archivo no válido.';
        return null;
    }

    const preview = await this.createPreview(file);
    this.previewContainer.innerHTML = '';
    this.previewContainer.appendChild(preview);

    const progressBar = this.createProgressBar();
    this.progressBars.set(file.name, progressBar); 
    preview.appendChild(progressBar);

    try {
        const uploadedImageUrl = await this.uploadFile(file, progressBar);
        if (statusElement) statusElement.textContent = `¡Éxito! Archivo subido correctamente.`;
        return uploadedImageUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        this.showError(preview);
        if (statusElement) statusElement.textContent = `Error al subir archivo.`;
        return null;
    }
  }

  private isValidFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const isValid = validTypes.includes(file.type);
    
    if (!isValid) {
      console.warn(`Tipo de archivo no válido: ${file.type}`);
    }
    
    return isValid;
  }

  private async createPreview(file: File): Promise<HTMLDivElement> {
    const preview = document.createElement('div');
    preview.className = 'preview-item';

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.innerHTML = '×';
    removeButton.onclick = () => preview.remove();
    preview.appendChild(removeButton);

    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      preview.appendChild(img);
    }

    return preview;
  }

  private createProgressBar(): HTMLProgressElement {
    const progressBar = document.createElement('progress');
    progressBar.className = 'progress-bar';
    progressBar.value = 0;
    progressBar.max = 100;
    return progressBar;
  }

  private async uploadFile(file: File, progressBar: HTMLProgressElement): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `recetas/${fileName}`;

    try {
      console.log('Procediendo a subir archivo a bucket "recetas"...');
      const { data, error } = await supabase.storage
        .from('recetas')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error detallado al subir archivo:', error);
        console.error('Detalles del error:', {
          message: error.message,
          name: error.name
        });
        throw error;
      }

      console.log('Archivo subido exitosamente:', data);
      progressBar.value = 100;

      const publicUrl = supabase.storage.from('recetas').getPublicUrl(data.path).data.publicUrl;
      console.log('URL pública del archivo:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error completo al subir archivo:', error);
      throw error;
    }
  }

  private showError(preview: HTMLDivElement) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'Error al subir. Por favor, verifica la consola del navegador para más detalles.';
    preview.appendChild(errorMessage);
  }

  private closePopup() {
    const popup = this.shadowRoot?.querySelector('.popup') as HTMLElement;
    popup.classList.add('closing');
    setTimeout(() => {
      this.remove();
    }, 300);
  }

  render() {
    console.log('PublicationPopup: Render ejecutado.');
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
          /* Temporalmente eliminadas para depuración */
          /* transform: translateY(30px); */
          /* opacity: 0; */
          animation: slideUp 0.4s ease forwards; /* La animación aún puede estar activa */
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

        .file-input-container {
          border: 2px dashed #ccc;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          margin-bottom: 20px;
          transition: background-color 0.3s ease;
        }

        .file-input-container.dragover {
          background-color: #e0f7fa;
          border-color: #007bff;
        }

        .file-input-container p {
          margin: 0;
          color: #666;
        }

        .preview-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }

        .preview-item {
          position: relative;
          width: 100px;
          height: 100px;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }

        .preview-item img, .preview-item video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-button {
          position: absolute;
          top: 5px;
          right: 5px;
          background-color: rgba(255, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .progress-bar {
          width: 100%;
          height: 5px;
          position: absolute;
          bottom: 0;
          left: 0;
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
              <label for="descripcion">Descripción</label>
              <textarea id="descripcion" name="descripcion" rows="4" required></textarea>
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
              <label for="ingredientes">Ingredientes (separados por comas)</label>
              <textarea id="ingredientes" name="ingredientes" rows="3" required></textarea>
            </div>
            <div class="form-group">
              <label for="imagen">Imagen</label>
              <div class="file-input-container">
                <p>Arrastra y suelta tu imagen aquí o haz click para seleccionar</p>
                <input type="file" id="imagen" name="imagen" accept="image/*" style="display: none;">
                <div class="preview-container"></div>
              </div>
              <img id="image-preview" src="#" alt="Previsualización de imagen" style="display: none; max-width: 100%; height: auto; margin-top: 10px;">
            </div>
            <button type="submit">Guardar Receta</button>
          </form>
        </div>
      </div>
    `;
  }
}

customElements.define('publication-popup', PublicationPopup); 