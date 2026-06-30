package com.ooumitra.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "role_audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RoleAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(name = "role_name", nullable = false, length = 50)
    private String roleName;

    @Column(name = "performed_by", nullable = false, length = 100)
    private String performedBy;

    @Column(name = "performed_at", nullable = false)
    private Instant performedAt;

    @Column(columnDefinition = "TEXT")
    private String details;
}
