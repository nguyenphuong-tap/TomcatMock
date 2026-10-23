import {ElementRef, EventEmitter, Input, Output, ViewChild, Component} from "@angular/core";
import {Product} from "../models/product.model";
import template = require('./create-update-product-modal.component.html');
import styles = require('./create-update-product-modal.component.css');

@Component({
    selector: 'create-update-product-modal',
    styles: [styles],
    template: template
})
export class CreateUpdateProductModalComponent {
    @ViewChild('productFormDialog') dialogRef: ElementRef;

    @Input() productData: Product = null;
    @Input() isEditMode: boolean = false;

    @Output() save = new EventEmitter<Product>();

    submitted = false;

    get hasRequiredFields(): boolean {
        return !!this.productData
            && !!this.productData.name && !!this.productData.name.trim()
            && this.productData.price !== null && this.productData.price !== undefined
            && this.productData.quantity !== null && this.productData.quantity !== undefined;
    }

    get nameError(): string {
        return !this.productData || !this.productData.name || !this.productData.name.trim()
            ? 'Product name is required.' : '';
    }

    get priceError(): string {
        if (!this.productData || this.productData.price === null || this.productData.price === undefined) {
            return 'Sale price is required.';
        }
        return !Number.isFinite(this.productData.price) || this.productData.price < 0
            ? 'Sale price must be a non-negative number.' : '';
    }

    get quantityError(): string {
        if (!this.productData || this.productData.quantity === null || this.productData.quantity === undefined) {
            return 'Quantity is required.';
        }
        return !Number.isInteger(this.productData.quantity) || this.productData.quantity < 0
            || this.productData.quantity > 2147483647
            ? 'Quantity must be a whole number between 0 and 2147483647.' : '';
    }

    openDialog(): void {
        this.submitted = false;
        if (this.dialogRef) {
            this.dialogRef.nativeElement.showModal();
        }
    }

    closeDialog(): void {
        if (this.dialogRef) {
            this.dialogRef.nativeElement.close();
        }
    }

    onSubmit(): void {
        this.submitted = true;
        if (this.nameError || this.priceError || this.quantityError) {
            return;
        }
        this.save.emit(this.productData);
        this.closeDialog();
    }

}