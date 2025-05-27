import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { loginSuccess, logout } from '../flux/actions/auth.actions';

export const initAuthListener = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuario está autenticado
            loginSuccess({
                id: user.uid,
                name: user.displayName || '',
                email: user.email || ''
            });
        } else {
            // Usuario no está autenticado
            logout();
        }
    });
}; 