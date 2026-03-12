import { Component, output } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {faSearch, faUserCircle,faHeart,faShoppingCart} from '@fortawesome/free-solid-svg-icons'
import { CategoriesStoreItem } from '../services/category/categories.storeItems';
import { searchKeyword } from '../types/searchKeyword.type';
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


  readonly searchClicked = output<searchKeyword>();


  constructor(public categoryStore: CategoriesStoreItem) {}

  onClickSearch(keyword: string, categoryId: string) {
    this.searchClicked.emit({ keyword, categoryId: Number.parseInt(categoryId) });
  }
}
