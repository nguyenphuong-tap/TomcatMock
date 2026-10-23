package com.tap.web.pos.model;

import java.math.BigDecimal;

public class ProductSearch {
    private final String name;
    private final BigDecimal minPrice;
    private final BigDecimal maxPrice;
    private final int size;
    private final long offset;

    public ProductSearch(String name, BigDecimal minPrice, BigDecimal maxPrice, int page, int size) {
        this.name = name == null || name.trim().isEmpty() ? null : name.trim();
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.size = size;
        this.offset = ((long) page - 1) * size;
    }

    public String getName() { return name; }
    public BigDecimal getMinPrice() { return minPrice; }
    public BigDecimal getMaxPrice() { return maxPrice; }
    public int getSize() { return size; }
    public long getOffset() { return offset; }
}
