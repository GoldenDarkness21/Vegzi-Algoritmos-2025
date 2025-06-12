import { navigateTo } from '../../services/router.service';
import { authStore } from '../../flux/store/auth.store';
import { AuthState } from '../../flux/types/auth.types';

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
        // Obtener estado inicial
        const currentState = authStore.getState();
        this.updateUIState(currentState);

        // Suscribirse a cambios
        authStore.subscribe((state: AuthState) => {
            this.updateUIState(state);
        });
    }

    private updateUIState(state: AuthState) {
        if (this.shadowRoot) {
            const profileLink = this.shadowRoot.querySelector('[data-route="/profile"]') as HTMLElement;
            const addPostLink = this.shadowRoot.querySelector('[data-route="/add-post"]') as HTMLElement;
            
            if (profileLink && addPostLink) {
                profileLink.style.display = state.isAuthenticated ? 'flex' : 'none';
                addPostLink.style.display = state.isAuthenticated ? 'flex' : 'none';
            }
        }
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: none;
                    }

                    @media (max-width: 990px) {
                        :host {
                            display: block !important;
                            width: 100%;
                            background-color: rgba(255, 255, 255, 0.98);
                            backdrop-filter: blur(10px);
                            border-top: 1px solid #ddd;
                            position: fixed;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            z-index: 1000;
                            box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
                        }
                    }

                    .navbar {
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        padding: 1.5rem;
                    }

                    .nav-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-decoration: none;
                        color: #666;
                        font-family: 'Nunito', sans-serif;
                        font-size: 1.5rem;
                        font-weight: 600;
                        gap: 0.8rem;
                        padding: 1.2rem;
                        border-radius: 1rem;
                        transition: all 0.3s ease;
                        min-width: 7rem;
                    }

                    .nav-item[style*="display: none"] {
                        display: none !important;
                    }

                    .nav-item:hover {
                        background-color: #f0f0f0;
                        color: #070;
                        transform: translateY(-3px);
                    }

                    .nav-item.active {
                        color: #070;
                        background-color: #e8f5e9;
                    }

                    .nav-item svg {
                        width: 3rem;
                        height: 3rem;
                        fill: currentColor;
                    }

                    @media (max-width: 480px) {
                        .navbar {
                            padding: 1.2rem 0.8rem;
                        }

                        .nav-item {
                            font-size: 1.4rem;
                            padding: 1rem;
                            min-width: 6rem;
                        }

                        .nav-item svg {
                            width: 2.8rem;
                            height: 2.8rem;
                        }
                    }
                </style>

                <nav class="navbar">
                    <a class="nav-item" data-route="/" href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>
                        <span>Inicio</span>
                    </a>
                    <a class="nav-item" data-route="/categories" href="/categories">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"/></svg>
                        <span>Categorías</span>
                    </a>
                    <a class="nav-item" data-route="/add-post" href="/add-post">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                        <span>Añadir</span>
                    </a>
                    <a class="nav-item" data-route="/profile" href="/profile">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
                        <span>Perfil</span>
                    </a>
                </nav>
            `;

            this.setupEventListeners();
            
            // Obtener el estado inicial
            const currentState = authStore.getState();
            this.updateUIState(currentState);
        }
    }

    setupEventListeners() {
        const links = this.shadowRoot?.querySelectorAll('[data-route]');
        links?.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = (e.currentTarget as HTMLElement).getAttribute('data-route');
                if (route) {
                    // Remover clase active de todos los links
                    links.forEach(l => l.classList.remove('active'));
                    // Añadir clase active al link clickeado
                    (e.currentTarget as HTMLElement).classList.add('active');
                    navigateTo(route);
                }
            });
        });

        // Marcar el link activo según la ruta actual
        const currentPath = window.location.pathname;
        const activeLink = this.shadowRoot?.querySelector(`[data-route="${currentPath}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

if (!customElements.get("custom-navbar")) {
    customElements.define("custom-navbar", Navbar);
}


