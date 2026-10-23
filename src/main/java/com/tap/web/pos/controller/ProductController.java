package com.tap.web.pos.controller;

import com.tap.web.pos.model.Product;
import com.tap.web.pos.model.ApiResponse;
import com.tap.web.pos.model.PageResult;
import java.math.BigDecimal;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import com.tap.web.pos.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/products")
public class ProductController {
    private static final Logger LOG = LogManager.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    @GetMapping("/search")
    @ResponseBody
    public ApiResponse<PageResult<Product>> searchProducts(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        LOG.info("Searching products, page {}, page size {}", page, size);
        PageResult<Product> result = productService.searchProducts(name, minPrice, maxPrice, page, size);
        LOG.info("Product search completed; total results: {}", result.getTotalElements());
        return new ApiResponse<>(200, "Products retrieved successfully", result);
    }

    @GetMapping
    @ResponseBody
    public ApiResponse<List<Product>> getProducts() {
        LOG.info("Requesting product list");
        List<Product> products = productService.getProducts();
        LOG.info("Retrieved product list successfully; count: {}", products.size());
        return new ApiResponse<>(200, "Products retrieved successfully", products);
    }

    @PostMapping
    @ResponseBody
    public ApiResponse<Product> createProduct(@RequestBody Product product) {
        LOG.info("Received request to create product");
        Product created = productService.createProduct(product);
        LOG.info("Created product '{}', ID {}", created.getName(), created.getId());
        return new ApiResponse<>(200, "Product created successfully", created);
    }

    @PutMapping("/{id}")
    @ResponseBody
    public ApiResponse<Product> updateProduct(@PathVariable("id") Integer id, @RequestBody Product product) {
        LOG.info("Received request to update product with ID {}", id);
        Product updated = productService.updateProduct(id, product);
        LOG.info("Updated product with ID {}, name '{}'", id, updated.getName());
        return new ApiResponse<>(200, "Product updated successfully", updated);
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    public ApiResponse<Void> deleteProduct(@PathVariable("id") Integer id) {
        LOG.info("Received request to delete product with ID {}", id);
        productService.deleteProduct(id);
        LOG.info("Deleted product with ID {}", id);
        return new ApiResponse<>(200, "Product deleted successfully", null);
    }
}