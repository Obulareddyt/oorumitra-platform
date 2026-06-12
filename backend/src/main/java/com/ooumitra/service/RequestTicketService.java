package com.ooumitra.service;

import com.ooumitra.dto.request.RequestTicketRequest;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.dto.response.RequestTicketResponse;
import com.ooumitra.entity.RequestTicket;
import com.ooumitra.entity.User;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.RequestTicketRepository;
import com.ooumitra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RequestTicketService {

    private final RequestTicketRepository repo;

    @Value("${app.pagination.default-page-size}")
    private int defaultPageSize;

    @Transactional(readOnly = true)
    public PagedResponse<RequestTicketResponse> getAll(String status, int page, int size) {
        if (size <= 0) size = defaultPageSize;
        PageRequest pageReq = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<RequestTicket> result = status != null
                ? repo.findByStatus(status, pageReq)
                : repo.findAll(pageReq);
        var content = result.getContent().stream().map(RequestTicketResponse::from).toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional(readOnly = true)
    public RequestTicketResponse getById(Long id) {
        return RequestTicketResponse.from(repo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Request ticket")));
    }

    @Transactional(readOnly = true)
    public PagedResponse<RequestTicketResponse> getMyTickets(String status, int page, int size) {
        Long userId = SecurityUtils.currentUserId();
        if (size <= 0) size = defaultPageSize;
        PageRequest pageReq = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<RequestTicket> result = status != null
                ? repo.findByUserIdAndStatus(userId, status, pageReq)
                : repo.findByUserId(userId, pageReq);
        var content = result.getContent().stream().map(RequestTicketResponse::from).toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional
    public RequestTicketResponse create(RequestTicketRequest req) {
        User user = SecurityUtils.currentUser();
        RequestTicket ticket = RequestTicket.builder()
                .user(user).title(req.getTitle()).description(req.getDescription())
                .location(req.getLocation()).requiredDate(req.getRequiredDate())
                .budget(req.getBudget()).mobileNumber(req.getMobileNumber())
                .latitude(req.getLatitude()).longitude(req.getLongitude())
                .build();
        return RequestTicketResponse.from(repo.save(ticket));
    }

    @Transactional
    public RequestTicketResponse updateStatus(Long id, String status) {
        Long userId = SecurityUtils.currentUserId();
        RequestTicket ticket = repo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Request ticket"));
        if (!ticket.getUser().getId().equals(userId)) {
            throw OoruMitraException.forbidden("Not your ticket");
        }
        ticket.setStatus(status);
        return RequestTicketResponse.from(repo.save(ticket));
    }

    @Transactional
    public void delete(Long id) {
        Long userId = SecurityUtils.currentUserId();
        RequestTicket ticket = repo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Request ticket"));
        if (!ticket.getUser().getId().equals(userId)) {
            throw OoruMitraException.forbidden("Not your ticket");
        }
        repo.delete(ticket);
    }
}
