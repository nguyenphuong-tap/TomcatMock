import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {ProductComponent} from "./product/product.component";
import { ProductService } from './product/product.service';

@NgModule({
    imports: [BrowserModule, HttpClientModule, FormsModule],
    declarations: [AppComponent, ProductComponent],
    providers: [ProductService],
    bootstrap: [AppComponent]
})
export class AppModule {}