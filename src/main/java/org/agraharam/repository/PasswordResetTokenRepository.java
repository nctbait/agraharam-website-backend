package org.agraharam.repository;

import java.time.OffsetDateTime;
import java.util.Optional;

import org.agraharam.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
  @Query("select t from PasswordResetToken t where t.tokenHash = :hash and t.usedAt is null and t.expiresAt > :now")
  Optional<PasswordResetToken> findValidByHash(@Param("hash") String hash, @Param("now") OffsetDateTime now);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Transactional
  @Query("""
        update PasswordResetToken t
           set t.usedAt = :now
         where t.userId = :userId
           and t.usedAt is null
           and (:keepId is null or t.id <> :keepId)
      """)
  int invalidateAllForUserExcept(@Param("userId") Long userId,
      @Param("keepId") Long keepId,
      @Param("now") OffsetDateTime now);
}
