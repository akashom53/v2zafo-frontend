import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../auth.service";
import { AuthActions } from "./auth.actions";
import { map, switchMap, catchError, of } from "rxjs";

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authService = inject(AuthService);

    login$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap(
            (action) => {
                console.log(action);
                return this.authService
                    .login(action.email, action.password)
                    .pipe(
                        map(data => AuthActions.loginSuccess({ token: data.access_token })),
                        catchError(error => of(AuthActions.loginFailure({ error })))

                    )
            },
        )));
}