import { UserService } from '../services/user.service'

export class AvatarUpload extends HTMLElement {
    private currentAvatarUrl: string | null = null
    private isUploading: boolean = false

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    static get observedAttributes() {
        return ['avatar-url', 'editable']
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'avatar-url' && newValue !== oldValue) {
            this.currentAvatarUrl = newValue
            this.updateAvatar()
        }
    }

    connectedCallback() {
        this.render()
        this.setupEventListeners()
    }

    private render() {
        if (!this.shadowRoot) return

        const isEditable = this.hasAttribute('editable')

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                }

                .avatar-container {
                    position: relative;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    overflow: hidden;
                    background-color: #f0f0f0;
                    cursor: ${isEditable ? 'pointer' : 'default'};
                }

                .avatar-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .avatar-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #E6F4EA;
                    color: #38A169;
                    font-size: 4rem;
                }

                .edit-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                }

                .avatar-container:hover .edit-overlay {
                    opacity: ${isEditable ? '1' : '0'};
                }

                .edit-icon {
                    color: white;
                    font-size: 2rem;
                }

                input[type="file"] {
                    display: none;
                }

                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s;
                }

                .loading-overlay.show {
                    opacity: 1;
                    pointer-events: all;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #38A169;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error-message {
                    position: absolute;
                    bottom: -30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #FED7D7;
                    color: #742A2A;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    font-size: 0.875rem;
                    white-space: nowrap;
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .error-message.show {
                    opacity: 1;
                }
            </style>

            <div class="avatar-container" id="avatarContainer">
                ${this.currentAvatarUrl ? `
                    <img src="${this.currentAvatarUrl}" alt="Avatar" class="avatar-image" id="avatarImage">
                ` : `
                    <div class="avatar-placeholder" id="avatarPlaceholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                `}
                
                ${isEditable ? `
                    <div class="edit-overlay">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                        </svg>
                    </div>
                ` : ''}
                
                <div class="loading-overlay" id="loadingOverlay">
                    <div class="spinner"></div>
                </div>
            </div>
            
            ${isEditable ? '<input type="file" id="fileInput" accept="image/*">' : ''}
            
            <div class="error-message" id="errorMessage"></div>
        `
    }

    private setupEventListeners() {
        const isEditable = this.hasAttribute('editable')
        if (!isEditable) return

        const avatarContainer = this.shadowRoot?.querySelector('#avatarContainer')
        const fileInput = this.shadowRoot?.querySelector('#fileInput') as HTMLInputElement

        avatarContainer?.addEventListener('click', () => {
            if (!this.isUploading) {
                fileInput?.click()
            }
        })

        fileInput?.addEventListener('change', async (e) => {
            const target = e.target as HTMLInputElement
            if (target.files && target.files[0]) {
                await this.handleFileUpload(target.files[0])
            }
        })
    }

    private async handleFileUpload(file: File) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            this.showError('Por favor selecciona una imagen')
            return
        }

        // Validar tamaño (máximo 2MB para avatares)
        const maxSize = 2 * 1024 * 1024
        if (file.size > maxSize) {
            this.showError('La imagen no debe superar los 2MB')
            return
        }

        this.isUploading = true
        this.showLoading(true)
        this.hideError()

        try {
            const newAvatarUrl = await UserService.updateAvatar(file)
            
            if (newAvatarUrl) {
                this.currentAvatarUrl = newAvatarUrl
                this.updateAvatar()
                
                // Emitir evento de actualización
                this.dispatchEvent(new CustomEvent('avatar-updated', {
                    detail: { url: newAvatarUrl },
                    bubbles: true,
                    composed: true
                }))
            } else {
                this.showError('Error al subir la imagen')
            }
        } catch (error) {
            console.error('Error al subir avatar:', error)
            this.showError('Error inesperado al subir la imagen')
        } finally {
            this.isUploading = false
            this.showLoading(false)
        }
    }

    private updateAvatar() {
        const avatarContainer = this.shadowRoot?.querySelector('.avatar-container')
        if (!avatarContainer) return

        if (this.currentAvatarUrl) {
            const existingImage = avatarContainer.querySelector('.avatar-image') as HTMLImageElement
            if (existingImage) {
                existingImage.src = this.currentAvatarUrl
            } else {
                // Reemplazar placeholder con imagen
                const placeholder = avatarContainer.querySelector('.avatar-placeholder')
                if (placeholder) {
                    placeholder.remove()
                    const img = document.createElement('img')
                    img.src = this.currentAvatarUrl
                    img.alt = 'Avatar'
                    img.className = 'avatar-image'
                    img.id = 'avatarImage'
                    avatarContainer.insertBefore(img, avatarContainer.firstChild)
                }
            }
        }
    }

    private showLoading(show: boolean) {
        const loadingOverlay = this.shadowRoot?.querySelector('#loadingOverlay')
        if (show) {
            loadingOverlay?.classList.add('show')
        } else {
            loadingOverlay?.classList.remove('show')
        }
    }

    private showError(message: string) {
        const errorElement = this.shadowRoot?.querySelector('#errorMessage') as HTMLElement
        if (errorElement) {
            errorElement.textContent = message
            errorElement.classList.add('show')
            
            // Ocultar después de 3 segundos
            setTimeout(() => {
                errorElement.classList.remove('show')
            }, 3000)
        }
    }

    private hideError() {
        const errorElement = this.shadowRoot?.querySelector('#errorMessage')
        errorElement?.classList.remove('show')
    }

    // Método público para actualizar el avatar
    setAvatarUrl(url: string | null) {
        this.currentAvatarUrl = url
        this.updateAvatar()
    }
}

if (!customElements.get('avatar-upload')) {
    customElements.define('avatar-upload', AvatarUpload)
} 