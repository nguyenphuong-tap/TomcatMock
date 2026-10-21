package com.tap.web.pos.mapper;

import com.tap.web.pos.model.Product;
import java.util.List;

public interface ProductMapper {
    List<Product> selectAllProducts();
}