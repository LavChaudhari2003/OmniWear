import { Component, inject, signal } from '@angular/core';
import { Ratings } from '../../ratings/ratings';
import { ProductService } from '../services/category/product/products.service';
import { Product } from '../types/product.type';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CartStoreItem } from '../services/cart/cart.storeItem';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-product-details',
  imports: [Ratings,CommonModule,FontAwesomeModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartStoreItem);
  readonly product = signal<Product | null>(null);
  faShoppingCart = faShoppingCart;

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const productId = idParam ? Number.parseInt(idParam) : null;

    if (productId !== null && !Number.isNaN(productId)) {
      this.productService.getProduct(productId).
        pipe(takeUntilDestroyed())
        .subscribe((res) => {
          this.product.set(Array.isArray(res) ? res[0] : res);
        });
        return;
    }
  }

  addtoCart(){
    if(this.product()){
      this.cart.addProduct(this.product()!);
    }
  }
}
