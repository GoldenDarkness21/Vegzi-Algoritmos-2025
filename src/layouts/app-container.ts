class AppContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 20px;
          font-family: sans-serif;
        }
      </style>
      <app-bar-container></app-bar-container>
      <food-cart></food-cart>
    `;
  }
}

if (!customElements.get("app-container")) {
  customElements.define("app-container", AppContainer);
}
