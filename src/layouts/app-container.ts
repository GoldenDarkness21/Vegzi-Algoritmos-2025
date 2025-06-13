// src/layouts/app-container.ts
import { stateService } from "../services/StateService";
import "../components/category/categories-page";
import "../components/navbar/navbar";
import "../components/navbar/app-bar-pc";

class AppContainer extends HTMLElement {
  private unsubscribe: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Cargar estado desde localStorage
    stateService.loadFromLocalStorage();

    // Suscribirse a cambios de estado
    this.unsubscribe = stateService.subscribe((state) => {
      this.renderCurrentPage();
      this.updateActiveNavigation();
    });

    this.render();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private attachEventListeners() {
    // Escuchar clicks en la navegación desktop
    this.shadowRoot?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Manejar clicks en navegación desktop
      if (target.classList.contains('nav-categories') || target.textContent?.trim() === 'CATEGORIES') {
        event.preventDefault();
        stateService.setCurrentPage('categories');
      }
      
      if (target.classList.contains('nav-home') || target.textContent?.trim() === 'HOME') {
        event.preventDefault();
        stateService.setCurrentPage('home');
      }
      
      if (target.classList.contains('nav-profile') || target.textContent?.trim() === 'PROFILE') {
        event.preventDefault();
        stateService.setCurrentPage('profile');
      }
      
      if (target.classList.contains('nav-add-post') || target.textContent?.trim() === 'ADD POST') {
        event.preventDefault();
        stateService.setCurrentPage('add-post');
      }
    });

    // Escuchar eventos de navegación del navbar responsive
    this.addEventListener('navigate', (event: any) => {
      const section = event.detail.section;
      
      switch (section) {
        case 'home':
          stateService.setCurrentPage('home');
          break;
        case 'profile':
          stateService.setCurrentPage('profile');
          break;
        case 'add':
          stateService.setCurrentPage('add-post');
          break;
        case 'category':
          stateService.setCurrentPage('categories');
          break;
      }
    });
  }

  private updateActiveNavigation() {
    const currentPage = stateService.getCurrentPage();
    const navItems = this.shadowRoot?.querySelectorAll('.nav-item');
    
    navItems?.forEach(item => {
      item.classList.remove('active');
      
      if (
        (currentPage === 'home' && item.classList.contains('nav-home')) ||
        (currentPage === 'profile' && item.classList.contains('nav-profile')) ||
        (currentPage === 'categories' && item.classList.contains('nav-categories')) ||
        (currentPage === 'add-post' && item.classList.contains('nav-add-post'))
      ) {
        item.classList.add('active');
      }
    });
  }

  private renderCurrentPage() {
    const contentContainer = this.shadowRoot?.querySelector('.main-content');
    if (!contentContainer) return;

    const currentPage = stateService.getCurrentPage();

    // Limpiar contenido actual
    contentContainer.innerHTML = '';

    // Renderizar página correspondiente
    switch (currentPage) {
      case 'categories':
        const categoriesPage = document.createElement('categories-page');
        contentContainer.appendChild(categoriesPage);
        break;
      
      case 'home':
        // Aquí iría tu componente de home existente
        contentContainer.innerHTML = `
          <div style="padding: 40px; text-align: center; color: #5a7c65;">
            <h2>Home Page</h2>
            <p>Aquí va tu contenido existente del home</p>
          </div>
        `;
        break;
      
      case 'profile':
        contentContainer.innerHTML = `
          <div style="padding: 40px; text-align: center; color: #5a7c65;">
            <h2>Profile Page</h2>
            <p>Página de perfil en construcción</p>
          </div>
        `;
        break;
      
      case 'add-post':
        contentContainer.innerHTML = `
          <div style="padding: 40px; text-align: center; color: #5a7c65;">
            <h2>Add Post Page</h2>
            <p>Página para agregar posts en construcción</p>
          </div>
        `;
        break;
      
      default:
        contentContainer.innerHTML = `
          <div style="padding: 40px; text-align: center; color: #ff6b6b;">
            <h2>Page not found</h2>
            <p>La página solicitada no existe</p>
          </div>
        `;
    }
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #fafafa;
        }

        .main-content {
          flex: 1;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .categorias-scroll {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding-bottom: 16px;
          scrollbar-width: thin;
        }

        .categorias-scroll::-webkit-scrollbar {
          height: 8px;
          background: #eee;
        }

        .categorias-scroll::-webkit-scrollbar-thumb {
          background: #cfcfcf;
          border-radius: 4px;
        }

        /* Navegación Desktop */
        .navigation {
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      </style>
      
      <div class="app-container">
        <app-bar-pc></app-bar-pc>
        <div class="main-content"></div>
        <navbar-component></navbar-component>
      </div>
    `;
  }
}

if (!customElements.get("app-container")) {
  customElements.define("app-container", AppContainer);
}