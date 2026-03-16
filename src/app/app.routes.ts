import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { NotFound } from './components/not-found/not-found';
import { ProductsGalery } from './components/home/products-galery/products-galery';
import { ProductDetails } from './components/home/product-details/product-details';
import { Cart } from './components/home/cart/cart';
import { UserSignup } from './cpmponents/home/user/user-signup/user-signup';
import { UserLogin } from './cpmponents/home/user/user-login/user-login';
import { PastOrders } from './cpmponents/home/past-orders/past-orders';
import { authGuard } from './components/home/services/auth-guard';

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
            },
            {
                path: "cart",
                component: Cart,
            },
            {
                path:"signup",
                component: UserSignup,
            },
            {
                path:"login",
                component: UserLogin,
            },
            {
                path:"pastorders",
                component: PastOrders,
                canActivate: [authGuard],
            }
        ]

    },
    { path: "", redirectTo: 'home/products', pathMatch: 'full' },
    { path: '**', component: NotFound },
];
