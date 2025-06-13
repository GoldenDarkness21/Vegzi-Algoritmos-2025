export class AppBarContainer extends HTMLElement {
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
                z-index: 1000;
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
            }

            app-bar-pc {
                display: block;
            }

            @media (max-width: 990px) {
                app-bar-pc {
                    display: none;
                }
            }
        </style>
        <app-bar-pc></app-bar-pc>
      `;
    }
}

if (!customElements.get("app-bar-container")) {
    customElements.define("app-bar-container", AppBarContainer);
}
