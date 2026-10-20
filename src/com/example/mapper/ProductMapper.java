package com.example.mapper;

import com.example.model.Product;
import java.util.List;

public interface ProductMapper {
    List<Product> selectAllProducts();
}