export interface Category {
    id:number;
    category: String;
    parent_category_id?:number | null;
}