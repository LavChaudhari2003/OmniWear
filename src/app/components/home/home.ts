import { Component } from '@angular/core';
import { Header } from './header/header';
import { CatagoryNavigation } from './catagory-navigation/catagory-navigation';
import { CategoryService } from './services/category/category';
import { CategoriesStoreItem } from './services/category/categories.storeItems';
import { ProductStoreItem } from './services/category/product/products.storeItem';
import { ProductService } from './services/category/product/products.service';
import { searchKeyword } from './types/searchKeyword.type';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [Header,CatagoryNavigation,RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers:[CategoriesStoreItem,CategoryService,ProductStoreItem,ProductService]
})
export class Home {
  constructor(
    private readonly categoriesStoreItem: CategoriesStoreItem,
    private readonly productStoreItem: ProductStoreItem
  ) {
    this.categoriesStoreItem.loadCategories();
    this.productStoreItem.loadProducts();
  }

  

  onSelectedMainCategory(mainCategoryId: number) {
    this.productStoreItem.loadProducts({ mainCategoryId:mainCategoryId });
  }

  onSearchKeword(searchKeyword: searchKeyword) {
    this.productStoreItem.loadProducts({ keyword: searchKeyword.keyword, mainCategoryId: searchKeyword.categoryId });
  }
}
