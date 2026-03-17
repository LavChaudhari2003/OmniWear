import { Component, effect, signal, WritableSignal } from '@angular/core';
import { faTrash, faBoxOpen, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartStoreItem } from '../services/cart/cart.storeItem';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from '../types/cart.type';
import { CommonModule } from '@angular/common';
import { Ratings } from '../../ratings/ratings';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoggedInUser } from '../types/user.type';
import { UserService } from '../services/user/user';
import { OrderService } from '../services/order/order';
import { sign } from 'node:crypto';
import { StripeService } from '../services/stripe/stripe';
import { of, switchMap } from 'rxjs';
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
  paymentSuccess = signal(false);

  constructor(
    public cartStore: CartStoreItem,
    public router: Router,
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private readonly orderService: OrderService,
    private readonly stripeService: StripeService,
    private readonly route: ActivatedRoute,
  ) {
    this.userService.loggedInUserInfo$.subscribe((userInfo) => {
      this.user.set(userInfo);
    });

    this.orderForm = signal(this.createOrderForm(this.user()));

    effect(() => {
      const newUser = this.user();
      this.orderForm.set(this.createOrderForm(newUser));
    });

    this.route.queryParams.pipe(
      switchMap((params) => {
        if (params['status'] === "success" && !this.paymentSuccess()) {
          this.paymentSuccess.set(true);

          // reStore cart from local storage
          const storedCart = localStorage.getItem('cart');

          if (storedCart) {

            try {
              const cartData = JSON.parse(storedCart);
              this.orderForm().patchValue(cartData);
              localStorage.removeItem('cart');
            }
            catch (error) {
              console.error('Error parsing stored cart data:', error);
              this.alertType = 2;
              this.alertMessage = 'Payment was successful, but there was an issue restoring your cart data. Please review your order details and try again if necessary.';
              return of(null);
            }
          }
          return this.userService.loggedInUserInfo$;
        } else if (params['status'] === 'cancel') {
          this.alertType = 2;
          this.alertMessage = 'Payment was cancelled. You can review your cart and try again.';
          return of(null);
        } else {
          return of(null);
        }
      })
    ).subscribe((userInfo) => {
      if (userInfo && this.paymentSuccess()) {
        this.user.set(userInfo);
        this.saveOrder();
      }
    });

  }

  checkout() {

    if (!this.userService.isUserAuthenticated) {
      this.alertType = 2;
      this.alertMessage = 'Please login to proceed to checkout.';
      return;
    }
    if (this.cartStore.cart().products.length > 0 && this.orderForm().valid) {
      localStorage.setItem("orderFormData", JSON.stringify(this.orderForm().value));
      this.stripeService.redirectToCheckout(this.cartStore.cart().products);
    } else {
      this.alertType = 2;
      this.alertMessage = 'Please ensure your cart is not empty and all required fields are filled correctly.';
    }

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

  private saveOrder(): void {
    if (!this.userService.isUserAuthenticated) {
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

    if (!email) {
      this.alertType = 2;
      this.alertMessage = 'User email is missing. Please login again.';
      this.disabledCheckout = false;
      return;
    }

    this.orderService.saveOrder(deliveryAddress, email).subscribe({
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
