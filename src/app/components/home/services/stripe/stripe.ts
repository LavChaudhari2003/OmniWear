import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { loadStripe, Stripe, } from '@stripe/stripe-js'
import { Router } from '@angular/router';
import { UserService } from '../user/user';
import { of, switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class StripeService {

  private stripePromice: Promise<Stripe | null>;

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
    this.stripePromice = loadStripe(environment.stripePublickey);
  }

  async redirectToCheckout(cartItems: any[]): Promise<string | void> {
    try {
      const stripe = await this.stripePromice;

      if (!stripe) {
        console.error('Stripe failed to load.');
        return;
      }
      this.createCheckoutSession(cartItems).subscribe({
        next: (session: { id: string; url?: string }) => {
          // Use the session URL if available, otherwise fallback to old method
          if (session.url) {
            window.location.href = session.url;
          } else {
            // Fallback for older responses that don't include url
            window.location.href = `https://checkout.stripe.com/pay/${session.id}`;
          }
        },
        error: (error) => {
          console.error('Error creating checkout session:', error);
          this.router.navigate(['/home/cart'], {
            queryParams: {
              error: error.message || 'An error occurred while processing your payment. Please try again.',
              status: 'checkout_error',
            }
          });
        }
      });
    } catch (error) {
      console.error('Error loading Stripe:', error);
      return;
    }
  }

  private createCheckoutSession(cartItems: any[]): Observable<{ id: string; url?: string }> {
    const url = 'http://localhost:5001/checkout/create-checkout-session';

    const body = {
      cartItems: cartItems.map(item => {
        return {
          name: item.product.product_name,
          price: item.product.price,
          quantity: item.quantity,
        }
      })
    };

    const headers = new HttpHeaders({
      'Authorization': this.userService.token
    });

    return this.http.post<{ id: string; url?: string }>(url, body, { headers });
  }

}
