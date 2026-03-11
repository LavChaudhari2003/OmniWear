import { Component } from '@angular/core';
import { ProductsList } from './products-list';
import { ProductListItem } from './product.type';
import { CommonModule } from '@angular/common';
import { Ratings } from '../ratings/ratings';
@Component({
  selector: 'app-products',
  imports: [CommonModule,Ratings],
  templateUrl: './products.html',
  styleUrl: './products.css',
  providers: [ProductsList],
})
export class Products {
  products:ProductListItem[] = [];

  constructor(private productsList: ProductsList) {
    this.products = this.productsList.getProductsList();
  }
}
