import './IconComponent'

class ButtonComponent extends HTMLElement {
    prependIcon

    constructor() {
        super();

        this.prependIcon = this.getAttribute('prepend-icon')

        this.attachShadow({mode: "open", slotAssignment: "named"})
    }

    connectedCallback() {
        if (!this.shadowRoot)
            return

        this.shadowRoot.innerHTML = `
        <style>
        :host {
            display: flex;
            background-color: #38A169;
            color: white;
            box-shadow: var(--elevation2);
            padding: .5rem 1rem;
            align-items: center;
            gap: .5rem;
            border-radius: 1rem;
            
            
            .content {
                font-weight: bold;
            }
        }
</style>

    ${(this.prependIcon)? `<icon-component icon="${this.prependIcon}"></icon-component>` : ''}
    
    <span class="content"><slot></slot></span>
        `
    }
}

if (!customElements.get('button-component'))
    customElements.define('button-component', ButtonComponent)