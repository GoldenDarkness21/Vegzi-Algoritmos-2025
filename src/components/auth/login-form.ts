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
            const errorDiv = this.shadowRoot.querySelector('.error-message') as HTMLDivElement;
            
            if (button) {
                button.disabled = state.loading;
                button.textContent = state.loading ? 'Iniciando sesión...' : 'Iniciar Sesión';
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
                    errorDiv.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
                }
                
                setTimeout(() => {
                    const event = new CustomEvent('navigate', { 
                        detail: { route: '/' },
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

    .login-container {
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

    .register-link {
        text-align: center;
        margin-top: 2rem;
        font-size: 1.1rem;
    }

    .register-link a {
        color: #2e7d32;
        font-weight: bold;
        text-decoration: none;
    }

    .register-link a:hover {
        text-decoration: underline;
    }

@media (max-width: 768px) {
    .main-container {
        padding: 2rem;
    }

    .login-container {
        padding: 3rem 2rem;
        max-width: 100%;
        border-radius: 35px;
    }

    h2 {
        font-size: 3.5rem;
        margin-bottom: 3rem;
    }

    .form-group {
        margin-bottom: 3rem;
    }

    label {
        font-size: 2rem;
        margin-bottom: 1.5rem;
        display: block;
    }

    input {
        font-size: 1.8rem;
        padding: 1.8rem;
        border-radius: 25px;
        width: 100%;
        height: 5rem;
    }

    button {
        padding: 2rem;
        font-size: 2rem;
        margin-top: 3rem;
        border-radius: 30px;
        height: 5rem;
        width: 100%;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .error-message {
        font-size: 1.6rem;
        margin: 2.5rem 0;
        min-height: 2.5rem;
    }

    .register-link {
        font-size: 1.6rem;
        margin-top: 3rem;
    }
}

@media (max-width: 480px) {
    .login-container {
        padding: 2.5rem 1.8rem;
    }

    h2 {
        font-size: 3.2rem;
    }

    label {
        font-size: 1.8rem;
    }

    input {
        font-size: 1.6rem;
        padding: 1.6rem;
        height: 4.5rem;
    }

    button {
        font-size: 1.8rem;
        padding: 1.8rem;
        height: 4.5rem;
    }
}

</style>

<div class="main-container">
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
            ¿No tienes una cuenta? <a href="#" id="registerLink">Regístrate aquí</a>
        </div>
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
            
            if (!email || !password) {
                const errorDiv = this.shadowRoot?.querySelector('.error-message') as HTMLDivElement;
                if (errorDiv) {
                    errorDiv.style.color = '#f44336';
                    errorDiv.textContent = 'Por favor, completa todos los campos';
                }
                return;
            }

            await loginWithEmailAndPassword(email, password);
        });

        registerLink?.addEventListener('click', (e) => {
            e.preventDefault();
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