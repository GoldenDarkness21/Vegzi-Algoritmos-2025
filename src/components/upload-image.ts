import { StorageService } from '../services/storage.service'

export class UploadImage extends HTMLElement {
    private file: File | null = null
    private uploadUrl: string | null = null

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        this.render()
        this.setupEventListeners()
    }

    private render() {
        if (!this.shadowRoot) return

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 1rem;
                    font-family: 'Montserrat', sans-serif;
                }

                .upload-container {
                    border: 2px dashed #38A169;
                    border-radius: 8px;
                    padding: 2rem;
                    text-align: center;
                    background-color: #f8f9fa;
                    transition: all 0.3s ease;
                }

                .upload-container.dragover {
                    background-color: #E6F4EA;
                    border-color: #2F855A;
                }

                .upload-container.has-file {
                    border-style: solid;
                    background-color: #E6F4EA;
                }

                input[type="file"] {
                    display: none;
                }

                .upload-label {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    background-color: #38A169;
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    font-weight: 600;
                }

                .upload-label:hover {
                    background-color: #2F855A;
                }

                .file-info {
                    margin-top: 1rem;
                    padding: 1rem;
                    background-color: white;
                    border-radius: 6px;
                    display: none;
                }

                .file-info.show {
                    display: block;
                }

                .preview-image {
                    max-width: 200px;
                    max-height: 200px;
                    margin: 1rem auto;
                    display: block;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .upload-button {
                    margin-top: 1rem;
                    padding: 0.75rem 2rem;
                    background-color: #38A169;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                    transition: background-color 0.3s;
                }

                .upload-button:hover:not(:disabled) {
                    background-color: #2F855A;
                }

                .upload-button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }

                .success-message {
                    margin-top: 1rem;
                    padding: 1rem;
                    background-color: #C6F6D5;
                    color: #22543D;
                    border-radius: 6px;
                    display: none;
                }

                .success-message.show {
                    display: block;
                }

                .error-message {
                    margin-top: 1rem;
                    padding: 1rem;
                    background-color: #FED7D7;
                    color: #742A2A;
                    border-radius: 6px;
                    display: none;
                }

                .error-message.show {
                    display: block;
                }

                .loading {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #38A169;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-left: 0.5rem;
                    vertical-align: middle;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>

            <div class="upload-container" id="dropZone">
                <label for="fileInput" class="upload-label">
                    Seleccionar imagen
                </label>
                <input type="file" id="fileInput" accept="image/*">
                <p>o arrastra y suelta una imagen aquí</p>
                
                <div class="file-info" id="fileInfo">
                    <img id="preview" class="preview-image" alt="Vista previa">
                    <p id="fileName"></p>
                    <p id="fileSize"></p>
                    <button class="upload-button" id="uploadButton">
                        Subir imagen
                    </button>
                </div>

                <div class="success-message" id="successMessage">
                    ¡Imagen subida exitosamente!
                    <p id="uploadedUrl"></p>
                </div>

                <div class="error-message" id="errorMessage">
                    <p id="errorText"></p>
                </div>
            </div>
        `
    }

    private setupEventListeners() {
        const fileInput = this.shadowRoot?.querySelector('#fileInput') as HTMLInputElement
        const dropZone = this.shadowRoot?.querySelector('#dropZone') as HTMLElement
        const uploadButton = this.shadowRoot?.querySelector('#uploadButton') as HTMLButtonElement

        // Selección de archivo
        fileInput?.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement
            if (target.files && target.files[0]) {
                this.handleFile(target.files[0])
            }
        })

        // Drag and drop
        dropZone?.addEventListener('dragover', (e) => {
            e.preventDefault()
            dropZone.classList.add('dragover')
        })

        dropZone?.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover')
        })

        dropZone?.addEventListener('drop', (e) => {
            e.preventDefault()
            dropZone.classList.remove('dragover')
            
            if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
                this.handleFile(e.dataTransfer.files[0])
            }
        })

        // Botón de subida
        uploadButton?.addEventListener('click', () => {
            this.uploadFile()
        })
    }

    private handleFile(file: File) {
        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            this.showError('Por favor selecciona un archivo de imagen')
            return
        }

        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            this.showError('La imagen no debe superar los 5MB')
            return
        }

        this.file = file
        this.showFileInfo(file)
        this.hideMessages()
    }

    private showFileInfo(file: File) {
        const fileInfo = this.shadowRoot?.querySelector('#fileInfo') as HTMLElement
        const fileName = this.shadowRoot?.querySelector('#fileName') as HTMLElement
        const fileSize = this.shadowRoot?.querySelector('#fileSize') as HTMLElement
        const preview = this.shadowRoot?.querySelector('#preview') as HTMLImageElement
        const dropZone = this.shadowRoot?.querySelector('#dropZone') as HTMLElement

        // Mostrar información del archivo
        fileName.textContent = `Archivo: ${file.name}`
        fileSize.textContent = `Tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB`
        
        // Mostrar vista previa
        const reader = new FileReader()
        reader.onload = (e) => {
            preview.src = e.target?.result as string
        }
        reader.readAsDataURL(file)

        fileInfo.classList.add('show')
        dropZone.classList.add('has-file')
    }

    private async uploadFile() {
        if (!this.file) return

        const uploadButton = this.shadowRoot?.querySelector('#uploadButton') as HTMLButtonElement
        uploadButton.disabled = true
        uploadButton.innerHTML = 'Subiendo... <span class="loading"></span>'

        try {
            // Generar un path único para la imagen
            const timestamp = Date.now()
            const extension = this.file.name.split('.').pop()
            const path = `uploads/${timestamp}.${extension}`

            // Subir la imagen
            const result = await StorageService.uploadImage(this.file, path)

            if (result.url) {
                this.uploadUrl = result.url
                this.showSuccess(result.url)
                
                // Emitir evento personalizado con la URL
                this.dispatchEvent(new CustomEvent('image-uploaded', {
                    detail: { url: result.url, file: this.file },
                    bubbles: true,
                    composed: true
                }))
            } else {
                this.showError(result.error?.message || 'Error al subir la imagen')
            }
        } catch (error) {
            this.showError('Error inesperado al subir la imagen')
            console.error(error)
        } finally {
            uploadButton.disabled = false
            uploadButton.textContent = 'Subir imagen'
        }
    }

    private showSuccess(url: string) {
        const successMessage = this.shadowRoot?.querySelector('#successMessage') as HTMLElement
        const uploadedUrl = this.shadowRoot?.querySelector('#uploadedUrl') as HTMLElement
        
        uploadedUrl.innerHTML = `URL: <a href="${url}" target="_blank">${url}</a>`
        successMessage.classList.add('show')
        
        this.hideError()
    }

    private showError(message: string) {
        const errorMessage = this.shadowRoot?.querySelector('#errorMessage') as HTMLElement
        const errorText = this.shadowRoot?.querySelector('#errorText') as HTMLElement
        
        errorText.textContent = message
        errorMessage.classList.add('show')
        
        this.hideSuccess()
    }

    private hideMessages() {
        this.hideSuccess()
        this.hideError()
    }

    private hideSuccess() {
        const successMessage = this.shadowRoot?.querySelector('#successMessage') as HTMLElement
        successMessage?.classList.remove('show')
    }

    private hideError() {
        const errorMessage = this.shadowRoot?.querySelector('#errorMessage') as HTMLElement
        errorMessage?.classList.remove('show')
    }

    // Método público para obtener la URL de la imagen subida
    getUploadedUrl(): string | null {
        return this.uploadUrl
    }
}

if (!customElements.get('upload-image')) {
    customElements.define('upload-image', UploadImage)
} 