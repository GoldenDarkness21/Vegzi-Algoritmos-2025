import "./../views/MainView"
import "./../views/ProfileView"
import { debugRoute } from "../config/environment.config"

class AppContainer extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: "open" });
  }

  updateNavbar() {
      const container = this.shadowRoot!.querySelector("#navbar-container");
      if (container) {
          if (window.innerWidth <= 990) {
              container.innerHTML = "<custom-navbar></custom-navbar>";
          } else {
              container.innerHTML = "";
          }
      }
  }

  private updateMainContent() {
      if (!this.shadowRoot) {
          debugRoute('❌ App-container: No shadowRoot disponible');
          return;
      }

      const currentPath = document.location.pathname;
      console.log('🔥 App-container: updateMainContent llamado para:', currentPath);

      // APLICAR CLASES CSS SEGÚN LA RUTA ACTUAL
      this.className = ''; // Limpiar clases anteriores
      if (currentPath === '/') {
          this.classList.add('home-page');
      } else if (currentPath.startsWith('/profile')) {
          this.classList.add('profile-page');
      }
      console.log('🔥 App-container: Clases aplicadas:', this.className);

      const routes = [
          {route: /^\/$/, tag: '<main-view></main-view>'},
          {route: /^\/profile\/?/, tag: '<profile-view></profile-view>'}
      ]

      const currentTag = routes.find(
          el => !!currentPath.match(el.route))?.tag

      const main = this.shadowRoot.querySelector('main');
      if (main) {
          // Verificar si ya tenemos el contenido correcto
          if (main.innerHTML.trim() === (currentTag || '').trim()) {
              console.log('🔥 App-container: Contenido ya es correcto, saltando actualización');
              return;
          }
          
          console.log('🔥 App-container: Insertando en main:', currentTag);
          console.log('🔥 App-container: Contenido anterior:', main.innerHTML);
          main.innerHTML = currentTag || '';
          console.log('🔥 App-container: Nuevo contenido:', main.innerHTML);
          
          // Verificar si el elemento se creó
          setTimeout(() => {
              const profileView = main.querySelector('profile-view');
              console.log('🔥 App-container: Elemento profile-view encontrado:', profileView);
              if (profileView) {
                  console.log('🔥 App-container: profile-view existe, verificando su shadowRoot:', profileView.shadowRoot);
                  console.log('🔥 App-container: profile-view contenido innerHTML:', profileView.innerHTML);
              } else {
                  console.error('🔥 App-container: profile-view NO fue encontrado en main');
                  console.log('🔥 App-container: Contenido actual de main:', main.innerHTML);
              }
          }, 100);
      } else {
          debugRoute('❌ App-container: No se encontró elemento <main>');
      }
  }

  connectedCallback() {
      if (!this.shadowRoot)
          return

      const currentPath = document.location.pathname;
      
      // APLICAR CLASES CSS SEGÚN LA RUTA ACTUAL
      this.className = ''; // Limpiar clases anteriores
      if (currentPath === '/') {
          this.classList.add('home-page');
      } else if (currentPath.startsWith('/profile')) {
          this.classList.add('profile-page');
      }

      const routes = [
          {route: /^\/$/, tag: '<main-view></main-view>'},
          {route: /^\/profile\/?/, tag: '<profile-view></profile-view>'}
      ]

      const currentTag = routes.find(
          el => !!currentPath.match(el.route))?.tag

      this.shadowRoot.innerHTML = `
          <style>
              :host {
                  min-height: 100dvh;
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
                  display: block;
                  width: 100%;
              }
              
              /* Para la página principal, centramos el contenido */
              :host(.home-page) main {
                  display: flex;
                  justify-content: center;
                  align-items: center;
              }
              
              /* Para la página de perfil, usar layout normal */
              :host(.profile-page) main {
                  display: block;
                  width: 100%;
                  padding: 0;
                  margin: 0;
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

              /* Cuando estamos en la página de perfil */
              :host(.profile-page) .home-content {
                  display: none;
              }

              :host(.profile-page) food-cart {
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
                  padding-bottom: 8rem; /* Espacio para la barra de navegación */
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
          <app-bar-container></app-bar-container>
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
          <main>${currentTag || ''}</main>
          <food-cart></food-cart>
          <div id="navbar-container"></div>
      `;

      this.updateNavbar();
      window.addEventListener("resize", this.updateNavbar.bind(this));
      
      // Escuchar cambios de navegación para actualizar el contenido principal
      window.addEventListener('popstate', this.updateMainContent.bind(this));
      
      // Escuchar eventos personalizados de navegación
      document.addEventListener('route-changed', this.updateMainContent.bind(this));
  }

  disconnectedCallback() {
      window.removeEventListener("resize", this.updateNavbar.bind(this));
      window.removeEventListener('popstate', this.updateMainContent.bind(this));
      document.removeEventListener('route-changed', this.updateMainContent.bind(this));
  }
}

if (!customElements.get("app-container")) {
  customElements.define("app-container", AppContainer);
}