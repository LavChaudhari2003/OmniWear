import { Component, output, signal } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {faSearch, faUserCircle,faHeart,faShoppingCart} from '@fortawesome/free-solid-svg-icons'
import { CategoriesStoreItem } from '../services/category/categories.storeItems';
import { searchKeyword } from '../types/searchKeyword.type';
import { Router,NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CartStoreItem } from '../services/cart/cart.storeItem';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  faSearch = faSearch;
  faUserCircle = faUserCircle;
  faHeart = faHeart;
  faShoppingCart = faShoppingCart;

  displaySearchbar = signal(true);


  readonly searchClicked = output<searchKeyword>();


  constructor(public categoryStore: CategoriesStoreItem,private router: Router,public cart: CartStoreItem) {
    router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) =>{
        this.displaySearchbar.set(event.url ==='/home/products');
      });
  }

  onClickSearch(keyword: string, categoryId: string) {
    this.searchClicked.emit({ keyword, categoryId: Number.parseInt(categoryId) });
  }

  navigateToCart() {
    this.router.navigate(['/home/cart']);
  }
}
