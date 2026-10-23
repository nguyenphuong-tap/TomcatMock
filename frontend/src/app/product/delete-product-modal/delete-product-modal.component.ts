import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Product } from '../product.model';

@Component({
    selector: 'delete-product-modal',
    styleUrls: [
        'product/create-update-product-modal/create-update-product-modal.component.css',
        'product/delete-product-modal/delete-product-modal.component.css'
    ],
    templateUrl: 'product/delete-product-modal/delete-product-modal.component.html'
})
export class DeleteProductModalComponent {
    @ViewChild('deleteDialog') dialogRef: ElementRef;
    @Output() confirm = new EventEmitter<Product>();

    product: Product | null = null;

    openDialog(product: Product): void {
        this.product = product;
        this.dialogRef.nativeElement.showModal();
    }

    closeDialog(): void {
        this.dialogRef.nativeElement.close();
        this.product = null;
    }

    confirmDelete(): void {
        if (this.product) {
            const product = this.product;
            this.closeDialog();
            this.confirm.emit(product);
        }
    }
}
