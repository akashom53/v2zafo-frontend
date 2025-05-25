import { Routes } from '@angular/router';
import { MainLayoutComponent } from './ui/components/layout/main-layout/main-layout.component';
import { ChatComponent } from './ui/components/chat/chat.component';
import { LoginComponent } from './ui/pages/login/login.component';
import { SignupComponent } from './ui/pages/signup/signup.component';
import { DashboardComponent } from './ui/pages/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                component: DashboardComponent
            },
            {
                path: 'chat',
                component: ChatComponent
            },
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'signup',
        component: SignupComponent,
    },
];
