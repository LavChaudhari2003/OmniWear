import { Component } from '@angular/core';
import { Header } from './header/header';
import { CatagoryNavigation } from './catagory-navigation/catagory-navigation';
import { SideNavigation } from './side-navigation/side-navigation';
import { Products } from '../products/products';
import { CategoriesStoreItem } from './services/categories.storeItems';
import { CategoryService } from './services/category';
@Component({
  selector: 'app-home',
  imports: [Header,CatagoryNavigation,SideNavigation, Products],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers:[CategoriesStoreItem,CategoryService]
})
export class Home {
  constructor(private categoriesStoreItem: CategoriesStoreItem, private categoryService: CategoryService) {
    this.categoriesStoreItem.loadCategories();
  }
}
