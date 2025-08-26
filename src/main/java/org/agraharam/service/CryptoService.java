package org.agraharam.service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Objects;

/**
 * Small utility for encrypting/decrypting short secrets (e.g., TOTP secrets) with AES-GCM.
 * Stores output as Base64(iv || ciphertext+tag).
 */
public class CryptoService {

    private static final String CIPHER = "AES/GCM/NoPadding";
    private static final int GCM_TAG_BITS = 128;   // 16 bytes tag
    private static final int IV_LEN = 12;          // 12 bytes nonce is recommended for GCM
    private final SecretKey key;
    private final SecureRandom rng = new SecureRandom();

    /**
     * @param base64Key 32-byte key encoded in Base64 (i.e., 256-bit AES key)
     */
    public CryptoService(String base64Key) {
        Objects.requireNonNull(base64Key, "base64Key");
        byte[] keyBytes = Base64.getDecoder().decode(base64Key);
        if (keyBytes.length != 32) {
            throw new IllegalArgumentException("AES key must be 32 bytes (256-bit). Provided: " + keyBytes.length);
        }
        this.key = new SecretKeySpec(keyBytes, "AES");
    }

    /** Encrypt raw bytes → Base64(iv || ciphertext+tag). */
    public String encrypt(byte[] plaintext) {
        try {
            byte[] iv = new byte[IV_LEN];
            rng.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(CIPHER);
            cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_BITS, iv));
            byte[] ct = cipher.doFinal(plaintext);

            // pack: iv || ct
            byte[] out = ByteBuffer.allocate(iv.length + ct.length)
                    .put(iv)
                    .put(ct)
                    .array();
            return Base64.getEncoder().encodeToString(out);
        } catch (Exception e) {
            throw new RuntimeException("AES-GCM encrypt failed", e);
        }
    }

    /** Decrypt Base64(iv || ciphertext+tag) → raw bytes. */
    public byte[] decryptToBytes(String base64IvCt) {
        try {
            byte[] all = Base64.getDecoder().decode(base64IvCt);
            if (all.length < IV_LEN + 16) { // iv + tag minimum
                throw new IllegalArgumentException("Ciphertext too short");
            }
            byte[] iv = new byte[IV_LEN];
            byte[] ct = new byte[all.length - IV_LEN];
            System.arraycopy(all, 0, iv, 0, IV_LEN);
            System.arraycopy(all, IV_LEN, ct, 0, ct.length);

            Cipher cipher = Cipher.getInstance(CIPHER);
            cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_BITS, iv));
            return cipher.doFinal(ct);
        } catch (Exception e) {
            throw new RuntimeException("AES-GCM decrypt failed", e);
        }
    }

    /** Convenience: encrypt a string (UTF-8) → Base64(iv||ct). */
    public String encryptString(String plaintext) {
        return encrypt(plaintext.getBytes(StandardCharsets.UTF_8));
    }

    /** Convenience: decrypt Base64(iv||ct) → UTF-8 string. */
    public String decryptToString(String base64IvCt) {
        return new String(decryptToBytes(base64IvCt), StandardCharsets.UTF_8);
    }
}
