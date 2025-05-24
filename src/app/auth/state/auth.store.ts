export interface AuthStore {
    isAuthenticated: boolean;
    token?: string;
}

export const initialAuthState: AuthStore = {
    isAuthenticated: false,
    token: undefined
};