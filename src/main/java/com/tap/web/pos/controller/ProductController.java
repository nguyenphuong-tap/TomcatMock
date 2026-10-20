package main.java.com.tap.web.pos.controller;

import main.java.com.tap.web.pos.model.Product;
import main.java.com.tap.web.pos.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    @ResponseBody
    public List<Product> getProductsJson() {
        return productService.getAllProducts();
    }
}