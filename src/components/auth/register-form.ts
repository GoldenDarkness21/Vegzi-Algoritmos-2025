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
            const button = this.shadowRoot.querySelector('button');
            const errorDiv = this.shadowRoot.querySelector('.error-message') as HTMLDivElement;
            
            if (button) {
                button.disabled = state.loading;
                button.textContent = state.loading ? 'Registrando...' : 'Registrarse';
            }

            if (errorDiv) {
                if (state.error) {
                    errorDiv.style.color = '#f44336';
                    errorDiv.textContent = state.error;
                    if (button) {
                        button.disabled = false;
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
                    background: #b7e2b1;
                    padding: 2rem;
                    align-items: center;
                    justify-content: center;
                }

                .register-container {
                    width: 100%;
                    max-width: 550px;
                    background: #dcf6d5;
                    padding: 3.5rem;
                    border-radius: 25px;
                    box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
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

                @media (max-width: 768px) {
                    .main-container {
                        padding: 1rem;
                    }

                    .register-container {
                        padding: 2rem;
                        max-width: 100%;
                    }

                    h2 {
                        font-size: 2.2rem;
                        margin-bottom: 1.8rem;
                    }

                    .form-group {
                        margin-bottom: 1.5rem;
                    }

                    input {
                        font-size: 1.1rem;
                        padding: 1rem;
                    }

                    button {
                        padding: 1rem;
                        font-size: 1.2rem;
                        margin-top: 1.5rem;
                    }

                    .error-message {
                        font-size: 1rem;
                        margin: 1.2rem 0;
                    }

                    .login-link {
                        font-size: 1rem;
                        margin-top: 1.5rem;
                    }
                }
            </style>

            <div class="main-container">
                <div class="register-container">
                    <h2>Crear Cuenta</h2>
                    <form id="registerForm">
                        <div class="form-group">
                            <label for="name">Nombre completo</label>
                            <input type="text" id="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Correo electrónico</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <input type="password" id="password" required>
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirmar contraseña</label>
                            <input type="password" id="confirmPassword" required>
                        </div>
                        <button type="submit">Registrarse</button>
                    </form>
                    <div class="error-message"></div>
                    <div class="login-link">
                        ¿Ya tienes una cuenta? <a href="#" id="loginLink">Inicia sesión aquí</a>
                    </div>
                </div>
            </div>
            `;

            this.addEventListeners();
        }
    }

    addEventListeners() {
        const form = this.shadowRoot?.querySelector('#registerForm');
        const loginLink = this.shadowRoot?.querySelector('#loginLink');

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = (this.shadowRoot?.querySelector('#name') as HTMLInputElement).value;
            const email = (this.shadowRoot?.querySelector('#email') as HTMLInputElement).value;
            const password = (this.shadowRoot?.querySelector('#password') as HTMLInputElement).value;
            const confirmPassword = (this.shadowRoot?.querySelector('#confirmPassword') as HTMLInputElement).value;
            
            const errorDiv = this.shadowRoot?.querySelector('.error-message') as HTMLDivElement;

            if (!name || !email || !password || !confirmPassword) {
                if (errorDiv) {
                    errorDiv.style.color = '#f44336';
                    errorDiv.textContent = 'Por favor, completa todos los campos';
                }
                return;
            }

            if (password !== confirmPassword) {
                if (errorDiv) {
                    errorDiv.style.color = '#f44336';
                    errorDiv.textContent = 'Las contraseñas no coinciden';
                }
                return;
            }

            await registerWithEmailAndPassword(name, email, password);
        });

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
}

if (!customElements.get('register-form')) {
    customElements.define('register-form', RegisterForm);
} 