import { Component } from '@angular/core';
import { faTrash, faBoxOpen, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartStoreItem } from '../services/cart/cart.storeItem';
import { Router } from '@angular/router';
import { CartItem } from '../types/cart.type';
import { CommonModule } from '@angular/common';
import { Ratings } from "../../ratings/ratings";
@Component({
  selector: 'app-cart',
  imports: [FontAwesomeModule, CommonModule, Ratings],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  faTrash = faTrash;
  faBoxOpen = faBoxOpen;
  faShoppingCart = faShoppingCart;
  constructor(public cartStore: CartStoreItem, public router: Router) { }

  navigateTOHome(): void {
    this.router.navigate(['/home/products']);
  }

  updateQuantity($event: any, cartItem: CartItem): void {
    if ($event.target.innerText === '+') {
      this.cartStore.addProduct(cartItem.product);
    } else if ($event.target.innerText === '-') {
      this.cartStore.decreaseProductQuantity(cartItem);
    }
  }

  removeItem(cartItem: CartItem): void {
    this.cartStore.removeProduct(cartItem);
  }
}
