import { authStore } from '../../flux/store/auth.store';
import { AuthState } from '../../flux/types/auth.types';
import { logoutUser } from '../../flux/actions/auth.actions';

export class Navbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.setupStoreSubscription();
    }

    private setupStoreSubscription() {
        authStore.subscribe((state: AuthState) => {
            this.updateUIState(state);
        });
    }

    private updateUIState(state: AuthState) {
        if (this.shadowRoot) {
            const authButtons = this.shadowRoot.querySelector('.auth-buttons');
            if (authButtons) {
                if (state.isAuthenticated && state.user) {
                    authButtons.innerHTML = `
                        <button class="logout-btn">Cerrar Sesión</button>
                    `;
                    const logoutBtn = authButtons.querySelector('.logout-btn');
                    logoutBtn?.addEventListener('click', async () => {
                        await logoutUser();
                        const event = new CustomEvent('navigate', { 
                            detail: { route: '/login' },
                            bubbles: true, 
                            composed: true 
                        });
                        this.dispatchEvent(event);
                    });
                } else {
                    authButtons.innerHTML = `
                        <button class="login-btn">Iniciar Sesión</button>
                        <button class="register-btn">Registrarse</button>
                    `;
                    this.addAuthButtonsListeners();
                }
            }
        }
    }

    private addAuthButtonsListeners() {
        const loginBtn = this.shadowRoot?.querySelector('.login-btn');
        const registerBtn = this.shadowRoot?.querySelector('.register-btn');

        loginBtn?.addEventListener('click', () => {
            const event = new CustomEvent('navigate', { 
                detail: { route: '/login' },
                bubbles: true, 
                composed: true 
            });
            this.dispatchEvent(event);
        });

        registerBtn?.addEventListener('click', () => {
            const event = new CustomEvent('navigate', { 
                detail: { route: '/register' },
                bubbles: true, 
                composed: true 
            });
            this.dispatchEvent(event);
        });
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        width: 100%;
                        background-color: #4caf50;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }

                    .navbar {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 1rem 2rem;
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    .logo {
                        color: white;
                        font-size: 1.5rem;
                        font-weight: bold;
                        text-decoration: none;
                        cursor: pointer;
                    }

                    .auth-buttons {
                        display: flex;
                        gap: 1rem;
                    }

                    button {
                        padding: 0.5rem 1rem;
                        border: none;
                        border-radius: 8px;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }

                    .login-btn {
                        background-color: transparent;
                        color: white;
                        border: 2px solid white;
                    }

                    .login-btn:hover {
                        background-color: white;
                        color: #4caf50;
                    }

                    .register-btn {
                        background-color: white;
                        color: #4caf50;
                    }

                    .register-btn:hover {
                        background-color: #e8f5e9;
                    }

                    .logout-btn {
                        background-color: #e53935;
                        color: white;
                        border: none;
                    }

                    .logout-btn:hover {
                        background-color: #c62828;
                    }

                    @media (max-width: 768px) {
                        .navbar {
                            padding: 1rem;
                        }

                        button {
                            padding: 0.4rem 0.8rem;
                            font-size: 0.9rem;
                        }
                    }
                </style>

                <nav class="navbar">
                    <a class="logo">Vegzi</a>
                    <div class="auth-buttons">
                        <button class="login-btn">Iniciar Sesión</button>
                        <button class="register-btn">Registrarse</button>
                    </div>
                </nav>
            `;

            this.addAuthButtonsListeners();
            
            // Obtener el estado inicial
            const currentState = authStore.getState();
            this.updateUIState(currentState);
        }
    }
}

if (!customElements.get("custom-navbar")) {
    customElements.define("custom-navbar", Navbar);
}


