import { AuthState, AuthAction, AuthActionTypes } from '../types/auth.types';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

class AuthStore extends EventTarget {
    private state: AuthState = initialState;

    getState(): AuthState {
        return this.state;
    }

    private setState(newState: AuthState): void {
        this.state = newState;
        this.dispatchEvent(new CustomEvent('stateChange', { detail: this.state }));
    }

    dispatch(action: AuthAction): void {
        switch (action.type) {
            case AuthActionTypes.LOGIN_REQUEST:
            case AuthActionTypes.REGISTER_REQUEST:
                this.setState({
                    ...this.state,
                    loading: true,
                    error: null
                });
                break;

            case AuthActionTypes.LOGIN_SUCCESS:
            case AuthActionTypes.REGISTER_SUCCESS:
                this.setState({
                    ...this.state,
                    user: action.payload,
                    isAuthenticated: true,
                    loading: false,
                    error: null
                });
                break;

            case AuthActionTypes.LOGIN_FAILURE:
            case AuthActionTypes.REGISTER_FAILURE:
                this.setState({
                    ...this.state,
                    loading: false,
                    error: action.payload,
                    isAuthenticated: false,
                    user: null
                });
                break;

            case AuthActionTypes.LOGOUT:
                this.setState(initialState);
                break;

            default:
                break;
        }
    }

    subscribe(callback: (state: AuthState) => void): () => void {
        const handler = (event: Event) => {
            callback((event as CustomEvent).detail);
        };

        this.addEventListener('stateChange', handler);
        return () => this.removeEventListener('stateChange', handler);
    }
}

export const authStore = new AuthStore(); 