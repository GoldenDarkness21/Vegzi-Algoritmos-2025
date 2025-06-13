import { 
    AuthActionTypes, 
    User, 
    LoginRequestAction, 
    LoginSuccessAction, 
    LoginFailureAction,
    RegisterRequestAction,
    RegisterSuccessAction,
    RegisterFailureAction,
    LogoutAction
} from '../types/auth.types';
import { authStore } from '../store/auth.store';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { auth } from '../../config/firebase.config';

// Login actions
export const loginRequest = (): LoginRequestAction => {
    const action: LoginRequestAction = { type: AuthActionTypes.LOGIN_REQUEST };
    authStore.dispatch(action);
    return action;
};

export const loginSuccess = (user: User): LoginSuccessAction => {
    const action: LoginSuccessAction = { 
        type: AuthActionTypes.LOGIN_SUCCESS, 
        payload: user 
    };
    authStore.dispatch(action);
    return action;
};

export const loginFailure = (error: string): LoginFailureAction => {
    const action: LoginFailureAction = { 
        type: AuthActionTypes.LOGIN_FAILURE, 
        payload: error 
    };
    authStore.dispatch(action);
    return action;
};

// Register actions
export const registerRequest = (): RegisterRequestAction => {
    const action: RegisterRequestAction = { type: AuthActionTypes.REGISTER_REQUEST };
    authStore.dispatch(action);
    return action;
};

export const registerSuccess = (user: User): RegisterSuccessAction => {
    const action: RegisterSuccessAction = { 
        type: AuthActionTypes.REGISTER_SUCCESS, 
        payload: user 
    };
    authStore.dispatch(action);
    return action;
};

export const registerFailure = (error: string): RegisterFailureAction => {
    const action: RegisterFailureAction = { 
        type: AuthActionTypes.REGISTER_FAILURE, 
        payload: error 
    };
    authStore.dispatch(action);
    return action;
};

// Logout action
export const logout = (): LogoutAction => {
    const action: LogoutAction = { type: AuthActionTypes.LOGOUT };
    authStore.dispatch(action);
    return action;
};

// Firebase Authentication Thunks
export const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
        loginRequest();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
            const { displayName, email: userEmail, uid } = userCredential.user;
            loginSuccess({ 
                id: uid,
                name: displayName || '',
                email: userEmail || ''
            });
        } else {
            loginFailure('Error: unable to get user information');
        }
    } catch (error) {
        let errorMessage = 'Error unknown';
        if (error instanceof Error) {
            // custom error messages
            switch (error.message) {
                case 'Firebase: Error (auth/invalid-credential).':
                    errorMessage = 'Invalid email or password';
                    break;
                case 'Firebase: Error (auth/user-not-found).':
                    errorMessage = 'No account with this email';
                    break;
                case 'Firebase: Error (auth/wrong-password).':
                    errorMessage = 'Invalid password';
                    break;
                case 'Firebase: Error (auth/invalid-email).':
                    errorMessage = 'Invalid email';
                    break;
                default:
                    errorMessage = error.message;
            }
        }
        loginFailure(errorMessage);
    }
};

export const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
    try {
        registerRequest();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // update user profile with their name
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName: name
            });
        }

        const { uid } = userCredential.user;
        
        registerSuccess({ 
            id: uid,
            name,
            email 
        });
    } catch (error) {
        let errorMessage = 'Error unknown';
        if (error instanceof Error) {
            // custom error messages
            switch (error.message) {
                case 'Firebase: Error (auth/email-already-in-use).':
                    errorMessage = 'This email is already in use. Please use another one or login.';
                    break;
                case 'Firebase: Error (auth/invalid-email).':
                    errorMessage = 'the email is not valid';
                    break;
                case 'Firebase: Error (auth/weak-password).':
                    errorMessage = 'the password must be at least 6 characters long';
                    break;
                default:
                    errorMessage = error.message;
            }
        }
        registerFailure(errorMessage);
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        logout();
    } catch (error) {
        console.error('Error logging out:', error);
    }
}; 