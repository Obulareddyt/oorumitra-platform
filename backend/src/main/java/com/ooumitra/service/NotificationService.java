package com.ooumitra.service;

import com.ooumitra.dto.response.NotificationResponse;
import com.ooumitra.dto.response.PagedResponse;
import com.ooumitra.entity.Notification;
import com.ooumitra.exception.OoruMitraException;
import com.ooumitra.repository.NotificationRepository;
import com.ooumitra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repo;

    @Value("${app.pagination.default-page-size}")
    private int defaultPageSize;

    @Transactional(readOnly = true)
    public PagedResponse<NotificationResponse> getNotifications(int page, int size) {
        Long userId = SecurityUtils.currentUserId();
        if (size <= 0) size = defaultPageSize;
        Page<Notification> result = repo.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size));
        var content = result.getContent().stream().map(NotificationResponse::from).toList();
        return new PagedResponse<>(content, result.getTotalElements(), result.getTotalPages(), page, size);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return repo.countByUserIdAndIsReadFalse(SecurityUtils.currentUserId());
    }

    @Transactional
    public void markRead(Long id) {
        Long userId = SecurityUtils.currentUserId();
        Notification notification = repo.findById(id)
                .orElseThrow(() -> OoruMitraException.notFound("Notification"));
        if (!notification.getUser().getId().equals(userId)) {
            throw OoruMitraException.forbidden("Not your notification");
        }
        notification.setRead(true);
        repo.save(notification);
    }

    @Transactional
    public void markAllRead() {
        repo.markAllReadForUser(SecurityUtils.currentUserId());
    }
}
