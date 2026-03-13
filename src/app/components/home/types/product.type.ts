export interface Product {
    id: number;
    product_name: string;
    price: number;
    product_img: string;
    ratings?: number;
    category_id: number;
    product_description?: string;
}