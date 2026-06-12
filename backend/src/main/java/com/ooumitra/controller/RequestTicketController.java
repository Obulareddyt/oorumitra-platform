package com.ooumitra.controller;

import com.ooumitra.dto.request.RequestTicketRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.RequestTicketResponse;
import com.ooumitra.service.RequestTicketService;
import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@Tag(name = "Request Tickets")
public class RequestTicketController {

    private final RequestTicketService ticketService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<RequestTicketResponse>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "0") int size) {
        return ResponseEntity.ok(ApiResponse.ok(ticketService.getAll(status, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RequestTicketResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(ticketService.getById(id)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PagedResponse<RequestTicketResponse>>> getMyTickets(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "0") int size) {
        return ResponseEntity.ok(ApiResponse.ok(ticketService.getMyTickets(status, page, size)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RequestTicketResponse>> create(@Valid @RequestBody RequestTicketRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Request ticket created", ticketService.create(req)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<RequestTicketResponse>> updateStatus(
            @PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated", ticketService.updateStatus(id, status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        ticketService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Request ticket deleted"));
    }
}
