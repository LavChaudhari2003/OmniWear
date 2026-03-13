import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ratings } from '../ratings/ratings';
import { Product } from '../home/types/product.type';
import { ProductStoreItem } from '../home/services/category/product/products.storeItem';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-products',
  imports: [CommonModule, Ratings, FontAwesomeModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  products:Product[] = [];
  faBoxOpen = faBoxOpen;
  constructor(public productStore: ProductStoreItem) {
    
  }
}
