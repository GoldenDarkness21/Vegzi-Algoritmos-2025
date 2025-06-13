class AppContainer extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: "open" });
  }

  updateNavbar() {
      const container = this.shadowRoot!.querySelector("#navbar-container");
      const currentPath = window.location.pathname;
      
      if (container) {
          if (window.innerWidth <= 990 && currentPath !== '/login' && currentPath !== '/register') {
              container.innerHTML = "<custom-navbar></custom-navbar>";
          } else {
              container.innerHTML = "";
          }
      }
  }

  connectedCallback() {
      this.shadowRoot!.innerHTML = `
          <style>
              :host {
                  display: block;
                  font-family: sans-serif;
              }
              body {
                  font-family: 'Montserrat', sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: white;
              }
              .container {
                  position: relative;
                  overflow: hidden;
                  min-height: 100vh;
              }
              .curved-background {
                  position: absolute;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(to bottom,rgb(255, 255, 255) 40%,rgb(20, 228, 124) 100%);
                  clip-path: ellipse(70% 65% at 50% 10%);
                  z-index: 0;
              }
              .content {
                  position: relative;
                  z-index: 10;
                  text-align: center;
                  padding: 5rem 0;
              }
              .title {
                  font-size: 4rem;
                  font-weight: bold;
                  color: #38A169;
                  margin: 0;
                  padding: 0;
              }
              .image-container {
                  display: flex;
                  justify-content: center;
                  margin-top: 2.5rem;
              }
              .image-container img {
                  width: 16rem;
                  height: 16rem;
                  border-radius: 50%;
                  border: 4px solid white;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  object-fit: cover;
              }
              .subtitle {
                  margin-top: 2.5rem;
                  font-size: 1.5rem;
                  font-weight: 600;
                  color: #4A5568;
              }
              .description {
                  font-size: 1.125rem;
                  color: #A0AEC0;
                  max-width: 600px;
                  margin: 1rem auto;
              }
              .carousel-container {
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  padding: 2rem 0;
              }
              .carousel {
                  display: flex;
                  overflow: hidden;
                  width: 100%;
                  justify-content: center;
              }
              .carousel-track {
                  display: flex;
                  transition: transform 0.5s ease;
                  gap: 1rem;
              }
              .carousel-item {
                  min-width: 50px;
                  margin: 0;
              }
              .carousel-item img {
                  width: 3rem;
                  height: 3rem;
                  border-radius: 50%;
                  transition: transform 0.3s ease;
              }
              .carousel-item img:hover {
                  transform: scale(1.1);
              }

              /* Estilos para el contenedor principal de rutas */
              main {
                  min-height: 100vh;
                  display: flex;
                  justify-content: center;
                  align-items: center;
              }

              /* Cuando estamos en páginas de autenticación */
              :host(.auth-page) .home-content {
                  display: none;
              }

              :host(.auth-page) app-bar-pc {
                  display: none;
              }

              :host(.auth-page) food-cart {
                  display: none;
              }

              /* Asegurarnos de que el navbar-container siempre sea visible */
              #navbar-container {
                  display: block !important;
              }

              /* Cuando estamos en la página principal */
              :host(.home-page) .home-content {
                  display: block;
              }

              /* Ajuste para que los formularios de autenticación ocupen toda la altura */
              :host(.auth-page) main {
                  height: 100vh;
                  padding: 0;
                  margin: 0;
              }

              /* Estilos responsive */
              @media (max-width: 990px) {
                  .title {
                      font-size: 5rem;
                      margin-bottom: 3rem;
                  }

                  .image-container {
                      margin-top: 4rem;
                  }

                  .image-container img {
                      width: 20rem;
                      height: 20rem;
                      border-width: 6px;
                  }

                  .subtitle {
                      font-size: 2.2rem;
                      padding: 0 2rem;
                      margin-top: 4rem;
                  }

                  .description {
                      font-size: 1.8rem;
                      padding: 0 2rem;
                      margin-top: 2rem;
                      line-height: 1.8;
                      max-width: 800px;
                  }

                  #navbar-container {
                      position: fixed;
                      bottom: 0;
                      left: 0;
                      right: 0;
                      z-index: 1000;
                  }

                  .content {
                      padding: 6rem 2rem;
                  }

                  main {
                      padding-bottom: 9rem;
                  }

                  /* Ocultar navbar en páginas de autenticación */
                  :host(.auth-page) #navbar-container {
                      display: none !important;
                  }
              }

              @media (max-width: 480px) {
                  .title {
                      font-size: 4rem;
                  }

                  .image-container img {
                      width: 18rem;
                      height: 18rem;
                  }

                  .subtitle {
                      font-size: 2rem;
                      padding: 0 1.5rem;
                      margin-top: 3rem;
                  }

                  .description {
                      font-size: 1.6rem;
                      padding: 0 1.5rem;
                      margin-top: 1.5rem;
                      line-height: 1.6;
                  }

                  .content {
                      padding: 5rem 1.5rem;
                  }

                  main {
                      padding-bottom: 8rem;
                  }
              }
          </style>
          <app-bar-pc></app-bar-pc>
          <div class="home-content">
              <div class="container">
                  <div class="curved-background"></div>
                  <div class="content">
                      <h1 class="title">VEGZI</h1>
                      <div class="image-container">
                          <img src="https://storage.googleapis.com/a1aa/image/dlMms-IXX-fMosMee4GeCmYvrE-Bvxum67-eg4xRr9E.jpg" alt="A plate with a variety of healthy foods including salmon, avocado, tomatoes, and greens">
                      </div>
                      <p class="subtitle">Descubre el sabor de una vida saludable</p>
                      <p class="description">Encuentra recetas deliciosas y nutritivas para cada día.</p>
                  </div>
              </div>
          </div>
          <main>
              <slot></slot>
          </main>
          <div id="navbar-container"></div>
      `;

      this.updateNavbar();
      
      // Escuchar cambios en el tamaño de la ventana
      window.addEventListener('resize', () => this.updateNavbar());
      
      // Escuchar cambios en la ruta
      window.addEventListener('popstate', () => this.updateNavbar());
      
      // Escuchar eventos de navegación personalizados
      window.addEventListener('navigate', () => {
          // Pequeño retraso para asegurar que la ruta se haya actualizado
          setTimeout(() => this.updateNavbar(), 0);
      });
  }

  disconnectedCallback() {
      window.removeEventListener('resize', () => this.updateNavbar());
      window.removeEventListener('popstate', () => this.updateNavbar());
      window.removeEventListener('navigate', () => {
          setTimeout(() => this.updateNavbar(), 0);
      });
  }
}

if (!customElements.get("app-container")) {
    customElements.define("app-container", AppContainer);
}