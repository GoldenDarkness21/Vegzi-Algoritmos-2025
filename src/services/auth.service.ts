import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { loginSuccess, logout } from '../flux/actions/auth.actions';

export const initAuthListener = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // user is authenticated
            loginSuccess({
                id: user.uid,
                name: user.displayName || '',
                email: user.email || ''
            });
        } else {
            // user is not authenticated
            logout();
        }
    });
}; 