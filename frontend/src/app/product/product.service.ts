import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Product } from './models/product.model';
import { ApiResponse } from '../shared/models/api-response.model';
import { ProductFilters, ProductPage } from './models/product-page.model';

@Injectable()
export class ProductService {
    apiUrl = 'products';
    constructor(private http: HttpClient) {}

    searchProducts(filters: ProductFilters, page: number, size: number): Observable<ProductPage> {
        let params = new HttpParams().set('page', String(page)).set('size', String(size));
        if (filters.name) {
            params = params.set('name', filters.name);
        }
        if (filters.minPrice !== null) {
            params = params.set('minPrice', String(filters.minPrice));
        }
        if (filters.maxPrice !== null) {
            params = params.set('maxPrice', String(filters.maxPrice));
        }
        return this.http.get<ApiResponse<ProductPage>>(this.apiUrl + '/search', { params })
            .timeout(20000).map(response => {
                const result = response && response.data;
                if (!response || response.code !== 200 || typeof response.message !== 'string'
                        || !result || !Array.isArray(result.items)
                        || !result.items.every(product => product !== null
                            && typeof product === 'object' && Number.isInteger(product.id)
                            && typeof product.name === 'string' && typeof product.price === 'number'
                            && Number.isFinite(product.price) && Number.isInteger(product.quantity))
                        || result.page !== page || result.size !== size
                        || !Number.isSafeInteger(result.totalElements) || result.totalElements < 0
                        || !Number.isSafeInteger(result.totalPages)
                        || result.totalPages !== Math.ceil(result.totalElements / size)
                        || result.items.length > size) {
                    throw new Error('Invalid paginated products response');
                }
                return result;
            });
    }

    createProduct(product: Product): Observable<ApiResponse<Product>> {
        return this.http.post<ApiResponse<Product>>(`${this.apiUrl}`, product).timeout(20000);
    }

    updateProduct(product: Product): Observable<ApiResponse<Product>> {
        return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${product.id}`, product).timeout(20000);
    }

    deleteProduct(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).timeout(20000);
    }
}
