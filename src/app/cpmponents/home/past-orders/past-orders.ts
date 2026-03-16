import { Component, computed, effect, inject, signal } from '@angular/core';
import { PastOrder, PastOrderProduct } from '../../../components/home/types/order.type';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../components/home/services/order/order';
import { UserService } from '../../../components/home/services/user/user';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-past-orders',
  imports: [CommonModule],
  templateUrl: './past-orders.html',
  styleUrl: './past-orders.css',
})
export class PastOrders {
  private readonly orderServise = inject(OrderService);
  private readonly userService = inject(UserService);

  selectedOrderId = signal<number | null>(null);

  readonly pastOrderProducts = signal<PastOrderProduct[]>([]);


  readonly pastOrders = toSignal(
    this.userService.loggedInUserInfo$.pipe(
      map((user) => user?.email?.trim() ?? ''),
      switchMap((email) => email ? this.orderServise.getOrders(email) : of([] as PastOrder[])),
    ),
    {initialValue: [] as PastOrder[]}
  );

  readonly pastOrder = computed(()=>{
    return this.pastOrders().find(order => order.orderId === this.selectedOrderId()) || null;
  })


  constructor(){
    effect(()=>{
      const id = this.selectedOrderId();

      if(id){
        this.orderServise.getOrderProducts(id).subscribe((productsData)=>{
          this.pastOrderProducts.set(productsData);
        })
      }else{
        this.pastOrderProducts.set([]);
      }
    });
  }

  selectOrder(event: Event) {
    const value = Number.parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedOrderId.set(value > 0 ? value : null);
  }
}
