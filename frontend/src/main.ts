import "reflect-metadata";
import "zone.js/dist/zone";
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

enableProdMode();
Promise.resolve().then(() => platformBrowserDynamic().bootstrapModule(AppModule)).catch(error => {
    console.error("Angular bootstrap failed", error);
    const root = document.querySelector("app");
    if (root) {
        root.textContent = "Unable to start Angular. Check the console.";
    }
});
