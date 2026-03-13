import { Component, output, signal } from '@angular/core';
import { Category } from '../types/category';
import { CategoriesStoreItem } from '../services/category/categories.storeItems';
import { Router,NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-catagory-navigation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './catagory-navigation.html',
  styleUrl: './catagory-navigation.css',
})
export class CatagoryNavigation {
  categories: Category[] = [];
  displayOptions = signal(true);
  readonly categoryClicked = output<number>();
  constructor(public categoryStore: CategoriesStoreItem, private router: Router) {
      router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) =>{
        this.displayOptions.set(event.url ==='/home/products');
      });
  }

  onClickCategory(category: Category) {
    this.categoryClicked.emit(category.id);
  }
}
