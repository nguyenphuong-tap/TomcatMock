package com.tap.web.pos.exception;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(Integer id) {
        super("Product with id " + id + " does not exist");
    }
}
