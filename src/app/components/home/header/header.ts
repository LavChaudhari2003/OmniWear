import { Component, effect, output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faUserCircle, faHeart, faShoppingCart,faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { CategoriesStoreItem } from '../services/category/categories.storeItems';
import { searchKeyword } from '../types/searchKeyword.type';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CartStoreItem } from '../services/cart/cart.storeItem';
import { UserService } from '../services/user/user';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  faSearch = faSearch;
  faUserCircle = faUserCircle;
  faHeart = faHeart;
  faShoppingCart = faShoppingCart;
  faChevronDown = faChevronDown;

  dropdownVisible = false;

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  displaySearchbar = signal(true);

  readonly searchClicked = output<searchKeyword>();

  isUserAuthenticated = signal(false);
  username = signal('');

  constructor(
    public categoryStore: CategoriesStoreItem,
    private readonly router: Router,
    public cart: CartStoreItem,
    public userService: UserService,
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.displaySearchbar.set(event.url === '/home/products');
      });

    const isUserAuthenticatedSignal = toSignal(this.userService.isUserAuhtenticated$, { initialValue: false });

    const loggedInUserInfoSignal = toSignal(this.userService.loggedInUserInfo$, {
      initialValue: {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pin: '',
      }
    });

    effect(() =>{
      this.isUserAuthenticated.set(isUserAuthenticatedSignal());
      this.username.set(loggedInUserInfoSignal().firstName);
    })
  }

  onClickSearch(keyword: string, categoryId: string) {
    this.searchClicked.emit({ keyword, categoryId: Number.parseInt(categoryId) });
  }

  navigateToCart() {
    this.router.navigate(['/home/cart']);
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/home/products']);
  }

  navigateToPastOrders(): void {
    this.router.navigate(['/home/pastorders']);
  }


}
