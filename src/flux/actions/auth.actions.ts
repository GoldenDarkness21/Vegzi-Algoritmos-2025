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
import { createUserProfile } from '../../services/firestore.service';

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
            loginFailure('Error: No se pudo obtener la información del usuario');
        }
    } catch (error) {
        let errorMessage = 'Error desconocido';
        if (error instanceof Error) {
            // Personalizar mensajes de error comunes
            switch (error.message) {
                case 'Firebase: Error (auth/invalid-credential).':
                    errorMessage = 'Correo electrónico o contraseña incorrectos';
                    break;
                case 'Firebase: Error (auth/user-not-found).':
                    errorMessage = 'No existe una cuenta con este correo electrónico';
                    break;
                case 'Firebase: Error (auth/wrong-password).':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'Firebase: Error (auth/invalid-email).':
                    errorMessage = 'Correo electrónico inválido';
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
        
        // Actualizar el perfil del usuario con su nombre
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName: name
            });
        }

        const { uid } = userCredential.user;
        
        // Crear perfil en Firestore
        await createUserProfile(uid, {
            name,
            email,
            photoURL: '',
            bio: '',
            favoriteRecipes: []
        });

        registerSuccess({ 
            id: uid,
            name,
            email 
        });
    } catch (error) {
        let errorMessage = 'Error desconocido';
        if (error instanceof Error) {
            // Personalizar mensajes de error comunes
            switch (error.message) {
                case 'Firebase: Error (auth/email-already-in-use).':
                    errorMessage = 'Este correo electrónico ya está registrado. Por favor, utiliza otro o inicia sesión.';
                    break;
                case 'Firebase: Error (auth/invalid-email).':
                    errorMessage = 'El correo electrónico no es válido';
                    break;
                case 'Firebase: Error (auth/weak-password).':
                    errorMessage = 'La contraseña debe tener al menos 6 caracteres';
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
        console.error('Error al cerrar sesión:', error);
    }
}; 