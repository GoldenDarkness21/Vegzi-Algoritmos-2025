class AppContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
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
