import { Injectable } from '@angular/core';
import { Product } from '../../../types/product.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class ProductService {
  private readonly baseUrl = "http://localhost:5001/products";
  constructor(private readonly http: HttpClient){}

  getAllProducts(filters?:{
    mainCategoryId?:number;
    subCategoryId?:number;
    keyword?:string;
  }): Observable<Product[]> {
    let params = new HttpParams();
    if (filters?.mainCategoryId != null) {
      params = params.set('mainCategoryId', filters.mainCategoryId.toString());
    }
    if (filters?.subCategoryId != null) {
      params = params.set('subCategoryId', filters.subCategoryId.toString());
    }
    if (filters?.keyword != null) {
      params = params.set('keyword', filters.keyword);
    }
    return this.http.get<Product[]>(this.baseUrl, { params });
  }

}
