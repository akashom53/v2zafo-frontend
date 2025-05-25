import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../auth.service";
import { AuthActions } from "./auth.actions";
import { map, switchMap, catchError, of } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private router = inject(Router);

    login$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap(
            (action) => {
                console.log(action);
                return this.authService
                    .login(action.email, action.password)
                    .pipe(
                        map(data => {
                            this.router.navigate(['/']);
                            return AuthActions.loginSuccess({ token: data.token })
                        }),
                        catchError(error => of(AuthActions.loginFailure({ error })))

                    )
            },
        )));
}