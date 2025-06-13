class IconComponent extends HTMLElement {
    private readonly icon
    private readonly badge

    constructor() {
        super();

        this.attachShadow({mode: "open"})

        this.icon = this.getAttribute('icon')
        this.badge = this.getAttribute('badge')
    }

    connectedCallback() {
        if (!this.shadowRoot) return

        this.shadowRoot.innerHTML = `
         <style>
         :host {
         height: 24px;
         width: 24px;
         
         display: flex;
         justify-content: center;
         align-items: center;
         position: relative;
         
            svg {
                height: 20px;
                width: 20px;
                fill: currentColor;
                pointer-events: none;
            }
            
            .badge {
                position: absolute;
                background-color: rgb(var(--theme-color-primary));
                color: rgb(var(--theme-color-onPrimary));
                border-radius: .5rem;
                padding: .2rem;
                font-size: .8rem;
                right: -.5rem;
                top: -.5rem;
            }
         }
</style>

${this.badge ? `<span class="badge">${this.badge}</span>` : ''}

${this.getIcon()}
        `
    }

    getIcon(): string | undefined {
        if (this.icon === 'cart-shopping') return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc. --><path d="M24 0C10.7 0 0 10.7 0 24S10.7 48 24 48l45.5 0c3.8 0 7.1 2.7 7.9 6.5l51.6 271c6.5 34 36.2 58.5 70.7 58.5L488 384c13.3 0 24-10.7 24-24s-10.7-24-24-24l-288.3 0c-11.5 0-21.4-8.2-23.6-19.5L170.7 288l288.5 0c32.6 0 61.1-21.8 69.5-53.3l41-152.3C576.6 57 557.4 32 531.1 32l-411 0C111 12.8 91.6 0 69.5 0L24 0zM131.1 80l389.6 0L482.4 222.2c-2.8 10.5-12.3 17.8-23.2 17.8l-297.6 0L131.1 80zM176 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm336-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"/></svg>'
        if (this.icon === 'cart-plus') return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc. --><path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c26.9 0 50 19.1 55 45.5l37 194.5 297.6 0c10.9 0 20.4-7.3 23.2-17.8L528.8 49.8c3.4-12.8 16.6-20.4 29.4-16.9s20.4 16.6 16.9 29.4L528.7 234.7c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM344 48l0 40 40 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-40 0 0 40c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-40-40 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l40 0 0-40c0-13.3 10.7-24 24-24s24 10.7 24 24z"/></svg>'
        if (this.icon === 'cart-minus') return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc. --><path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c26.9 0 50 19.1 55 45.5l37 194.5 297.6 0c10.9 0 20.4-7.3 23.2-17.8L528.8 49.8c3.4-12.8 16.6-20.4 29.4-16.9s20.4 16.6 16.9 29.4L528.7 234.7c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM256 96l128 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-128 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/></svg>'
        if (this.icon === 'arrow-left-long') return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc. --><path d="M7 239c-9.4 9.4-9.4 24.6 0 33.9L143 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-95-95L488 280c13.3 0 24-10.7 24-24s-10.7-24-24-24L81.9 232l95-95c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L7 239z"/></svg>'
        if (this.icon === 'plus') return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc. --><path d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 160L40 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l160 0 0 160c0 13.3 10.7 24 24 24s24-10.7 24-24l0-160 160 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-160 0 0-160z"/></svg>'
        if (this.icon === 'pencil') return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc. --><path d="M36.4 360.9L13.4 439 1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1L73 498.6l78.1-23c10.4-3 20.1-8 28.6-14.5l.3 .2 .5-.8c1.4-1.1 2.7-2.2 4-3.3c1.4-1.2 2.7-2.5 4-3.8L492.7 149.3c21.9-21.9 24.6-55.6 8.2-80.5c-2.3-3.5-5.1-6.9-8.2-10L453.3 19.3c-25-25-65.5-25-90.5 0L58.6 323.5c-2.5 2.5-4.9 5.2-7.1 8l-.8 .5 .2 .3c-6.5 8.5-11.4 18.2-14.5 28.6zM383 191L197.4 376.6l-49.6-12.4-12.4-49.6L321 129 383 191zM97 358.9l7.7 31c2.1 8.6 8.9 15.3 17.5 17.5l31 7.7-7.4 11.2c-2.6 1.4-5.3 2.6-8.1 3.4l-23.4 6.9L59.4 452.6l16.1-54.8 6.9-23.4c.8-2.8 2-5.6 3.4-8.1L97 358.9zM315.3 218.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0l-96 96c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l96-96z"/></svg>'
        if (this.icon === 'heart') return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc. --><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>'
    }

}

if (!customElements.get('icon-component'))
    customElements.define('icon-component', IconComponent)