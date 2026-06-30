package com.ooumitra.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "villages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Village {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String mandal;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "created_by")
    private Long createdBy;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "village_admins",
        joinColumns = @JoinColumn(name = "village_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<User> admins = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
