import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/finally';
import template = require('./product.component.html');
import styles = require('./product.component.css');
import { Product} from "./product.model";
import { ProductService } from './product.service';
import { ProductFilters } from './product-page.model';
import { CreateUpdateProductModalComponent } from './create-update-product-modal/create-update-product-modal.component';
import { ViewChild } from '@angular/core';
import { DeleteProductModalComponent } from './delete-product-modal/delete-product-modal.component';

@Component({
    selector: 'app-product',
    styles: [styles],
    template: template,
})
export class ProductComponent implements OnInit, OnDestroy {
    @ViewChild('productFormModal') productFormModal: CreateUpdateProductModalComponent;
    @ViewChild('deleteProductModal') deleteProductModal: DeleteProductModalComponent;

    private request: Subscription;
    private requestVersion = 0;

    products: Product[] = [];
    loading = false;
    deleting = false;
    loaded = false;
    errorMessage = '';
    searchTerm = '';
    minPrice: number | null = null;
    maxPrice: number | null = null;
    page = 1;
    pageSize = 10;
    totalElements = 0;
    totalPages = 0;
    validationMessage = '';
    private appliedFilters: ProductFilters = { name: '', minPrice: null, maxPrice: null };

    isEditMode = false;
    selectedProduct: Product | null = null;

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
        const version = ++this.requestVersion;
        this.request = this.productService.searchProducts(this.appliedFilters, this.page, this.pageSize)
            .finally(() => {
                if (version === this.requestVersion) {
                    this.loading = false;
                }
            })
            .subscribe(result => {
                if (result.items.length === 0 && result.totalElements > 0
                        && this.page > result.totalPages) {
                    this.page = result.totalPages;
                    this.loading = false;
                    this.getProducts();
                    return;
                }
                this.products = result.items;
                this.totalElements = result.totalElements;
                this.totalPages = result.totalPages;
                this.loaded = true;
            }, error => {
                console.error('Unable to load products', error);
                this.errorMessage = 'Không thể tải sản phẩm. Kiểm tra API và log Tomcat.';
            });
    }

    filterProducts() {
        if (this.loading) {
            return;
        }
        this.validationMessage = '';
        if ((this.minPrice !== null && (!Number.isFinite(this.minPrice) || this.minPrice < 0))
                || (this.maxPrice !== null && (!Number.isFinite(this.maxPrice) || this.maxPrice < 0))) {
            this.validationMessage = 'Giá phải là số không âm.';
            return;
        }
        if (this.minPrice !== null && this.maxPrice !== null && this.minPrice > this.maxPrice) {
            this.validationMessage = 'Giá từ không được lớn hơn giá đến.';
            return;
        }
        this.appliedFilters = {
            name: this.searchTerm.trim(), minPrice: this.minPrice, maxPrice: this.maxPrice
        };
        this.page = 1;
        this.getProducts();
    }

    resetFilters() {
        if (this.loading) {
            return;
        }
        this.searchTerm = '';
        this.minPrice = null;
        this.maxPrice = null;
        this.filterProducts();
    }

    changePage(page: number) {
        if (!this.loading && page >= 1 && page <= this.totalPages) {
            this.page = page;
            this.getProducts();
        }
    }

    changePageSize() {
        if (!this.loading) {
            this.page = 1;
            this.getProducts();
        }
    }

    createProduct() {
        this.isEditMode = false;
        this.selectedProduct = { id: 0, name: '', price: 0, quantity: 0 };
        this.productFormModal.openDialog();
    }

    updateProduct(product: Product) {
        this.isEditMode = true;
        this.selectedProduct = { ...product };
        this.productFormModal.openDialog();
    }

    handleSave(product: Product): void {
        if (this.isEditMode) {
            this.productService.updateProduct(product).subscribe(() => {
                this.getProducts();
            }, error => {
                console.error('Unable to update product', error);
                this.errorMessage = 'Không thể cập nhật sản phẩm. Kiểm tra API và log Tomcat.';
            });
        } else {
            this.productService.createProduct(product).subscribe(() => {
                this.getProducts();
            }, error => {
                console.error('Unable to create product', error);
                this.errorMessage = 'Không thể tạo sản phẩm. Kiểm tra API và log Tomcat.';
            });
        }
    }

    deleteProduct(product: Product) {
        if (this.loading || this.deleting) {
            return;
        }
        this.deleteProductModal.openDialog(product);
    }

    confirmDeleteProduct(product: Product) {
        if (this.deleting) {
            return;
        }
        this.deleting = true;
        this.errorMessage = '';
        this.productService.deleteProduct(product.id)
            .finally(() => this.deleting = false)
            .subscribe(() => {
                this.getProducts();
            }, error => {
                console.error('Unable to delete product', error);
                this.errorMessage = 'Không thể xóa sản phẩm. Kiểm tra API và log Tomcat.';
            });
    }

    ngOnDestroy() {
        if (this.request) {
            this.request.unsubscribe();
        }
    }
}