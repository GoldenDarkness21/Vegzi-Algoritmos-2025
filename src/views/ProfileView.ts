import './../components/ButtonComponent'
import './../components/IconComponent'
import './../components/avatar-upload'
import { navigateTo } from '../services/router.service'
import { UserService, UserProfile } from '../services/user.service'

class ProfileView extends HTMLElement {
    private userProfile: UserProfile | null = null
    private isLoading: boolean = false

    constructor() {
        super();

        this.attachShadow({mode: "open"})

        this.setAttribute('role', 'button')
    }

    async connectedCallback() {
        if (!this.shadowRoot)
            return

        // Mostrar loading mientras cargamos los datos
        this.showLoading()

        // Cargar datos del usuario
        await this.loadUserProfile()

        // Manejar el caso cuando la ruta es exactamente /profile
        const pathname = document.location.pathname
        const match = /^\/profile\/?(.*)$/.exec(pathname)
        const subPath = match ? match[1] : ''

        const postsContent = `
            <div class="posts-content">
                <ul>
                    <li>
                        <img src="${this.userProfile?.photoURL || '/images/profile.jpg'}">

                        <div class="postContent">
                        <span> Healthy and delicious lunch, nothing like enjoying a nutritious meal.</span>
                        </div>
                    </li>

                    <li>
                        <img src="${this.userProfile?.photoURL || '/images/profile.jpg'}">

                        <div class="postContent">
                        <span>Please tell me what you had for dinner today. I need inspiration.</span>
                        </div>
                    </li>

                    <li>
                        <img src="${this.userProfile?.photoURL || '/images/profile.jpg'}">

                        <div class="postContent">
                        <span>I want to show you this healthy breakfast option to start the morning with energy.</span>
                        </div>
                    </li>

                    <li>
                        <img src="${this.userProfile?.photoURL || '/images/profile.jpg'}">

                        <div class="postContent">
                        <span>I want to show you this healthy breakfast option to start the morning with energy.</span>
                        </div>
                    </li>

                    <li>
                        <img src="${this.userProfile?.photoURL || '/images/profile.jpg'}">

                        <div class="postContent">
                        <span> Healthy and delicious lunch, nothing like enjoying a nutritious meal.</span>
                        </div>
                    </li>

                    <li>
                        <img src="${this.userProfile?.photoURL || '/images/profile.jpg'}">

                        <div class="postContent">
                        <span>Please tell me what you had for dinner today. I need inspiration.</span>
                        </div>
                    </li>

                </ul>
            </div>
        `

        const likesContent = `
            <div class="likes-content">
            <ul>
            <li><img src="/images/ensaladas.jpg"><div><icon-component icon="heart"></icon-component></div></li>
            <li><img src="/images/frutas.jpg"><div><icon-component icon="heart"></icon-component></div></li>
            <li><img src="/images/granola.jpg"><div><icon-component icon="heart"></icon-component></div></li>
            <li><img src="/images/pepino.jpg"><div><icon-component icon="heart"></icon-component></div></li>
            <li><img src="/images/sandia.jpg"><div><icon-component icon="heart"></icon-component></div></li>
            <li><img src="/images/ensaladas.jpg"><div><icon-component icon="heart"></icon-component></div></li>
            <li><img src="/images/granola.jpg"><div><icon-component icon="heart"></icon-component></div></li>
</ul>
</div>
        `

        const mainContent = `
        <div class="content">
            <div class="p-view">
                <avatar-upload 
                    avatar-url="${this.userProfile?.photoURL || ''}"
                    id="profileAvatar"
                ></avatar-upload>

                <div>
                    <h2>${this.userProfile?.name || 'Usuario'}</h2>
                    <span><b>24</b> Posts</span>
                </div>

                <div class="buttons">
                    <a href="/profile/settings" data-route="/profile/settings"><button-component prepend-icon="pencil">Profile settings</button-component></a>
                    <button-component prepend-icon="plus">Upload recipe</button-component>
                </div>
            </div>

            <div class="posts-container">
                <nav>
                    <ul>
                        <li class="${/likes/.test(subPath)? '' : 'selected'}"><a href="/profile/posts" data-route="/profile/posts"><span>Posts</span><hr></a></li>
                        <li class="${/likes/.test(subPath)? 'selected' : ''}"><a href="/profile/likes" data-route="/profile/likes"><span>Likes</span><hr></a></li>
                    </ul>
                </nav>

                ${/likes/.test(subPath)? likesContent : postsContent }
            </div>
        </div>
        `

        const settingContent = `
        <div class="settings-content">
            <div class="p-view">
                <avatar-upload 
                    avatar-url="${this.userProfile?.photoURL || ''}"
                    editable
                    id="settingsAvatar"
                ></avatar-upload>

                <form action="" id="profileForm">
                    <div class="field">
                        <span>Name</span>
                        <input type="text" name="name" id="name-input" value="${this.userProfile?.name || ''}">
                    </div>
                    <div class="field">
                        <span>Email</span>
                        <input type="email" name="email" id="email-input" value="${this.userProfile?.email || ''}" readonly>
                    </div>
                    <div class="field">
                        <span>New Password (leave blank to keep current)</span>
                        <input type="password" name="password" id="password-input" placeholder="Enter new password">
                    </div>

                    <button-component id="saveButton">Save</button-component>
                    
                    <div class="message success-message" id="successMessage">
                        Profile updated successfully!
                    </div>
                    
                    <div class="message error-message" id="errorMessage">
                        <span id="errorText"></span>
                    </div>
                </form>

            </div>
        </div>
        `

        this.shadowRoot.innerHTML = `
        <style>
        :host {
            display: flex;
            position: relative;
            height: 100dvh;
            width: 100%;
            justify-content: center;

            --app-bar-height: 60px;

            font-family: Montserrat;

            user-select: none;

            * {
                font-family: inherit;
                /*font-weight: inherit;*/
            }

            a {
                text-decoration: none;
                color: inherit;
            }

            .decorator-bg {
                background-color: #E6F4EA;
                position: absolute;
                height: 200px;
                width: 100%;
                z-index: -1;
        }
        
            .content {
                width: 100%;
                max-width: 1150px;
                padding: 1rem;
                padding-top: calc(var(--app-bar-height) + 3rem);
                display: grid;
                grid-template-columns: 300px 1fr;
                height: 100%;
                gap: 2rem;

                > .p-view {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;

                    > div {
                        display: flex;
                        justify-content: center;
                    }

                    h2, span {
            text-align: center;
        }
        
                    > img {
                        width: 200px;
                        height: 200px;
                        border-radius: 50%;
                        object-fit: cover;
                    }

                    .buttons {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        width: 100%;
                    }
                }

                .posts-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;

                    nav {
                        ul {
                            display: flex;
                            list-style: none;
                            padding: 0;
                            margin: 0;
                            gap: 2rem;

                            li {
                                position: relative;
                                font-weight: 600;
                                font-size: 1.2rem;
                                color: #666;
                                cursor: pointer;

                                &.selected {
                                    color: #000;
                                }

                                hr {
                                    position: absolute;
                                    bottom: -0.5rem;
                                    left: 0;
                                    width: 100%;
                                    height: 3px;
                                    background-color: #38A169;
                                    border: none;
                                    margin: 0;
                                    opacity: 0;
                                    transition: opacity 0.3s;
                                }

                                &.selected hr {
                                    opacity: 1;
                                }
                            }
                        }
                    }

                    .posts-content {
                        ul {
                            list-style: none;
                            padding: 0;
                            margin: 0;
                            display: flex;
                            flex-direction: column;
                            gap: 1rem;

                            li {
                                display: flex;
                                gap: 1rem;
                                padding: 1rem;
                                background-color: #f5f5f5;
                                border-radius: 8px;

                                img {
                                    width: 50px;
                                    height: 50px;
            border-radius: 50%;
            object-fit: cover;
        }
        
                                .postContent {
                                    flex: 1;
            display: flex;
                                    align-items: center;
                                }
                            }
                        }
                    }

                    .likes-content {
                        ul {
                            list-style: none;
                            padding: 0;
                            margin: 0;
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;

                            li {
                                position: relative;
                                aspect-ratio: 1;
                                overflow: hidden;
                                border-radius: 8px;
                                cursor: pointer;

                                img {
                                    width: 100%;
                                    height: 100%;
                                    object-fit: cover;
                                }

                                div {
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 100%;
                                    height: 100%;
                                    background: rgba(0, 0, 0, 0.5);
                                    display: flex;
                                    align-items: center;
            justify-content: center;
                                    opacity: 0;
                                    transition: opacity 0.3s;

                                    icon-component {
                                        color: white;
                                        font-size: 2rem;
                                    }
                                }

                                &:hover div {
                                    opacity: 1;
                                }
                            }
                        }
                    }
                }
        }
        
            .settings-content {
                width: 100%;
                max-width: 600px;
                padding: 1rem;
                padding-top: calc(var(--app-bar-height) + 3rem);
                margin: 0 auto;

                .p-view {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;

                    .profile-img {
                        position: relative;
                        width: 200px;
                        height: 200px;
                        margin: 0 auto;

                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                            object-fit: cover;
                        }

                        icon-component {
                            position: absolute;
                            bottom: 10px;
                            right: 10px;
                            background-color: #38A169;
            color: white;
                            padding: 0.5rem;
                            border-radius: 50%;
                            cursor: pointer;
                        }
                    }

                    form {
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;

                        .field {
                            display: flex;
                            flex-direction: column;
                            gap: 0.5rem;

                            span {
                                font-weight: 600;
                                color: #333;
        }
        
                            input {
                                padding: 0.75rem;
                                border: 1px solid #ddd;
                                border-radius: 4px;
                                font-size: 1rem;
                                transition: border-color 0.3s;

                                &:focus {
                                    outline: none;
                                    border-color: #38A169;
        }
                            }
                        }

                        button-component {
                            align-self: flex-end;
                        }

                        .message {
                            padding: 1rem;
                            border-radius: 6px;
                            margin-top: 1rem;
                            display: none;
                            text-align: center;
                        }

                        .success-message {
                            background-color: #C6F6D5;
                            color: #22543D;
                        }

                        .error-message {
                            background-color: #FED7D7;
                            color: #742A2A;
                        }
                    }
                }
            }

            @media (max-width: 768px) {
                .content {
                    grid-template-columns: 1fr;
                    padding-top: calc(var(--app-bar-height) + 1rem);

                    > .p-view {
                        flex-direction: row;
                        gap: 1rem;

                        > img {
                            width: 100px;
                            height: 100px;
        }
        
                        > div {
                            flex-direction: column;
                            align-items: flex-start;
                        }

                        .buttons {
                            flex-direction: row;
                        }
                    }
                }
            }
        }
        </style>
        
        <div class="decorator-bg"></div>
        ${/settings/.test(subPath)? settingContent : mainContent }
         `;
         
         // Configurar event listeners para navegación SPA
         this.setupEventListeners();
         
         // Si estamos en settings, configurar los handlers del formulario
         if (/settings/.test(subPath)) {
             this.setupFormHandlers();
         }
     }
     
     private setupEventListeners() {
         // Interceptar clicks en enlaces con data-route
         const links = this.shadowRoot?.querySelectorAll('a[data-route]');
         links?.forEach(link => {
             link.addEventListener('click', (e) => {
                 e.preventDefault();
                 const route = (e.currentTarget as HTMLElement).getAttribute('data-route');
                 if (route) {
                     navigateTo(route);
                 }
             });
         });
         
         // Escuchar cambios de ruta para actualizar el contenido
         const routeChangeHandler = () => {
             // Re-renderizar cuando cambie la ruta
             this.connectedCallback();
         };
         
         // Remover listener anterior si existe
         document.removeEventListener('route-changed', routeChangeHandler);
         // Agregar nuevo listener
         document.addEventListener('route-changed', routeChangeHandler);
     }
     
     disconnectedCallback() {
         // Limpiar event listeners cuando el componente se desmonte
         document.removeEventListener('route-changed', this.connectedCallback);
     }

    private async loadUserProfile() {
        try {
            this.userProfile = await UserService.getCurrentUserProfile();
        } catch (error) {
            console.error('Error al cargar el perfil del usuario:', error);
        }
    }

    private showLoading() {
        if (!this.shadowRoot) return;
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .loading {
                    text-align: center;
                }
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #38A169;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            <div class="loading">
                <div class="spinner"></div>
                <p>Cargando perfil...</p>
            </div>
        `;
    }

    private setupFormHandlers() {
        // Manejar el formulario de settings
        const form = this.shadowRoot?.querySelector('#profileForm') as HTMLFormElement;
        const saveButton = this.shadowRoot?.querySelector('#saveButton');
        const settingsAvatar = this.shadowRoot?.querySelector('#settingsAvatar') as any;

        // Escuchar cambios en el avatar
        settingsAvatar?.addEventListener('avatar-updated', (e: CustomEvent) => {
            console.log('Avatar actualizado:', e.detail.url);
            // Actualizar también el avatar en la vista principal si está visible
            const profileAvatar = this.shadowRoot?.querySelector('#profileAvatar') as any;
            if (profileAvatar) {
                profileAvatar.setAvatarUrl(e.detail.url);
            }
        });

        // Manejar el submit del formulario
        saveButton?.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.handleFormSubmit();
        });
    }

    private async handleFormSubmit() {
        const nameInput = this.shadowRoot?.querySelector('#name-input') as HTMLInputElement;
        const passwordInput = this.shadowRoot?.querySelector('#password-input') as HTMLInputElement;
        const saveButton = this.shadowRoot?.querySelector('#saveButton') as any;
        const successMessage = this.shadowRoot?.querySelector('#successMessage') as HTMLElement;
        const errorMessage = this.shadowRoot?.querySelector('#errorMessage') as HTMLElement;
        const errorText = this.shadowRoot?.querySelector('#errorText') as HTMLElement;

        // Deshabilitar el botón mientras se guarda
        if (saveButton) {
            saveButton.setAttribute('disabled', 'true');
            saveButton.textContent = 'Saving...';
        }

        try {
            // Actualizar nombre si cambió
            if (nameInput.value !== this.userProfile?.name) {
                const updatedProfile = await UserService.updateProfile({ name: nameInput.value });
                if (updatedProfile) {
                    this.userProfile = updatedProfile;
                }
            }

            // Actualizar contraseña si se proporcionó
            if (passwordInput.value) {
                const passwordUpdated = await UserService.updatePassword(passwordInput.value);
                if (!passwordUpdated) {
                    throw new Error('Failed to update password');
                }
                passwordInput.value = ''; // Limpiar el campo
            }

            // Mostrar mensaje de éxito
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';

            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);

        } catch (error) {
            // Mostrar mensaje de error
            errorText.textContent = error instanceof Error ? error.message : 'Error updating profile';
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
        } finally {
            // Rehabilitar el botón
            if (saveButton) {
                saveButton.removeAttribute('disabled');
                saveButton.textContent = 'Save';
            }
        }
    }
}

if (!customElements.get('profile-view')) {
    customElements.define('profile-view', ProfileView);
}