import { computed, Injectable, inject, signal } from "@angular/core";
import { CategoryService } from "./category";
import { Category } from "../../types/category";


@Injectable({
    providedIn: 'root'
})
export class CategoriesStoreItem {
    private readonly categoryService = inject(CategoryService);
    private readonly _categories = signal<Category[]>([]);

    readonly categories = this._categories.asReadonly();

    readonly topLevelCategories = computed(() => {
        return this._categories().filter(category => category.parent_category_id === null);
    })

    constructor() {
        this.loadCategories();
    }

    loadCategories() {
        this.categoryService.getAllCategories().subscribe((categories: Category[]) => {
            this._categories.set(categories);
        });
    }
}