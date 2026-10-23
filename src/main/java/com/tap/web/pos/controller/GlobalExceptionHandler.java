package com.tap.web.pos.controller;

import com.tap.web.pos.exception.ProductNotFoundException;
import com.tap.web.pos.model.ApiResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    private static final Logger LOG = LogManager.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> invalidInput(IllegalArgumentException exception, WebRequest request) {
        LOG.warn("Invalid input: {}", requestPath(request), exception);
        return error(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Object> notFound(ProductNotFoundException exception, WebRequest request) {
        LOG.warn("Product not found: {}", requestPath(request), exception);
        return error(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> unexpectedFailure(Exception exception, WebRequest request) {
        LOG.error("Unexpected request failure: {}", requestPath(request), exception);
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }

    private ResponseEntity<Object> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(new ApiResponse<>(status.value(), message, null));
    }

    private String requestPath(WebRequest request) {
        return request.getDescription(false).replace('\r', '_').replace('\n', '_');
    }
}
