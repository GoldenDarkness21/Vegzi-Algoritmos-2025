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
      <food-cart></food-cart>
    `;
  }
}

if (!customElements.get("app-container")) {
  customElements.define("app-container", AppContainer);
}
