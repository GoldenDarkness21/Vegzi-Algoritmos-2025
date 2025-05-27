export const navigateTo = (path: string) => {
    history.pushState(null, '', path);
    handleRoute();
};

export const handleRoute = () => {
    const path = window.location.pathname;
    const appContainer = document.querySelector('app-container');
    if (!appContainer || !appContainer.shadowRoot) return;

    const mainContent = appContainer.shadowRoot.querySelector('main');
    if (!mainContent) return;

    // Remover clases anteriores
    appContainer.classList.remove('auth-page', 'home-page');

    switch (path) {
        case '/login':
            appContainer.classList.add('auth-page');
            mainContent.innerHTML = '<login-form></login-form>';
            break;
        case '/register':
            appContainer.classList.add('auth-page');
            mainContent.innerHTML = '<register-form></register-form>';
            break;
        case '/':
            appContainer.classList.add('home-page');
            mainContent.innerHTML = '<div class="food-grid"></div>';
            break;
        default:
            appContainer.classList.add('home-page');
            mainContent.innerHTML = '<div>404 - Página no encontrada</div>';
    }
};

// Manejar la carga inicial y los cambios de navegación
window.addEventListener('popstate', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);

// Escuchar eventos de navegación personalizados
document.addEventListener('navigate', ((e: CustomEvent) => {
    if (e.detail && e.detail.route) {
        navigateTo(e.detail.route);
    }
}) as EventListener); 