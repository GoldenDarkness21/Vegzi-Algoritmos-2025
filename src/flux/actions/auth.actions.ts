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

// Login actions
export const loginRequest = (): LoginRequestAction => {
    const action = { type: AuthActionTypes.LOGIN_REQUEST };
    authStore.dispatch(action);
    return action;
};

export const loginSuccess = (user: User): LoginSuccessAction => {
    const action = { 
        type: AuthActionTypes.LOGIN_SUCCESS, 
        payload: user 
    };
    authStore.dispatch(action);
    return action;
};

export const loginFailure = (error: string): LoginFailureAction => {
    const action = { 
        type: AuthActionTypes.LOGIN_FAILURE, 
        payload: error 
    };
    authStore.dispatch(action);
    return action;
};

// Register actions
export const registerRequest = (): RegisterRequestAction => {
    const action = { type: AuthActionTypes.REGISTER_REQUEST };
    authStore.dispatch(action);
    return action;
};

export const registerSuccess = (user: User): RegisterSuccessAction => {
    const action = { 
        type: AuthActionTypes.REGISTER_SUCCESS, 
        payload: user 
    };
    authStore.dispatch(action);
    return action;
};

export const registerFailure = (error: string): RegisterFailureAction => {
    const action = { 
        type: AuthActionTypes.REGISTER_FAILURE, 
        payload: error 
    };
    authStore.dispatch(action);
    return action;
};

// Logout action
export const logout = (): LogoutAction => {
    const action = { type: AuthActionTypes.LOGOUT };
    authStore.dispatch(action);
    return action;
};

// Thunks (para cuando implementes Firebase)
export const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
        loginRequest();
        // Aquí irá tu lógica de Firebase
        // const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // const user = userCredential.user;
        loginSuccess({ email }); // Actualizar con datos de Firebase
    } catch (error) {
        loginFailure(error instanceof Error ? error.message : 'Error desconocido');
    }
};

export const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
    try {
        registerRequest();
        // Aquí irá tu lógica de Firebase
        // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // const user = userCredential.user;
        registerSuccess({ name, email }); // Actualizar con datos de Firebase
    } catch (error) {
        registerFailure(error instanceof Error ? error.message : 'Error desconocido');
    }
};

export const logoutUser = async () => {
    try {
        // Aquí irá tu lógica de Firebase
        // await signOut(auth);
        logout();
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}; 