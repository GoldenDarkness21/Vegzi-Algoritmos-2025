import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { loginSuccess, logout } from '../flux/actions/auth.actions';

let isRegistering = false;

export const setRegistering = (value: boolean) => {
    isRegistering = value;
};

export const initAuthListener = () => {
    onAuthStateChanged(auth, (user) => {
        if (user && !isRegistering) {
            // user is authenticated and not in registration process
            loginSuccess({
                id: user.uid,
                name: user.displayName || '',
                email: user.email || ''
            });
        } else {
            // user is not authenticated or is in registration process
            logout();
        }
    });
}; 