import './../components/ButtonComponent'

class ProfileView extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: "open"})

        this.setAttribute('role', 'button')
    }

    connectedCallback() {
        if (!this.shadowRoot)
            return

        const subPath = /(?<=^\/profile\/?).*/.exec(document.location.pathname)![0]

        const postsContent = `
            <div class="posts-content">
                <ul>
                    <li>
                        <img src="/images/profile.jpg">
                        
                        <div class="postContent">
                        <span> Healthy and delicious lunch, nothing like enjoying a nutritious meal.</span>
                        </div> 
                    </li>
                    
                    <li>
                        <img src="/images/profile.jpg">
                        
                        <div class="postContent">
                        <span>Please tell me what you had for dinner today. I need inspiration.</span>
                        </div> 
                    </li>
                    
                    <li>
                        <img src="/images/profile.jpg">
                        
                        <div class="postContent">
                        <span>I want to show you this healthy breakfast option to start the morning with energy.</span>
                        </div> 
                    </li>

                    <li>
                        <img src="/images/profile.jpg">
                        
                        <div class="postContent">
                        <span>I want to show you this healthy breakfast option to start the morning with energy.</span>
                        </div> 
                    </li>

                    <li>
                        <img src="/images/profile.jpg">
                        
                        <div class="postContent">
                        <span> Healthy and delicious lunch, nothing like enjoying a nutritious meal.</span>
                        </div> 
                    </li>
                    
                    <li>
                        <img src="/images/profile.jpg">
                        
                        <div class="postContent">
                        <span>Please tell me what you had for dinner today. I need inspiration.</span>
                        </div> 
                    </li>
                    
                </ul>
            </div>
        `

        const likesContent = `
            <div class="likes-content">
            <ul>
            <li><img src="/images/ensaladas.jpg"><div><icon-component icon="heart"></icon-component></div></li>
            <li><img src="/images/frutas.jpg"><div><icon-component icon="heart"></icon-component></div></li>
            <li><img src="/images/granola.jpg"><div><icon-component icon="heart"></icon-component></div></li>
            <li><img src="/images/pepino.jpg"><div><icon-component icon="heart"></icon-component></div></li>
            <li><img src="/images/sandia.jpg"><div><icon-component icon="heart"></icon-component></div></li>
            <li><img src="/images/ensaladas.jpg"><div><icon-component icon="heart"></icon-component></div></li>
            <li><img src="/images/granola.jpg"><div><icon-component icon="heart"></icon-component></div></li>
</ul>
</div>
        `

        const mainContent = `
        <div class="content">
            <div class="p-view">
                <img src="/images/profile.jpg" alt="profile image" />
                
                <div>
                    <h2>John Rodriguez</h2>
                    <span><b>24</b> Posts</span>
                </div>
                
                <div class="buttons">
                    <a href="/profile/settings"><button-component prepend-icon="pencil">Profile settings</button-component></a>
                    <button-component prepend-icon="plus">Upload recipe</button-component>
                </div>
            </div>
            
            <div class="posts-container">
                <nav>
                    <ul>
                        <li class="${/likes/.test(subPath)? '' : 'selected'}"><a href="/profile/posts"><span>Posts</span><hr></a></li>
                        <li class="${/likes/.test(subPath)? 'selected' : ''}"><a href="/profile/likes"><span>Likes</span><hr></a></li>
                    </ul>
                </nav>
                
                ${/likes/.test(subPath)? likesContent : postsContent }
            </div>
        </div>
        `

        const settingContent = `
        <div class="settings-content">
            <div class="p-view">
                <div class="profile-img">
                    <img src="/images/profile.jpg" alt="profile image" />
                    <icon-component icon="pencil"></icon-component>
                </div>
                
                <form action="">
                    <div class="field">
                        <span>Name</span>
                        <input type="text" name="name" id="name-input" value="Jhon Rodriguez">
                    </div>
                    <div class="field">
                        <span>Email</span>
                        <input type="email" name="name" id="name-input" value="jhon123@gmail.com">
                    </div>
                    <div class="field">
                        <span>Password</span>
                        <input type="password" name="name" id="name-input" value="contrasenia segura">
                    </div>
                    
                    <button-component>Save</button-component>
                </form>
                
            </div>
        </div>
        `

        this.shadowRoot.innerHTML = `
        <style>
        :host {
            display: flex;
            position: relative;
            height: 100dvh;
            width: 100%;
            justify-content: center;
            
            --app-bar-height: 60px;
            
            font-family: Montserrat;
            
            user-select: none;
            
            * {
                font-family: inherit;
                /*font-weight: inherit;*/
            }
            
            a {
                text-decoration: none;
                color: inherit;
            }
            
            .decorator-bg {
                background-color: #E6F4EA;
                position: absolute;
                height: 200px;
                width: 100%;
                z-index: -1;
            }
            
            .content {
                width: 100%;
                max-width: 1150px;
                padding: 1rem;
                padding-top: calc(var(--app-bar-height) + 3rem);
                display: grid;
                grid-template-columns: 300px 1fr;
                height: 100%;
                gap: 2rem;
                
                > .p-view {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                    
                    > div {
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                    }
                    
                    h2, span {
                        text-align: center;
                        font-family: Montserrat;
                    }
                
                    img {
                        object-fit: cover;
                        aspect-ratio: 1;
                        width: 200px;
                        border-radius: 50%;
                        box-shadow: var(--elevation2);
                    }
                    
                    .buttons {
                        display: flex;
                        gap: .5rem;
                        flex-direction: column;
                    }
                }
                
                .posts-container {
                    padding-top: 92px;
                    
                    
                    nav ul {
                        list-style: none;
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                        
                        li {
                            font-weight: 600;
                            
                            span {
                                padding: 0 .5rem;
                            } 
                            
                            &.selected {
                                color: #38A169;
                                
                                hr {
                                    border: 0;
                                    height: 3px;
                                    background-color: currentColor;
                                    border-radius: 3px;
                                }
                            }
                            
                            &:not(.selected) hr {
                                opacity: 0;
                            }
                        }
                    }
                    
                    .posts-content {
                
                        img {
                            width: 40px;
                            aspect-ratio: 1;
                            object-fit: cover;
                            border-radius: 50%;
                            box-shadow: var(--elevation1);
                        }
                        
                        
                        li {
                            &+li {
                                margin-top: .5rem;
                            }
                        
                            .postContent {
                                span {
                                        
                                    font-size: .85rem;
                                    font-weight: 400;
                                }
                            
                            }
                            
                            align-items: start;
                            display: flex;
                            gap: .5rem;
                        }
                    }
                    
                    .likes-content ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                        gap: 1rem;
                    
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                        
                        img {
                            aspect-ratio: 1;
                            object-fit: cover;
                            box-shadow: var(--elevation1);
                            width: 100% ;
                            border-radius: 1rem;
                        }
                    }
                }
            }
            
            .settings-content {
                
                
                padding: 1rem;
                padding-top: calc(var(--app-bar-height) + 3rem);
                
                .p-view {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                
                }
                
                .profile-img {
                
                    position: relative;
                    
                    
                
                    img {
                        object-fit: cover;
                        aspect-ratio: 1;
                        width: 200px;
                        border-radius: 50%;
                        box-shadow: var(--elevation2);
                    }
                    
                    icon-component {
                        position: absolute;
                        right: 12px;
                        bottom: 12px;
                        background-color: #E6F4EA;
                        padding: .5rem;
                        box-shadow: var(--elevation2);
                        border-radius: 50%;
                        color: #38A169;
                    }
                }
                
                
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: center;
                    
                    .field {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                        
                        span {
                            font-size: .8rem;
                            font-weight: 600;
                        }
                        
                        input {
                            background-color: #E6F4EA;
                            border-radius: .5rem;
                            padding: .25rem .5rem;
                            font-family: Montserrat;
                            font-weight: 600;
                            font-size: .9rem;
                            
                            /*border-color: #38A169;*/
                            border: 0;
                            outline-color: #38A169;
                            outline-width: 2px;
                            outline-style: solid;
                            
                            box-shadow: var(--elevation2);
                            
                            &:focus-visible {
                                /*border-color: #38A169;*/
                                box-shadow: var(--elevation3);
                                
                            }                            
                        }
                    }
                }
            }
            
            
        }
</style>

<div class="decorator-bg"></div>

${/settings/.test(subPath)? settingContent : mainContent}
        `
    }
}

if (!customElements.get('profile-view'))
    customElements.define('profile-view', ProfileView)