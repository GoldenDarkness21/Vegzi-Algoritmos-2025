import { navigateTo } from '../services/router.service';
import { authStore } from '../flux/store/auth.store';
import { AuthState } from '../flux/types/auth.types';
import { logoutUser } from '../flux/actions/auth.actions';

export class AppBarPc extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.setupStoreSubscription();
    }

    private setupStoreSubscription() {
        // get initial state
        const currentState = authStore.getState();
        this.updateAuthButtons(currentState);

        // subscribe to changes
        authStore.subscribe((state: AuthState) => {
            this.updateAuthButtons(state);
        });
    }

    private updateAuthButtons(state: AuthState) {
        const buttonsContainer = this.querySelector('.buttons');
        const profileLink = this.querySelector('a[href="/profile"]')?.parentElement;
        const userGreeting = this.querySelector('.user-greeting') as HTMLDivElement;
        
        if (profileLink) {
            profileLink.style.display = state.isAuthenticated ? 'block' : 'none';
        }

        if (userGreeting) {
            if (state.isAuthenticated && state.user) {
                const email = state.user.email || '';
                const username = email.split('@')[0] || 'Usuario';
                userGreeting.textContent = `¡Hi, ${username}!`;
                userGreeting.style.display = 'block';
            } else {
                userGreeting.style.display = 'none';
            }
        }

        if (buttonsContainer) {
            if (state.isAuthenticated && state.user) {
                buttonsContainer.innerHTML = `
                    <button class="logout" data-action="logout">LOG OUT</button>
                `;
                const logoutBtn = buttonsContainer.querySelector('[data-action="logout"]') as HTMLButtonElement;
                logoutBtn?.addEventListener('click', async () => {
                    if (logoutBtn) {
                        logoutBtn.disabled = true;
                        logoutBtn.innerHTML = `
                            <span class="loading-text">Logging out...</span>
                            <div class="loading-spinner"></div>
                        `;
                    }
                    
                    // Esperar un momento para mostrar el estado de carga
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await logoutUser();
                    navigateTo('/');
                    // Recargar la página después de un breve momento
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                });
            } else {
                buttonsContainer.innerHTML = `
                    <button class="login" data-route="/login">LOGIN</button>
                    <button class="register" data-route="/register">REGISTER</button>
                `;
                this.setupEventListeners();
            }
        }
    }

    render() {
        this.innerHTML = `
        <div class="app-bar-pc">
            <style>
                .app-bar-pc {
                    --bar-height: 60px;
                    background-color: #fffa;
                    backdrop-filter: blur(10px);
                    height: var(--bar-height);
                    border-bottom: 1px solid #ddd;
                    display: flex;
                    align-items: center;
                    z-index: 1000;
                    padding: 0 20px;
                    justify-content: space-between;
                }

                @media (max-width: 990px) {
                    .app-bar-pc {
                        display: none;
                    }
                }

                .app-bar-pc a {
                    text-decoration: none;
                    color: inherit;
                }

                .app-bar-links ul {
                    display: flex;
                    gap: 20px;
                    margin: 0;
                    padding: 0;
                }

                .app-bar-links li {
                    list-style: none;
                }

                .app-bar-links li a {
                    font-family: 'Nunito', sans-serif;
                    font-weight: 500;  
                }

                .app-bar-links li.selected span {
                    height: 5px;
                    background-color: #070;
                    display: block;
                    border-radius: 5px;
                }

                .right-side {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .user-greeting {
                    font-family: 'Nunito', sans-serif;
                    font-weight: 600;
                    color: #070;
                    margin-right: 10px;
                    display: none;
                }
                
                .search-bar {
                    border: 1px solid #070;
                    padding: 5px 10px;
                    border-radius: 20px;
                    background-color: #0703;
                    color: #070;
                    display: flex;
                    align-items: center;
                }

                .search-bar input {
                    font-family: "Nunito", sans-serif;
                    font-weight: 500;
                    font-size: 16px;
                    outline: none;
                    border: none;
                    background-color: transparent;
                    color: #070;
                }

                .search-bar input::placeholder {
                    color: #0706;
                }

                .search-bar .icon {
                    width: 20px;
                    height: 20px;
                    fill: #070;
                }

                .buttons {
                    display: flex;
                    gap: 20px;
                }

                .buttons button {
                    border: none;
                    padding: 10px 20px;
                    border-radius: 20px;
                    min-width: 100px;
                    font-family: 'Nunito', sans-serif;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .buttons button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .buttons button.login {
                    background-color: #070;
                    color: #fff;
                }

                .buttons button.register {
                    background-color: transparent;
                    color: #070;
                    border: 1px solid #070;
                }

                .buttons button.logout {
                    background-color: #e53935;
                    color: white;
                    min-width: 120px;
                }

                .buttons button.logout:hover {
                    background-color: #c62828;
                }

                .buttons button:hover:not(:disabled) {
                    opacity: 0.9;
                }

                .loading-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #fff;
                    border-radius: 50%;
                    border-top-color: transparent;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .loading-text {
                    font-size: 0.9rem;
                }
            </style>

            <nav class="app-bar-links">
                <ul>
                    <li class="selected"><a href="/" data-link>HOME</a><span></span></li>
                    <li><a href="/profile" data-link>PROFILE</a></li>
                    <li><a href="/categories" data-link>CATEGORIES</a></li>
                    <li><a href="/add-post" data-link>ADD POST</a></li>
                </ul>
            </nav>

            <div class="right-side">
                <div class="user-greeting"></div>
                <div class="search-bar">
                    <input type="text" placeholder="Search...">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc. --><path d="M368 208A160 160 0 1 0 48 208a160 160 0 1 0 320 0zM337.1 371.1C301.7 399.2 256.8 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 48.8-16.8 93.7-44.9 129.1L505 471c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L337.1 371.1z"/></svg>
                </div>

                <div class="buttons">
                    <button class="login" data-route="/login">LOGIN</button>
                    <button class="register" data-route="/register">REGISTER</button>
                </div>
            </div>
        </div>`;

        this.setupEventListeners();
        
        // get initial state
        const currentState = authStore.getState();
        this.updateAuthButtons(currentState);
    }

    setupEventListeners() {
        // event listeners for login and register buttons
        const buttons = this.querySelectorAll('[data-route]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const route = (e.currentTarget as HTMLElement).getAttribute('data-route');
                if (route) {
                    navigateTo(route);
                }
            });
        });

        // event listeners for navigation links
        const links = this.querySelectorAll('[data-link]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
                if (href) {
                    navigateTo(href);
                }
            });
        });
    }
}

if (!customElements.get("app-bar-pc")) {
    customElements.define("app-bar-pc", AppBarPc);
}