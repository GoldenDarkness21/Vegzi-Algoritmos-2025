import { registerWithEmailAndPassword } from '../../flux/actions/auth.actions';
import { authStore } from '../../flux/store/auth.store';
import { AuthState } from '../../flux/types/auth.types';

class RegisterForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupStoreSubscription();
    }

    disconnectedCallback() {
        // Cleanup subscription if needed
    }

    private setupStoreSubscription() {
        authStore.subscribe((state: AuthState) => {
            this.updateUIState(state);
        });
    }

    private updateUIState(state: AuthState) {
        if (this.shadowRoot) {
            const submitButton = this.shadowRoot.querySelector('#submitRegisterButton') as HTMLButtonElement;
            const errorDiv = this.shadowRoot.querySelector('.error-message') as HTMLDivElement;
            
            if (submitButton) {
                submitButton.disabled = state.loading;
                submitButton.textContent = state.loading ? 'Registrando...' : 'Registrarse';
            }

            if (errorDiv) {
                if (state.error) {
                    errorDiv.style.color = '#f44336';
                    errorDiv.textContent = state.error;
                    if (submitButton) {
                        submitButton.disabled = false;
                    }
                } else {
                    errorDiv.textContent = '';
                }
            }

            if (state.isAuthenticated && state.user && !state.error && !state.loading) {
                if (errorDiv) {
                    errorDiv.style.color = '#4CAF50';
                    errorDiv.textContent = '¡Registro exitoso! Redirigiendo al login...';
                }
                
                setTimeout(() => {
                    const event = new CustomEvent('navigate', { 
                        detail: { route: '/login' },
                        bubbles: true, 
                        composed: true 
                    });
                    this.dispatchEvent(event);
                }, 1000);
            }
        }
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <style>
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                :host,
                body {
                    height: 100vh;
                    width: 100vw;
                    font-family: 'Segoe UI', sans-serif;
                }

                .main-container {
                    display: flex;
                    min-height: 100vh;
                    width: 100%;
                    background: #b7e2b1; /* Color de fondo general */
                    padding: 2rem;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    gap: 0; /* Eliminar el gap por defecto para controlar el espaciado con los paneles */
                }

                .form-wrapper {
                    display: flex;
                    border-radius: 25px;
                    box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
                    overflow: hidden; /* Para contener los bordes redondeados de los hijos */
                    max-width: 1050px; /* Ajusta el ancho máximo del contenedor general */
                    width: 100%;
                }

                .close-button {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: #ffffff;
                    border: none;
                    cursor: pointer;
                    width: 2.5rem;
                    height: 2.5rem;
                    padding: 0;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    z-index: 10;
                }

                .close-button:hover {
                    background-color: #f0f0f0;
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }

                .close-button svg {
                    width: 1.2rem;
                    height: 1.2rem;
                    fill: #2e7d32;
                }

                .left-panel {
                    flex: 1;
                    background-color: white;
                    border-radius: 25px 0 0 25px; /* Bordes redondeados solo a la izquierda */
                    padding: 3.5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    /* box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2); */ /* Sombra movida a .form-wrapper */
                    max-width: 500px; /* Ajusta según sea necesario */
                    min-height: 550px; /* Asegura que tenga una altura mínima para coincidir con el formulario */
                    position: relative;
                    overflow: hidden; /* Para las hojas */
                }

                .mascot-image {
                    max-width: 80%;
                    height: auto;
                    margin-bottom: 1.5rem;
                }

                .vegzi-title {
                    font-size: 5rem;
                    font-weight: bold;
                    color: #4CAF50;
                    margin: 0;
                    line-height: 1;
                    z-index: 1; /* Asegura que el título esté sobre las hojas */
                }

                .leaf-decoration {
                    position: absolute;
                    width: 100px; /* Ajusta el tamaño de la hoja */
                    height: auto;
                    z-index: 0;
                    opacity: 0.8;
                }

                .leaf-top {
                    top: 10%;
                    right: 15%;
                    transform: rotate(30deg);
                }

                .leaf-bottom {
                    bottom: 10%;
                    left: 15%;
                    transform: rotate(-45deg);
                }

                .register-container {
                    flex: 1;
                    width: 100%;
                    max-width: 550px; /* Ajusta según sea necesario */
                    background: #dcf6d5; /* Color del formulario */
                    padding: 3.5rem;
                    border-radius: 0 25px 25px 0; /* Bordes redondeados solo a la derecha */
                    /* box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2); */ /* Sombra movida a .form-wrapper */
                    display: flex; /* Para centrar contenido dentro */
                    flex-direction: column;
                    justify-content: center;
                    min-height: 550px; /* Asegura que tenga una altura mínima para coincidir con el panel izquierdo */
                }

                h2 {
                    color: #2e7d32;
                    text-align: center;
                    margin-bottom: 2rem;
                    font-size: 2.5rem;
                    font-weight: bold;
                }

                .form-group {
                    margin-bottom: 2rem;
                }

                label {
                    display: block;
                    margin-bottom: 0.8rem;
                    color: #33691e;
                    font-weight: bold;
                    font-size: 1.2rem;
                }

                input {
                    width: 100%;
                    padding: 1.2rem;
                    border: none;
                    border-radius: 15px;
                    background-color: #edf9e9;
                    font-size: 1.2rem;
                    box-shadow: inset 2px 2px 6px rgba(0, 0, 0, 0.1);
                    outline: none;
                }

                button {
                    width: 100%;
                    padding: 1.2rem;
                    background-color: #4caf50;
                    color: white;
                    border: none;
                    border-radius: 15px;
                    font-size: 1.3rem;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
                    transition: background-color 0.3s ease, transform 0.2s ease;
                    margin-top: 2rem;
                }

                button:hover:not(:disabled) {
                    background-color: #388e3c;
                    transform: translateY(-2px);
                }

                .error-message {
                    color: #d32f2f;
                    text-align: center;
                    margin: 1.5rem 0;
                    font-size: 1.1rem;
                    min-height: 24px;
                }

                .login-link {
                    text-align: center;
                    margin-top: 2rem;
                    font-size: 1.1rem;
                }

                .login-link a {
                    color: #2e7d32;
                    font-weight: bold;
                    text-decoration: none;
                }

                .login-link a:hover {
                    text-decoration: underline;
                }

                @media (max-width: 900px) {
                    .form-wrapper {
                        flex-direction: column;
                        border-radius: 25px;
                        max-width: 550px; /* Ajusta para móviles */
                    }

                    .left-panel {
                        border-radius: 25px 25px 0 0;
                        max-width: 100%;
                        width: 100%;
                        padding: 2rem;
                        min-height: unset; /* Reiniciar altura mínima en móvil */
                        /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */ /* Sombra movida a .form-wrapper */
                    }

                    .register-container {
                        border-radius: 0 0 25px 25px;
                        max-width: 100%;
                        width: 100%;
                        padding: 2rem;
                        min-height: unset; /* Reiniciar altura mínima en móvil */
                        /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */ /* Sombra movida a .form-wrapper */
                    }

                    .vegzi-title {
                        font-size: 3.5rem;
                    }

                    .mascot-image {
                        max-width: 60%;
                        margin-bottom: 1rem;
                    }

                    .leaf-decoration {
                        width: 70px;
                    }

                    .close-button {
                        top: 1rem;
                        right: 1rem;
                    }
                }

                @media (max-width: 480px) {
                    .main-container {
                        padding: 0.5rem;
                    }

                    .form-wrapper {
                        max-width: 100%;
                    }

                    .left-panel,
                    .register-container {
                        padding: 1.5rem;
                    }

                    h2 {
                        font-size: 2rem;
                        margin-bottom: 1.5rem;
                    }

                    input {
                        font-size: 1rem;
                        padding: 1rem;
                    }

                    button {
                        padding: 1rem;
                        font-size: 1.1rem;
                        margin-top: 1.5rem;
                    }

                    .error-message {
                        font-size: 0.9rem;
                        margin: 1rem 0;
                    }

                    .login-link {
                        font-size: 0.9rem;
                        margin-top: 1rem;
                    }

                    .vegzi-title {
                        font-size: 3rem;
                    }

                    .mascot-image {
                        max-width: 70%;
                    }
                }

            </style>
            <div class="main-container">
                <button class="close-button" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                </button>
                <div class="form-wrapper">
                    <div class="left-panel">
                        <img src="/images/vegzi-mascot.png" alt="Vegzi Mascot" class="mascot-image">
                        <h1 class="vegzi-title">Vegzi</h1>
                        <img src="/images/leaf-1.png" alt="Leaf Decoration" class="leaf-decoration leaf-top">
                        <img src="/images/leaf-2.png" alt="Leaf Decoration" class="leaf-decoration leaf-bottom">
                    </div>
                    <div class="register-container">
                        <h2>Sign Up</h2>
                        <div class="error-message"></div>
                        <form id="registerForm">
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" id="name" name="name" placeholder="Enter your name" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" placeholder="Enter your email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" id="password" name="password" placeholder="Enter your password" required>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm Password</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required>
                            </div>
                            <button type="submit" id="submitRegisterButton">Registrarse</button>
                        </form>
                        <p class="login-link">Already have an account? <a href="/login" data-route="/login">Login here</a></p>
                    </div>
                </div>
            </div>
            `;

            this.addEventListeners();
            
            // Obtener el estado inicial
            const currentState = authStore.getState();
            this.updateUIState(currentState);
        }
    }

    addEventListeners() {
        const form = this.shadowRoot?.querySelector('#registerForm');
        form?.addEventListener('submit', this.handleRegister.bind(this));

        const closeButton = this.shadowRoot?.querySelector('.close-button');
        closeButton?.addEventListener('click', () => {
            window.history.pushState({}, '', '/');
            const navigateEvent = new CustomEvent('navigate', { 
                detail: { route: '/' },
                bubbles: true, 
                composed: true 
            });
            this.dispatchEvent(navigateEvent);
            const appContainer = document.querySelector('app-container') as any;
            if (appContainer && typeof appContainer.updateNavbar === 'function') {
                appContainer.updateNavbar();
            }
        });

        const loginLink = this.shadowRoot?.querySelector('.login-link a');
        loginLink?.addEventListener('click', (e) => {
            e.preventDefault();
            const event = new CustomEvent('navigate', {
                detail: { route: '/login' },
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(event);
        });
    }

    private handleRegister(event: Event) {
        event.preventDefault();
        const nameInput = this.shadowRoot?.querySelector('#name') as HTMLInputElement;
        const emailInput = this.shadowRoot?.querySelector('#email') as HTMLInputElement;
        const passwordInput = this.shadowRoot?.querySelector('#password') as HTMLInputElement;
        const confirmPasswordInput = this.shadowRoot?.querySelector('#confirmPassword') as HTMLInputElement;
        const errorDiv = this.shadowRoot?.querySelector('.error-message') as HTMLDivElement;

        if (nameInput && emailInput && passwordInput && confirmPasswordInput && errorDiv) {
            const name = nameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (password !== confirmPassword) {
                errorDiv.style.color = '#f44336';
                errorDiv.textContent = 'Las contraseñas no coinciden';
                return;
            } else {
                errorDiv.textContent = ''; // Limpiar mensaje de error si las contraseñas coinciden
            }

            registerWithEmailAndPassword(name, email, password);
        }
    }
}

if (!customElements.get('register-form')) {
    customElements.define('register-form', RegisterForm);
} 