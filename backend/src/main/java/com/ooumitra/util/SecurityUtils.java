package com.ooumitra.util;

import com.ooumitra.entity.User;
import com.ooumitra.exception.OoruMitraException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {
    private SecurityUtils() {}

    public static User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User user)) {
            throw new OoruMitraException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    public static Long currentUserId() {
        return currentUser().getId();
    }

    public static User currentUserOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User user)) {
            return null;
        }
        return user;
    }

    public static Long currentUserIdOrNull() {
        User user = currentUserOrNull();
        return user != null ? user.getId() : null;
    }
}
