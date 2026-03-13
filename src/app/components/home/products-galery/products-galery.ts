import { Component } from '@angular/core';
import { Products } from '../../products/products';
import { SideNavigation } from '../side-navigation/side-navigation';
import { ProductStoreItem } from '../services/category/product/products.storeItem';

@Component({
  selector: 'app-products-galery',
  imports: [Products,SideNavigation],
  templateUrl: './products-galery.html',
  styleUrl: './products-galery.css',
})
export class ProductsGalery {
  constructor(private readonly productStoreItem : ProductStoreItem) {}

  onSelectedSubCategory(subCategoryId: number) {
    this.productStoreItem.loadProducts({ subCategoryId });
  }
}
