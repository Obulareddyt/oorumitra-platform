package com.ooumitra.repository;

import com.ooumitra.entity.UserLanguagePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserLanguagePreferenceRepository extends JpaRepository<UserLanguagePreference, Long> {
    Optional<UserLanguagePreference> findByUserId(Long userId);
}
