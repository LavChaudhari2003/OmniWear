import { Component } from '@angular/core';
import { ProductService } from '../home/services/category/product/products.service';
import { CommonModule } from '@angular/common';
import { Ratings } from '../ratings/ratings';
import { Product } from '../home/types/product.type';
import { ProductStoreItem } from '../home/services/category/product/products.storeItem';
@Component({
  selector: 'app-products',
  imports: [CommonModule,Ratings],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  products:Product[] = [];

  constructor(public productStore: ProductStoreItem) {
    
  }
}
