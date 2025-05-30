// src/layouts/app-container.ts
import { stateService } from "../services/StateService";
import "../components/category/categories-page";
import "../components/navbar/navbar";

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

        /* Navegación Desktop */
        .navigation {
          background: white;
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          display: block;
        }

        .nav-items {
          display: flex;
          gap: 2rem;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .nav-item {
          cursor: pointer;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          transition: all 0.2s ease;
          font-weight: 600;
          color: #5a7c65;
          border: 2px solid transparent;
        }

        .nav-item:hover {
          background-color: #f0f8f0;
          color: #4a6b55;
        }

        .nav-item.active {
          background-color: #e8f5e8;
          color: #2e5d32;
          border-color: #a8d5ba;
        }

        .main-content {
          flex: 1;
          min-height: calc(100vh - 80px);
        }

        /* Navegación Mobile */
        .mobile-nav {
          display: none;
        }

        /* Media Queries */
        @media (max-width: 768px) {
          .navigation {
            display: none;
          }

          .mobile-nav {
            display: block;
          }

          .main-content {
            min-height: calc(100vh - 100px);
            padding-bottom: 100px; /* Espacio para el navbar fijo */
          }
        }
      </style>

      <div class="app-container">
        <!-- Navegación Desktop -->
        <nav class="navigation">
          <div class="nav-items">
            <div class="nav-item nav-home">HOME</div>
            <div class="nav-item nav-profile">PROFILE</div>
            <div class="nav-item nav-categories">CATEGORIES</div>
            <div class="nav-item nav-add-post">ADD POST</div>
          </div>
        </nav>
        
        <!-- Contenido Principal -->
        <main class="main-content">
          <!-- El contenido de la página se renderiza aquí -->
        </main>

        <!-- Navegación Mobile -->
        <div class="mobile-nav">
          <custom-navbar></custom-navbar>
        </div>
      </div>
    `;

    // Renderizar página inicial
    setTimeout(() => {
      this.renderCurrentPage();
      this.updateActiveNavigation();
    }, 0);
  }
}

if (!customElements.get("app-container")) {
  customElements.define("app-container", AppContainer);
}