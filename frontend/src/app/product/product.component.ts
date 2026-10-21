import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/finally';
import template = require('./product.component.html');
import styles = require('./product.component.css');
import { Product} from "./product.model";
import { ProductService } from './product.service';

@Component({
    selector: 'app-product',
    styles: [styles],
    template: template
})
export class ProductComponent implements OnInit, OnDestroy {
    private request: Subscription;

    allProducts: Product[] = [];
    products: Product[] = [];
    loading = false;
    loaded = false;
    errorMessage = '';
    searchTerm = '';

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.getProducts();
    }

    getProducts() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        this.loaded = false;
        this.errorMessage = '';
        this.products = [];
        this.request = this.productService.getProducts()
            .finally(() => { this.loading = false; })
            .subscribe(products => {
                this.allProducts = products;
                this.filterProducts();
                this.loaded = true;
            }, error => {
                console.error('Unable to load products', error);
                this.errorMessage = 'Không thể tải sản phẩm. Kiểm tra API và log Tomcat.';
            });
    }

    filterProducts() {
        const term = this.searchTerm.trim().toLowerCase();
        this.products = term
            ? this.allProducts.filter(product => product.name.toLowerCase().includes(term))
            : [...this.allProducts];
    }

    ngOnDestroy() {
        if (this.request) {
            this.request.unsubscribe();
        }
    }
}