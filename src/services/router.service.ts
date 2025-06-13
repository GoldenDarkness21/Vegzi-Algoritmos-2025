import { debugRoute } from '../config/environment.config';

export const navigateTo = (path: string) => {
    debugRoute('Navegando a:', path);
    history.pushState(null, '', path);
    handleRoute();
};

export const handleRoute = () => {
    const path = window.location.pathname;
    debugRoute('Manejando ruta:', path);
    
    const appContainer = document.querySelector('app-container');
    if (!appContainer || !appContainer.shadowRoot) {
        debugRoute('❌ No se encontró app-container o shadowRoot');
        return;
    }

    const mainContent = appContainer.shadowRoot.querySelector('main');
    if (!mainContent) {
        debugRoute('❌ No se encontró elemento main');
        return;
    }

    // remove previous classes
    const previousClasses = appContainer.className;
    appContainer.classList.remove('auth-page', 'home-page', 'profile-page');
    debugRoute('Clases removidas:', previousClasses);

    // Disparar evento para que app-container actualice su contenido
    document.dispatchEvent(new CustomEvent('route-changed', { 
        detail: { path } 
    }));
    debugRoute('Evento route-changed disparado para:', path);

    switch (path) {
        case '/login':
        case '/register':
            debugRoute('✅ Ruta de autenticación:', path);
            appContainer.classList.add('auth-page');
            mainContent.innerHTML = path === '/login' ? 
                '<login-form></login-form>' : 
                '<register-form></register-form>';
            break;
        case '/':
            debugRoute('✅ Ruta home');
            appContainer.classList.add('home-page');
            mainContent.innerHTML = '<div class="food-grid"></div>';
            break;
        case '/profile':
            debugRoute('✅ Ruta de perfil - delegando a app-container');
            // La vista de perfil se maneja en app-container con profile-view
            // Solo necesitamos limpiar el mainContent para evitar conflictos
            appContainer.classList.add('profile-page');
            mainContent.innerHTML = '';
            break;
        default:
            debugRoute('❌ Ruta no encontrada:', path);
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