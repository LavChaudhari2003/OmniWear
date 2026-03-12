import { Component, output } from '@angular/core';
import { Category } from '../types/category';
import { CategoriesStoreItem } from '../services/category/categories.storeItems';
@Component({
  selector: 'app-catagory-navigation',
  standalone: true,
  imports: [],
  templateUrl: './catagory-navigation.html',
  styleUrl: './catagory-navigation.css',
})
export class CatagoryNavigation {
  categories: Category[] = [];
  readonly categoryClicked = output<number>();
  constructor(public categoryStore: CategoriesStoreItem) {}

  onClickCategory(category: Category) {
    this.categoryClicked.emit(category.id);
  }
}
