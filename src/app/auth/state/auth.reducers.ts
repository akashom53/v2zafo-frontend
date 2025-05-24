import { createReducer, on } from "@ngrx/store";
import { initialAppState } from "../../state/app.store";
import { AuthActions } from "./auth.actions";

export const authReducer = createReducer(
    initialAppState,
    on(AuthActions.loginSuccess, (state) => {
        return {
            ...state,
            authState: {
                ...state.authState,
                isAuthenticated: true
            }
        }
    }),
    on(AuthActions.loginFailure, (state) => {
        return {
            ...state,
            authState: {
                ...state.authState,
                isAuthenticated: false
            }
        }
    })
);