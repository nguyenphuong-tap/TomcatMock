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
        LOG.info("Yêu cầu tìm sản phẩm, trang {}, kích thước {}", page, size);
        PageResult<Product> result = productService.searchProducts(name, minPrice, maxPrice, page, size);
        LOG.info("Tìm sản phẩm thành công, tổng {}", result.getTotalElements());
        return new ApiResponse<>(200, "Products retrieved successfully", result);
    }

    @GetMapping
    @ResponseBody
    public ApiResponse<List<Product>> getProducts() {
        LOG.info("Yêu cầu lấy danh sách sản phẩm");
        List<Product> products = productService.getProducts();
        LOG.info("Lấy danh sách sản phẩm thành công, số lượng {}", products.size());
        return new ApiResponse<>(200, "Products retrieved successfully", products);
    }

    @PostMapping
    @ResponseBody
    public ApiResponse<Product> createProduct(@RequestBody Product product) {
        LOG.info("Nhận yêu cầu tạo sản phẩm");
        Product created = productService.createProduct(product);
        LOG.info("Tạo sản phẩm mới tên {}, ID {}", logValue(created.getName()), created.getId());
        return new ApiResponse<>(200, "Product created successfully", created);
    }

    @PutMapping("/{id}")
    @ResponseBody
    public ApiResponse<Product> updateProduct(@PathVariable("id") Integer id, @RequestBody Product product) {
        LOG.info("Nhận yêu cầu cập nhật sản phẩm ID {}", id);
        Product updated = productService.updateProduct(id, product);
        LOG.info("Cập nhật sản phẩm ID {}, tên {}", id, logValue(updated.getName()));
        return new ApiResponse<>(200, "Product updated successfully", updated);
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    public ApiResponse<Void> deleteProduct(@PathVariable("id") Integer id) {
        LOG.info("Nhận yêu cầu xóa sản phẩm ID {}", id);
        productService.deleteProduct(id);
        LOG.info("Xóa sản phẩm ID {}", id);
        return new ApiResponse<>(200, "Product deleted successfully", null);
    }

    private String logValue(String value) {
        return value.replace('\r', '_').replace('\n', '_');
    }
}