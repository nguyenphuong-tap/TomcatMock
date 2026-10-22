package com.tap.web.pos.mapper;

import com.tap.web.pos.model.Product;
import com.tap.web.pos.model.ProductSearch;
import java.util.List;

public interface ProductMapper {
    List<Product> getProducts();
    List<Product> searchProducts(ProductSearch search);
    long countProducts(ProductSearch search);
    int createProduct(Product product);
    int updateProduct(Product product);
    int deleteProduct(Integer id);

}