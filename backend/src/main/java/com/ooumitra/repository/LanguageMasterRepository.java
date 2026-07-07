package com.ooumitra.repository;

import com.ooumitra.entity.LanguageMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LanguageMasterRepository extends JpaRepository<LanguageMaster, Long> {
    List<LanguageMaster> findByActiveStatusTrue();
    Optional<LanguageMaster> findByLanguageCode(String languageCode);
}
