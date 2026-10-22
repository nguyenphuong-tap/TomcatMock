import {ElementRef, EventEmitter, Input, Output, ViewChild, Component} from "@angular/core";
import {Product} from "../product.model";

@Component({
    selector: 'create-update-product-modal',
    styleUrls: ['product/create-update-product-modal/create-update-product-modal.component.css'],
    templateUrl: 'product/create-update-product-modal/create-update-product-modal.component.html'
})
export class CreateUpdateProductModalComponent {
    @ViewChild('productFormDialog') dialogRef: ElementRef;

    @Input() productData: Product = null;
    @Input() isEditMode: boolean = false;

    @Output() save = new EventEmitter<Product>();

    openDialog(): void {
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
        if (this.productData && this.productData.name.trim()) {
            this.save.emit(this.productData);
            this.closeDialog();
        } else {
            alert('Vui lòng nhập tên sản phẩm!');
        }
    }

}