class AppContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    updateNavbar() {
        const isMobile = window.innerWidth < 950;
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
            <div id="navbar-container"></div>
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
