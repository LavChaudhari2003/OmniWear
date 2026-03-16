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


export interface PastOrder {
    orderId: number;
    userName: string;
    address: string;
    city: string;
    state: string;
    pin: string;
    total: number;
    orderDate: string;
}

export interface PastOrderProduct {
    productId: number;
    productImage: string;
    qty: number;
    price: number;
    amount: number;
    productName: string;
}