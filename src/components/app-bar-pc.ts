class AppBarPc extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="app-bar-pc">
            <style>
                .app-bar-pc {
                    --bar-height: 60px;
                    background-color: #fffa ;
                    backdrop-filter: blur(10px);
                    height: var(--bar-height);
                    border-bottom: 1px solid #ddd;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    display: flex;
                    align-items: center;
                    z-index: 10;
                    padding: 0 20px;
                    justify-content: space-between;

                    a {
                        text-decoration: none;
                        color: inherit;
                    }

                    ul {
                        display: flex;
                        gap: 20px;
                        margin: 0;
                        padding: 0;

                        li {
                            list-style: none;

                            a {
                                font-family: 'Nunito', sans-serif;
                                font-weight: 500;  
                            }

                            &.selected span {
                                height:5px;
                                background-color: #070;
                                display: block;
                                border-radius: 5px;
                            }
                        }
                    }

                    .right-side {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        
                        .search-bar {
                        border: 1px solid #070;
                        padding: 5px 10px;
                        border-radius: 20px;
                        background-color: #0703;
                        color: #070;
                        display: flex;
                        align-items: center;
                        }

                        input {
                            font-family: "Nunito", sans-serif;
                            font-weight: 500;
                            font-size: 16px;
                            outline: none;
                            border: none;
                            background-color: transparent;
                            color: #070;

                            &::placeholder {
                                color: #0706;
                            }
                        }

                        .icon {
                            width: 20px;
                            height: 20px;
                            fill: #070;
                        }

                    }

                    .buttons {
                        display: flex;
                        gap: 20px;

                        button {
                            border: none;
                            padding: 10px 20px;
                            border-radius: 20px;
                            min-width: 100px;
                            font-family: 'Nunito', sans-serif;
                            cursor: pointer;

                            &.login {
                                    background-color:#070;
                                    color: #fff;
                            }
                        }
                    }
                    
                }
            </style>

            <nav class="app-bar-links">
                <ul>
                    <li class="selected"><a href="#">HOME</a><span></span></li>
                    <li><a href="#">PROFILE</a></li>
                    <li><a href="#">CATEGORIES</a></li>
                    <li><a href="#">ADD POST</a></li>
                </ul>
            </nav>

            <div class="right-side">
                <div class="search-bar">
                    <input type="text" placeholder="Search...">

                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc. --><path d="M368 208A160 160 0 1 0 48 208a160 160 0 1 0 320 0zM337.1 371.1C301.7 399.2 256.8 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 48.8-16.8 93.7-44.9 129.1L505 471c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L337.1 371.1z"/></svg>
                </div>

                <div class="buttons">
                    <button class="login">LOGIN</button>
                    <button class="register">REGISTER</button>
                </div>
            </div>
        </div>
      `;

      this.querySelector(".login")?.addEventListener("click", () => {
        alert("Login clicked");
      });

      this.querySelector(".register")?.addEventListener("click", () => {
        alert("Register clicked");
      })
    }
}

if (!customElements.get("app-bar-pc")) {
    customElements.define("app-bar-pc", AppBarPc);
}