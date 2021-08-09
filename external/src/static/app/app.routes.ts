import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './core/component/error/404-page/404.component';
import { ErrorPageComponent } from './core/component/error/500-page/500.component';

export const AppRoute: Routes = [
        
    {
        path: 'error',
        component: ErrorPageComponent
      },
      {
        path: '**',
        component: PageNotFoundComponent
      }
];

export const appRouting: ModuleWithProviders<RouterModule> = <ModuleWithProviders<RouterModule>> RouterModule.forRoot(AppRoute, { relativeLinkResolution: 'legacy' });
