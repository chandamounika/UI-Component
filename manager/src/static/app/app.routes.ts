import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const appRoute: Routes = [
    {
        path: '',
        redirectTo: 'applications/permitinventory',
        pathMatch: 'full'
    },
   
    {
        path: '**',
        redirectTo: 'applications/permitinventory',
        pathMatch: 'full'
    }
];

export const appRouting: ModuleWithProviders<any> = RouterModule.forRoot(appRoute, { relativeLinkResolution: 'legacy' });

