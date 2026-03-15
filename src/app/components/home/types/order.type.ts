export interface OrderItem {
    productId: number;
    qty: number;
    price: number;
    amount: number;
}

export interface Order {
    userName: string;
    userEmail: string;
    address: string;
    city: string;
    state: string;
    pin: string;
    total: number;
    orderDetails: OrderItem[];
}