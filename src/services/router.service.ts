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

    // remove previous classes
    appContainer.classList.remove('auth-page', 'home-page');

    switch (path) {
        case '/login':
        case '/register':
            appContainer.classList.add('auth-page');
            mainContent.innerHTML = path === '/login' ? 
                '<login-form></login-form>' : 
                '<register-form></register-form>';
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

// handle initial load and navigation changes
window.addEventListener('popstate', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);

// listen to custom navigation events
document.addEventListener('navigate', ((e: CustomEvent) => {
    if (e.detail && e.detail.route) {
        navigateTo(e.detail.route);
    }
}) as EventListener); 