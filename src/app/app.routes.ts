import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { NotFound } from './components/not-found/not-found';
import { ProductsGalery } from './components/home/products-galery/products-galery';
import { ProductDetails } from './components/home/product-details/product-details';

export const routes: Routes = [
    // {path:'home', component: Home},
    {
        path: 'home',
        loadComponent: () => {
            return import('./components/home/home').then(m => m.Home)
        },
        children: [
            {
                path: "products",
                component: ProductsGalery,
            },
            {
                path: "product/:id",
                component:ProductDetails,
            }
        ]

    },
    { path: "", redirectTo: 'home/products', pathMatch: 'full' },
    { path: '**', component: NotFound },
];
