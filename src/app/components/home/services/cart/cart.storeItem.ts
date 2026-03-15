import { computed, effect, signal } from '@angular/core';
import { CartItem } from '../../types/cart.type';
import { Product } from '../../types/product.type';

export class CartStoreItem {
    private readonly _products = signal<CartItem[]>(this.loadFromSassion());

    private readonly _saveEffect = effect(() => {
        if (!this.hasSessionStorage()) {
            return;
        }

        const products = this._products();
        if (products.length > 0) {
            sessionStorage.setItem('cart', JSON.stringify(products));
        } else {
            sessionStorage.removeItem('cart');
        }
    });

    readonly totalAmout = computed(() =>
        this._products().reduce((total, item) => total + item.amount, 0),
    );

    readonly totalProducts = computed(() =>
        this._products().reduce((total, item) => total + item.quantity, 0),
    );

    readonly cart = computed(() => ({
        products: this._products(),
        totalAmount: this.totalAmout(),
        totalProducts: this.totalProducts(),
    }));

    addProduct(product: Product): void {
        const currentItems = this._products();
        const existingItemIndex = currentItems.findIndex((item) => item.product.id === product.id);

        if (existingItemIndex === -1) {
            this._products.set([
                ...currentItems,
                {
                    product,
                    quantity: 1,
                    amount: Number(product.price),
                },
            ]);
        } else {
            const updatedItems = [...currentItems];
            const existingItem = updatedItems[existingItemIndex];

            updatedItems[existingItemIndex] = {
                ...existingItem,
                quantity: existingItem.quantity + 1,
                amount: existingItem.amount + Number(product.price),
            };
            this._products.set(updatedItems);
        }
    }

    decreaseProductQuantity(cartItem: CartItem): void {
        const updtaedItems = this._products().map((item) => {
            if (item.product.id === cartItem.product.id) {
                if (item.quantity <= 1) {
                    return null;
                }
                return {
                    ...item,
                    quantity: item.quantity - 1,
                    amount: item.amount - Number(item.product.price),
                }
            }
            return item;
        }).filter((item): item is CartItem => item !== null);

        this._products.set(updtaedItems);
    }

    removeProduct(cartItem: CartItem): void {
        const updtaedItems = this._products().filter((item) => item.product.id !== cartItem.product.id);

        this._products.set(updtaedItems);
    }

    private hasSessionStorage(): boolean {
        return globalThis.window?.sessionStorage !== undefined;
    }

    private loadFromSassion(): CartItem[] {
        if (!this.hasSessionStorage()) {
            return [];
        }

        const storedProducts = sessionStorage.getItem('cart');
        try {
            return storedProducts ? JSON.parse(storedProducts) : [];
        } catch (error) {
            console.error('Error parsing stored cart items:', error);
            return [];

        }
    }
}
