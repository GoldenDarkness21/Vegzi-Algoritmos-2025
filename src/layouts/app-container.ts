class AppContainer extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: "open" });
  }

  updateNavbar() {
      const isMobile = window.innerWidth < 990;
      const container = this.shadowRoot!.querySelector("#navbar-container");
      if (container) {
          container.innerHTML = isMobile
              ? "<custom-navbar></custom-navbar>"
              : "<desktop-navbar></desktop-navbar>";
      }
  }

  connectedCallback() {
      this.shadowRoot!.innerHTML = `
          <style>
              :host {
                  display: block;
                  padding: 20px;
                  font-family: sans-serif;
              }
          </style>
          <style>
              body {
                  font-family: 'Montserrat', sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: white;
              }
              .container {
                  position: relative;
                  overflow: hidden;
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
              }
              .carousel-container {
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
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
              }
              .carousel-item {
                  min-width: 50px;
                  margin: 0 10px;
              }
              .carousel-item img {
                  width: 3rem;
                  height: 3rem;
              }
          </style>
          <div class="container">
              <div class="curved-background"></div>
              <div class="content">
                  <h1 class="title">VEGZI</h1>
                  <div class="image-container">
                      <img src="https://storage.googleapis.com/a1aa/image/dlMms-IXX-fMosMee4GeCmYvrE-Bvxum67-eg4xRr9E.jpg" alt="A plate with a variety of healthy foods including salmon, avocado, tomatoes, and greens">
                  </div>
                  <p class="subtitle">Discover the taste of a healthy life</p>
                  <p class="description">Find delicious and nutritious recipes for every day</p>
              </div>
          </div>  
          <app-bar-container></app-bar-container>
          <food-cart></food-cart>
          <div id="navbar-container"></div>
          <slot></slot>
      `;

      this.updateNavbar();
      window.addEventListener("resize", this.updateNavbar.bind(this));
  }

  disconnectedCallback() {
      window.removeEventListener("resize", this.updateNavbar.bind(this));
  }
}

if (!customElements.get("app-container")) {
  customElements.define("app-container", AppContainer);
}