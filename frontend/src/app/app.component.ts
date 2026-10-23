import { Component } from '@angular/core';
import template = require('./app.component.html');
import styles = require('./app.component.css');

@Component( {
    selector: 'app',
    styles: [styles],
    template: template
} )
export class AppComponent {}
