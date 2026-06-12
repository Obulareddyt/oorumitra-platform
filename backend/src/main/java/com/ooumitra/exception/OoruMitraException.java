package com.ooumitra.exception;

import org.springframework.http.HttpStatus;

public class OoruMitraException extends RuntimeException {
    private final HttpStatus status;

    public OoruMitraException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() { return status; }

    public static OoruMitraException notFound(String resource) {
        return new OoruMitraException(resource + " not found", HttpStatus.NOT_FOUND);
    }

    public static OoruMitraException badRequest(String message) {
        return new OoruMitraException(message, HttpStatus.BAD_REQUEST);
    }

    public static OoruMitraException forbidden(String message) {
        return new OoruMitraException(message, HttpStatus.FORBIDDEN);
    }

    public static OoruMitraException conflict(String message) {
        return new OoruMitraException(message, HttpStatus.CONFLICT);
    }
}
