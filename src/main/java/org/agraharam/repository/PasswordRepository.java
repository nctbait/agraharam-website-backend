// src/main/java/org/agraharam/repository/PasswordRepository.java
package org.agraharam.repository;

import org.agraharam.model.Password;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

@Repository
public interface PasswordRepository extends JpaRepository<Password, Long> {

  /** Try update first (by user_id). */
  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Transactional
  @Query(
    value = "UPDATE password SET hash = :hash, updated_at = :updatedAt WHERE user_id = :userId",
    nativeQuery = true
  )
  int updatePassword(@Param("userId") Long userId,
                     @Param("hash") String hash,
                     @Param("updatedAt") Timestamp updatedAt);

  /** Fallback insert if there was no existing row. */
  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Transactional
  @Query(
    value = "INSERT INTO password (user_id, hash, updated_at) VALUES (:userId, :hash, :updatedAt)",
    nativeQuery = true
  )
  int insertPassword(@Param("userId") Long userId,
                     @Param("hash") String hash,
                     @Param("updatedAt") Timestamp updatedAt);

  /** Convenience wrapper that matches your service call. */
  @Transactional
  default void saveOrUpdate(Long userId, String hash, Timestamp updatedAt) {
    int updated = updatePassword(userId, hash, updatedAt);
    if (updated == 0) {
      insertPassword(userId, hash, updatedAt);
    }
  }
}
