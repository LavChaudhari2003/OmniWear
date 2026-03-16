import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartStoreItem } from '../cart/cart.storeItem';
import { UserService } from '../user/user';
import { DeliveryAddress } from '../../types/cart.type';
import { Observable } from 'rxjs';
import { Order, OrderItem, PastOrder, PastOrderProduct } from '../../types/order.type';

@Injectable()
export class OrderService {
  constructor(
    private http: HttpClient,
    private cartStore: CartStoreItem,
    private userService: UserService,
  ){}

  saveOrder(deliveryAddress: DeliveryAddress,userEmail:string):Observable<any>{
    const url = 'http://localhost:5001/orders/add';
    const orderDetails : OrderItem[] = [];

    this.cartStore.cart().products.forEach((product) =>{
         const OrderItem : OrderItem = {
          productId: product.product.id,
          qty: product.quantity,
          price: product.product.price,
          amount: product.amount
         }
         orderDetails.push(OrderItem);
    });

    const order : Order = {
      userName: deliveryAddress.userName,
      userEmail: userEmail,
      address: deliveryAddress.address,
      city: deliveryAddress.city,
      state: deliveryAddress.state,
      pin: deliveryAddress.pin,
      total: this.cartStore.cart().totalAmount,
      orderDetails: orderDetails
    } ;

    return this.http.post<any>(url, order,{
      headers: { authorization: this.userService.token}
    });

  }
  getOrders(userEmail: string): Observable<PastOrder[]> {
    const url = `http://localhost:5001/orders/allorders?userEmail=${userEmail}`;

    return this.http.get<PastOrder[]>(url, {
      headers: { authorization: this.userService.token }
    });
  }

  getOrderProducts(orderId: number): Observable<PastOrderProduct[]> {
    const url = `http://localhost:5001/orders/orderproducts?orderId=${orderId}`;

    return this.http.get<PastOrderProduct[]>(url, {
      headers: { authorization: this.userService.token }
    }); 
  }
}
