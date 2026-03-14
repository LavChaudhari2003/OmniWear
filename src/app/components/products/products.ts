import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ratings } from '../ratings/ratings';
import { Product } from '../home/types/product.type';
import { ProductStoreItem } from '../home/services/category/product/products.storeItem';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoxOpen,faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from "@angular/router";
import { CartStoreItem } from '../home/services/cart/cart.storeItem';
@Component({
  selector: 'app-products',
  imports: [CommonModule, Ratings, FontAwesomeModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  faBoxOpen = faBoxOpen;
  faShoppingCart = faShoppingCart;
  constructor(public productStore: ProductStoreItem, private cartStore: CartStoreItem) {}

  addtoCart(product: Product){
    this.cartStore.addProduct(product);
  }
}
