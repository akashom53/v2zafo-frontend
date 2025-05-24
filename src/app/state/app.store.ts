import { AuthStore, initialAuthState } from "../auth/state/auth.store";

export interface AppStore {
    authState: AuthStore;
}

export const initialAppState: AppStore = {
    authState: initialAuthState
};