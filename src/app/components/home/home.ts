import { Component } from '@angular/core';
import { Header } from './header/header';
import { CatagoryNavigation } from './catagory-navigation/catagory-navigation';
import { CategoryService } from './services/category/category';
import { CategoriesStoreItem } from './services/category/categories.storeItems';
import { ProductStoreItem } from './services/category/product/products.storeItem';
import { ProductService } from './services/category/product/products.service';
import { searchKeyword } from './types/searchKeyword.type';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CartStoreItem } from './services/cart/cart.storeItem';
import { filter } from 'rxjs/operators';
import { UserService } from './services/user/user';
import { OrderService } from './services/order/order';
@Component({
  selector: 'app-home',
  imports: [Header, CatagoryNavigation, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers: [
    CategoriesStoreItem,
    CategoryService,
    ProductStoreItem,
    ProductService,
    CartStoreItem,
    UserService,
    OrderService,
  ],
})
export class Home {
  constructor(
    private readonly categoriesStoreItem: CategoriesStoreItem,
    private readonly productStoreItem: ProductStoreItem,
    private readonly cartStoreItem: CartStoreItem,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {
    this.categoriesStoreItem.loadCategories();
    this.productStoreItem.loadProducts();

    router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      if ((event as NavigationEnd).url === '/home') {
        router.navigate(['/home/products']);
      }
    });
  }

  onSelectedMainCategory(mainCategoryId: number) {
    this.productStoreItem.loadProducts({ mainCategoryId: mainCategoryId });
  }

  onSearchKeword(searchKeyword: searchKeyword) {
    this.productStoreItem.loadProducts({
      keyword: searchKeyword.keyword,
      mainCategoryId: searchKeyword.categoryId,
    });
  }
}
