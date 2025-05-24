import { createSelector } from "@ngrx/store";
import { AuthStore } from "./auth.store";
import { selectAppState } from "../../state/app.selectors";
import { AppStore } from "../../state/app.store";

export const selectAuthState = createSelector(
    selectAppState,
    (state: AppStore) => state.authState
);

export const selectIsAuthenticated = createSelector(
    selectAuthState,
    (state: AuthStore) => state.isAuthenticated
);