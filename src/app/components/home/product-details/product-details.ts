import { Component, inject, signal } from '@angular/core';
import { Ratings } from '../../ratings/ratings';
import { ProductService } from '../services/category/product/products.service';
import { Product } from '../types/product.type';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-details',
  imports: [Ratings,CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  readonly product = signal<Product | null>(null);

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
}
