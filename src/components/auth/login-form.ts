import { loginWithEmailAndPassword } from '../../flux/actions/auth.actions';
import { authStore } from '../../flux/store/auth.store';
import { AuthState } from '../../flux/types/auth.types';

class LoginForm extends HTMLElement {
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
            const button = this.shadowRoot.querySelector('button');
            const errorDiv = this.shadowRoot.querySelector('.error-message');
            
            if (button) {
                button.disabled = state.loading;
                button.textContent = state.loading ? 'Iniciando sesión...' : 'Iniciar Sesión';
            }

            if (errorDiv) {
                errorDiv.textContent = state.error || '';
            }

            if (state.isAuthenticated) {
                // Aquí puedo redirigir al usuario o mostrar un mensaje de éxito
                console.log('Usuario autenticado:', state.user);
                // Por ejemplo: window.location.href = '/dashboard';
            }
        }
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background-color: #f5f5f5;
                        font-family: Arial, sans-serif;
                    }

                    .login-container {
                        background: white;
                        padding: 2rem;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        width: 100%;
                        max-width: 400px;
                    }

                    h2 {
                        color: #333;
                        text-align: center;
                        margin-bottom: 1.5rem;
                    }

                    .form-group {
                        margin-bottom: 1rem;
                    }

                    label {
                        display: block;
                        margin-bottom: 0.5rem;
                        color: #666;
                    }

                    input {
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 1rem;
                        box-sizing: border-box;
                    }

                    button {
                        width: 100%;
                        padding: 0.75rem;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }

                    button:hover:not(:disabled) {
                        background-color: #45a049;
                    }

                    button:disabled {
                        background-color: #cccccc;
                        cursor: not-allowed;
                    }

                    .register-link {
                        text-align: center;
                        margin-top: 1rem;
                    }

                    .register-link a {
                        color: #4CAF50;
                        text-decoration: none;
                    }

                    .register-link a:hover {
                        text-decoration: underline;
                    }

                    .error-message {
                        color: #f44336;
                        text-align: center;
                        margin-top: 1rem;
                        min-height: 20px;
                    }
                </style>
                <div class="login-container">
                    <h2>Iniciar Sesión</h2>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="email">Correo electrónico</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <input type="password" id="password" required>
                        </div>
                        <button type="submit">Iniciar Sesión</button>
                    </form>
                    <div class="error-message"></div>
                    <div class="register-link">
                        <p>¿No tienes una cuenta? <a href="#" id="registerLink">Regístrate aquí</a></p>
                    </div>
                </div>
            `;

            this.addEventListeners();
        }
    }

    addEventListeners() {
        const form = this.shadowRoot?.querySelector('#loginForm');
        const registerLink = this.shadowRoot?.querySelector('#registerLink');

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = (this.shadowRoot?.querySelector('#email') as HTMLInputElement).value;
            const password = (this.shadowRoot?.querySelector('#password') as HTMLInputElement).value;
            
            await loginWithEmailAndPassword(email, password);
        });

        registerLink?.addEventListener('click', (e) => {
            e.preventDefault();
            // Aquí implementar la navegación al registro
            const event = new CustomEvent('navigate', { 
                detail: { route: '/register' },
                bubbles: true, 
                composed: true 
            });
            this.dispatchEvent(event);
        });
    }
}

if (!customElements.get('login-form')) {
    customElements.define('login-form', LoginForm);
} 