class AppBarContainer extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                --bar-height: 60px;
                height: var(--bar-height);
                margin-bottom: 20px;
                z-index: 100;
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
            }
        </style>
        <app-bar-pc></app-bar-pc>
      `;
    }
}

if (!customElements.get("app-bar-container")) {
    customElements.define("app-bar-container", AppBarContainer);
}