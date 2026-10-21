package com.tap.web.pos.service;

import com.tap.web.pos.mapper.ProductMapper;
import com.tap.web.pos.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductMapper productMapper;

    public List<Product> getAllProducts() {
        return productMapper.selectAllProducts();
    }
}