import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {ProductComponent} from "./product/product.component";
import { ProductService } from './product/product.service';
import { DeleteProductModalComponent } from './product/delete-product-modal/delete-product-modal.component';
import {
    CreateUpdateProductModalComponent
} from "./product/create-update-product-modal/create-update-product-modal.component";

@NgModule({
    imports: [BrowserModule, HttpClientModule, FormsModule],
    declarations: [AppComponent, ProductComponent, CreateUpdateProductModalComponent, DeleteProductModalComponent],
    providers: [ProductService],
    bootstrap: [AppComponent]
})
export class AppModule {}