import { Component, inject, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Category } from '../types/category';
import { CategoriesStoreItem } from '../services/category/categories.storeItems';
@Component({
  selector: 'app-side-navigation',
  imports: [FontAwesomeModule],
  templateUrl: './side-navigation.html',
  styleUrl: './side-navigation.css',
})
export class SideNavigation {
  faAngleDown = faAngleDown;
  private categoryStore = inject(CategoriesStoreItem);

  readonly categories = this.categoryStore.categories;
  readonly subCategoryClicked = output<number>();

  getCategories(parentCategoryId: number | null): Category[] {
    return this.categories().filter(category => {
      if (parentCategoryId === null) {
        return category.parent_category_id == null;
      }

      return category.parent_category_id === parentCategoryId;
    });
  }

  onSubCategoryClick(subCategory: Category) {
    this.subCategoryClicked.emit(subCategory.id);
  }

}
