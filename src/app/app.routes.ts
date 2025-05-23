import { Routes } from '@angular/router';
import { HomeComponent } from './ui/pages/home/home.component';
import { MainLayoutComponent } from './ui/components/layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            }
        ]
    }
];
