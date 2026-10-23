import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Product } from '../models/product.model';
import template = require('./delete-product-modal.component.html');
import sharedStyles = require('../create-update-product-modal/create-update-product-modal.component.css');
import styles = require('./delete-product-modal.component.css');

@Component({
    selector: 'delete-product-modal',
    styles: [sharedStyles, styles],
    template: template
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
