export interface User {
    id?: string;
    name?: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export enum AuthActionTypes {
    LOGIN_REQUEST = 'LOGIN_REQUEST',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',
    REGISTER_REQUEST = 'REGISTER_REQUEST',
    REGISTER_SUCCESS = 'REGISTER_SUCCESS',
    REGISTER_FAILURE = 'REGISTER_FAILURE',
    LOGOUT = 'LOGOUT'
}

export interface LoginRequestAction {
    type: AuthActionTypes.LOGIN_REQUEST;
}

export interface LoginSuccessAction {
    type: AuthActionTypes.LOGIN_SUCCESS;
    payload: User;
}

export interface LoginFailureAction {
    type: AuthActionTypes.LOGIN_FAILURE;
    payload: string;
}

export interface RegisterRequestAction {
    type: AuthActionTypes.REGISTER_REQUEST;
}

export interface RegisterSuccessAction {
    type: AuthActionTypes.REGISTER_SUCCESS;
    payload: User;
}

export interface RegisterFailureAction {
    type: AuthActionTypes.REGISTER_FAILURE;
    payload: string;
}

export interface LogoutAction {
    type: AuthActionTypes.LOGOUT;
}

export type AuthAction =
    | LoginRequestAction
    | LoginSuccessAction
    | LoginFailureAction
    | RegisterRequestAction
    | RegisterSuccessAction
    | RegisterFailureAction
    | LogoutAction; 