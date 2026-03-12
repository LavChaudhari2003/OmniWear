import { Injectable, signal } from "@angular/core";
import { Product } from "../../../types/product.type";
import { ProductService } from "./products.service";

@Injectable()
export class ProductStoreItem {

    private readonly _products = signal<Product[]>([]);

    readonly products = this._products.asReadonly();

    constructor(private readonly productService: ProductService) {
        this.loadProducts();
    }

    loadProducts(filters?:{
        mainCategoryId?: number;
        subCategoryId?: number;
        keyword?: string;
    }): void {
        this.productService.getAllProducts(filters).subscribe((products)=>{
            this._products.set(products);
        })
    }
}