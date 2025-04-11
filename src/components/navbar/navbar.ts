class Navbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.setEventListeners();
    }

    render() {
        const homeIcon = require('../../assets/icons/home.svg');
        const profileIcon = require('../../assets/icons/account_circle.svg');
        const addIcon = require('../../assets/icons/add.svg');
        const categoryIcon = require('../../assets/icons/category.svg');

        this.shadowRoot!.innerHTML = /*HTML*/`
            <style>
                .container-navbar {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    align-items: center;
                    min-height: 150px;
                    max-height: 200px;
                    width: 80%;
                    background-color: #9FC280;
                    position: fixed;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    border-radius: 60px;
                }

                .icon-navbar {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #fff;
                    width: 60px;
                }
                .icon-navbar:hover {
                    color: #adadad;
                }
            </style>
            <div class="container-navbar">
                <div data-section="home">
                    <img src="${homeIcon}" alt="Home" class="icon-navbar" />
                </div>
                <div data-section="profile">
                    <img src="${profileIcon}" alt="Profile" class="icon-navbar" />
                </div>
                <div data-section="add">
                    <img src="${addIcon}" alt="Add" class="icon-navbar" />
                </div>
                <div data-section="category">
                    <img src="${categoryIcon}" alt="Category" class="icon-navbar" />
                </div>
            </div>
        `;
    }

    setEventListeners() {
        const buttons = this.shadowRoot!.querySelectorAll(".icon-navbar");
        buttons.forEach(button => {
            button.addEventListener("click", (e) => {
                const section = (e.currentTarget as HTMLElement).dataset.section;
                this.nextToWindow(section!);
            });
        });
    }

    nextToWindow(section: string) {
        console.log(`Cambiando a la sección: ${section}`);
        const event = new CustomEvent('navigate', {
            detail: { section },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }
}

customElements.define('custom-navbar', Navbar);
export default Navbar;
