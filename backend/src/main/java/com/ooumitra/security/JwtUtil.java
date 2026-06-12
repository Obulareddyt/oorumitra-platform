package com.ooumitra.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(
                java.util.Base64.getEncoder().encodeToString(secret.getBytes())));
    }

    public String generateToken(Long userId, String mobileNumber, String role) {
        return buildToken(userId, mobileNumber, role, expirationMs, false);
    }

    public String generateRefreshToken(Long userId, String mobileNumber) {
        return buildToken(userId, mobileNumber, null, refreshExpirationMs, true);
    }

    private String buildToken(Long userId, String mobile, String role, long ttl, boolean refresh) {
        var claims = Map.of(
                "userId", userId,
                "mobile", mobile,
                "role", role != null ? role : "",
                "type", refresh ? "refresh" : "access"
        );
        return Jwts.builder()
                .claims(claims)
                .subject(String.valueOf(userId))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ttl))
                .signWith(key())
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
    }

    public Long extractUserId(String token) {
        return ((Number) extractAllClaims(token).get("userId")).longValue();
    }

    public String extractMobile(String token) {
        return (String) extractAllClaims(token).get("mobile");
    }

    public boolean isTokenValid(String token) {
        try {
            var claims = extractAllClaims(token);
            return !claims.getExpiration().before(new Date())
                    && "access".equals(claims.get("type"));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isRefreshTokenValid(String token) {
        try {
            var claims = extractAllClaims(token);
            return !claims.getExpiration().before(new Date())
                    && "refresh".equals(claims.get("type"));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
