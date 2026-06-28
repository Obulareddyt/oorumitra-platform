package com.ooumitra.repository;

import com.ooumitra.entity.User;
import com.ooumitra.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByMobileNumber(String mobileNumber);
    boolean existsByMobileNumber(String mobileNumber);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    long countByRole(Role role);
    long countByVillageRefId(Long villageId);
    long countByVillageRefIdAndRole(Long villageId, Role role);

    @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR " +
           " LOWER(u.firstName) LIKE LOWER(CONCAT('%',:search,'%')) OR " +
           " LOWER(u.lastName)  LIKE LOWER(CONCAT('%',:search,'%')) OR " +
           " LOWER(u.username)  LIKE LOWER(CONCAT('%',:search,'%')) OR " +
           " u.mobileNumber     LIKE CONCAT('%',:search,'%')) AND " +
           "(:villageId IS NULL OR u.villageRef.id = :villageId) AND " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:active IS NULL OR u.isActive = :active)")
    Page<User> searchUsers(@Param("search")    String  search,
                           @Param("villageId") Long    villageId,
                           @Param("role")      Role    role,
                           @Param("active")    Boolean active,
                           Pageable pageable);

    @Query("SELECT u.role, COUNT(u) FROM User u WHERE u.villageRef.id = :villageId GROUP BY u.role")
    List<Object[]> countByRoleForVillage(@Param("villageId") Long villageId);
}
