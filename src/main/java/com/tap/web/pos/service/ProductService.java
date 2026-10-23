package com.tap.web.pos.service;

import com.tap.web.pos.mapper.ProductMapper;
import com.tap.web.pos.model.Product;
import com.tap.web.pos.model.ProductSearch;
import com.tap.web.pos.model.PageResult;
import com.tap.web.pos.exception.ProductNotFoundException;
import java.math.BigDecimal;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductMapper productMapper;

    public List<Product> getProducts() {
        return productMapper.getProducts();
    }

    @Transactional(readOnly = true, isolation = Isolation.REPEATABLE_READ)
    public PageResult<Product> searchProducts(String name, BigDecimal minPrice,
            BigDecimal maxPrice, int page, int size) {
        ProductSearch search = new ProductSearch(name, minPrice, maxPrice, page, size);
        long total = productMapper.countProducts(search);
        List<Product> products = productMapper.searchProducts(search);
        return new PageResult<>(products, page, size, total);
    }

    @Transactional
    public Product createProduct(Product product) {
        validateProduct(product);
        int rowAffected = productMapper.createProduct(product);
        if(rowAffected == 0) {
            throw new IllegalStateException("Failed to create product");
        }
        return product;
    }

    @Transactional
    public Product updateProduct(Integer id, Product product) {
        validateProduct(product);
        product.setId(id);
        int rowsAffected = productMapper.updateProduct(product);
        if(rowsAffected == 0) {
            throw new ProductNotFoundException(id);
        }
        return product;
    }

    @Transactional
    public void deleteProduct(Integer id) {
        int rowsAffected = productMapper.deleteProduct(id);
        if(rowsAffected == 0) {
            throw new ProductNotFoundException(id);
        }
    }

    private void validateProduct(Product product) {
        if (product == null || product.getName() == null || product.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        if (!Double.isFinite(product.getPrice()) || product.getPrice() < 0) {
            throw new IllegalArgumentException("Product price must be finite and non-negative");
        }
        if (product.getQuantity() == null || product.getQuantity() < 0) {
            throw new IllegalArgumentException("Product quantity must be non-negative");
        }
    }
}