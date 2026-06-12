package com.ooumitra.dto.response;

import lombok.*;

import java.util.List;

@Data @AllArgsConstructor
public class PagedResponse<T> {
    private List<T> content;
    private long totalElements;
    private int totalPages;
    private int page;
    private int size;
}
