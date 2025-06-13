import './../components/ButtonComponent'
import './../components/IconComponent'

class ProfileView extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: "open"})

        this.setAttribute('role', 'button')
    }

    connectedCallback() {
        if (!this.shadowRoot) {
            console.error('ProfileView: No shadowRoot available');
            return;
        }

        console.log('ProfileView: Connected, rendering...');
        const currentPath = document.location.pathname;
        const subPath = currentPath.replace('/profile', '') || '';
        console.log('ProfileView: Current path:', currentPath, 'SubPath:', subPath);



        console.log('ProfileView: About to render HTML...');
        
        this.shadowRoot.innerHTML = `
        <style>
        :host {
            display: block;
            position: relative;
            min-height: 100vh;
            width: 100%;
            background-color: white;
            padding: 2rem;
            
            font-family: Montserrat, sans-serif;
            
            * {
                font-family: inherit;
            }
            
            a {
                text-decoration: none;
                color: inherit;
            }
            
            .test-content {
                background-color: #f0f0f0;
                padding: 2rem;
                border-radius: 8px;
                margin: 2rem 0;
                text-align: center;
            }
            
            .profile-header {
                background-color: #E6F4EA;
                padding: 2rem;
                border-radius: 8px;
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .content {
                max-width: 800px;
                margin: 0 auto;
            }
        }
</style>

<div class="test-content">
    <h1>🎉 Profile View Funcionando!</h1>
    <p>Ruta actual: ${currentPath}</p>
    <p>SubPath: ${subPath}</p>
    <p>Si ves esto, el ProfileView está funcionando correctamente.</p>
</div>

<div class="profile-header">
    <h2>👤 Perfil de Usuario</h2>
    <img src="/images/profile.jpg" alt="Profile" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">
    <h3>John Rodriguez</h3>
    <p>Desarrollador saludable</p>
</div>

<div class="content">
    <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h4>Navegación de Perfil</h4>
        <nav style="display: flex; gap: 1rem; justify-content: center; margin: 1rem 0;">
            <a href="/profile/posts" style="padding: 0.5rem 1rem; background: #38A169; color: white; border-radius: 4px;">Posts</a>
            <a href="/profile/likes" style="padding: 0.5rem 1rem; background: #38A169; color: white; border-radius: 4px;">Likes</a>
            <a href="/profile/settings" style="padding: 0.5rem 1rem; background: #38A169; color: white; border-radius: 4px;">Settings</a>
        </nav>
        
        <div style="margin-top: 2rem;">
            ${/likes/.test(subPath) ? '<p>📋 Sección de Likes</p>' : 
              /settings/.test(subPath) ? '<p>⚙️ Sección de Settings</p>' : 
              '<p>📝 Sección de Posts</p>'}
                 </div>
     </div>
 </div>
         `;
         
         console.log('ProfileView: HTML rendered successfully!');
     }
}

if (!customElements.get('profile-view'))
    customElements.define('profile-view', ProfileView)