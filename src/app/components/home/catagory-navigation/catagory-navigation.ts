import { Component } from '@angular/core';
import { CategoryService } from '../services/category';
import { Category } from '../types/category';
import { CategoriesStoreItem } from '../services/categories.storeItems';
@Component({
  selector: 'app-catagory-navigation',
  imports: [],
  templateUrl: './catagory-navigation.html',
  styleUrl: './catagory-navigation.css',
})
export class CatagoryNavigation {
  categories: Category[] = [];

  constructor(public categoryStore: CategoriesStoreItem) {}
}
