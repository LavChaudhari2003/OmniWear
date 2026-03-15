import { Component, effect, signal, WritableSignal } from '@angular/core';
import { faTrash, faBoxOpen, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartStoreItem } from '../services/cart/cart.storeItem';
import { Router } from '@angular/router';
import { CartItem } from '../types/cart.type';
import { CommonModule } from '@angular/common';
import { Ratings } from '../../ratings/ratings';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoggedInUser } from '../types/user.type';
import { UserService } from '../services/user/user';
import { OrderService } from '../services/order/order';
@Component({
  selector: 'app-cart',
  imports: [FontAwesomeModule, CommonModule, Ratings, ReactiveFormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  faTrash = faTrash;
  faBoxOpen = faBoxOpen;
  faShoppingCart = faShoppingCart;


  alertType: number = 0; // 0-accept   1-warning   2-error
  alertMessage: string = '';
  disabledCheckout: boolean = false;

  user = signal<LoggedInUser>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pin: '',
  });

  orderForm: WritableSignal<FormGroup>;

  constructor(
    public cartStore: CartStoreItem,
    public router: Router,
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private readonly orderService: OrderService,
  ) {
    this.userService.loggedInUserInfo$.subscribe((userInfo) => {
      this.user.set(userInfo);
    });

    this.orderForm = signal(this.createOrderForm(this.user()));

    effect(() => {
      const newUser = this.user();
      this.orderForm.set(this.createOrderForm(newUser));
    });
  }

  private createOrderForm(user: LoggedInUser | null): FormGroup {
    return this.formBuilder.group({
      name: [
        user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
        Validators.required,
      ],
      address: [user?.address || '', Validators.required],
      city: [user?.city || '', Validators.required],
      state: [user?.state || '', Validators.required],
      pin: [user?.pin || '', Validators.required],
    });
  }

  navigateTOHome(): void {
    this.router.navigate(['/home/products']);
  }

  updateQuantity($event: any, cartItem: CartItem): void {
    if ($event.target.innerText === '+') {
      this.cartStore.addProduct(cartItem.product);
    } else if ($event.target.innerText === '-') {
      this.cartStore.decreaseProductQuantity(cartItem);
    }
  }

  removeItem(cartItem: CartItem): void {
    this.cartStore.removeProduct(cartItem);
  }

  onSubmit(): void {
    if(!this.userService.isUserAuthenticated){
      this.alertType = 2;
      this.alertMessage = 'Please login to place the order.';
      this.disabledCheckout = false;
      return;
    }

    const form = this.orderForm();

    if (form.invalid) {
      this.alertType = 1;
      this.alertMessage = 'Please fill in all required fields correctly.';
      this.disabledCheckout = false;
      form.markAllAsTouched();
      return;
    }

    this.alertMessage = '';
    this.disabledCheckout = true;

    const deliveryAddress = {
      userName: form.get('name')?.value,
      address: form.get('address')?.value,
      city: form.get('city')?.value,
      state: form.get('state')?.value,
      pin: form.get('pin')?.value,
    }

    const email = this.user().email;

    if(!email){
      this.alertType = 2;
      this.alertMessage = 'User email is missing. Please login again.';
      this.disabledCheckout = false;
      return;
    }

    this.orderService.saveOrder(deliveryAddress,email).subscribe({
      next: (response) => {
        this.alertType = 0;
        this.alertMessage = 'Order placed successfully!';
        this.cartStore.clearCart();
        this.disabledCheckout = true;
      },
      error: (error) => {
        console.error('Order placement failed:', error);
        this.alertType = 2;
        this.alertMessage = error.error?.message || 'Order placement failed. Please try again.';
        this.disabledCheckout = false;
      }
    });

  }
}
