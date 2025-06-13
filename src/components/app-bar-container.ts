export class AppBarContainer extends HTMLElement {
    connectedCallback() {
        this.render();
        this.addEventListeners();
        this.updateNavbar(); // Actualizar la navbar al cargar el componente
    }

    private render() {
        this.innerHTML = `
            <div class="app-bar-container">
                <style>
                    .app-bar-container {
                        --bar-height: 60px;
                        height: var(--bar-height);
                        margin-bottom: 20px;
                        z-index: 1000;
                    }

                    app-bar-pc {
                        display: block;
                    }

                    navbar-component {
                        display: none; /* Por defecto oculta la navbar en PC */
                    }

                    @media (max-width: 990px) {
                        app-bar-pc {
                            display: none;
                        }
                        navbar-component {
                            display: block; /* Muestra la navbar en responsive */
                        }
                    }
                </style>
                <app-bar-pc></app-bar-pc>
                <navbar-component></navbar-component>
            </div>
        `;
    }

    addEventListeners() {
        window.addEventListener('popstate', () => this.updateNavbar());
        window.addEventListener('navigate', (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail && customEvent.detail.route) {
                this.updateNavbar(customEvent.detail.route);
            }
        });
        window.addEventListener('resize', () => this.updateNavbar()); // Actualizar en resize para responsive
    }

    public updateNavbar(currentRoute: string = window.location.pathname) {
        const navbar = this.querySelector('navbar-component') as HTMLElement;
        const appBarPc = this.querySelector('app-bar-pc') as HTMLElement;

        if (navbar && appBarPc) {
            // Ocultar navbar en login y register
            if (currentRoute === '/login' || currentRoute === '/register') {
                navbar.style.display = 'none';
                appBarPc.style.display = 'none';
            } else {
                // Lógica para mostrar/ocultar según responsive
                if (window.innerWidth <= 990) {
                    navbar.style.display = 'block';
                    appBarPc.style.display = 'none';
                } else {
                    navbar.style.display = 'none';
                    appBarPc.style.display = 'block';
                }
            }
        }
    }
}

if (!customElements.get("app-bar-container")) {
    customElements.define("app-bar-container", AppBarContainer);
}
