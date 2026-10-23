package com.tap.web.pos.model;

import java.util.List;

public class PageResult<T> {
    private final List<T> items;
    private final int page;
    private final int size;
    private final long totalElements;

    public PageResult(List<T> items, int page, int size, long totalElements) {
        this.items = items;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
    }

    public List<T> getItems() { return items; }
    public int getPage() { return page; }
    public int getSize() { return size; }
    public long getTotalElements() { return totalElements; }
    public long getTotalPages() {
        return totalElements / size + (totalElements % size == 0 ? 0 : 1);
    }
}
