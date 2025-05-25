import { createActionGroup, props } from "@ngrx/store";

export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        'Login': props<{ email: string, password: string }>(),
        'Login Success': props<{ token: string }>(),
        'Login Failure': props<{ error: any }>(),
        'Signup': props<{ name: string, email: string, password: string }>(),
        'Signup Success': props<{ i: number }>(),
        'Signup Failure': props<{ error: any }>(),
    }
})