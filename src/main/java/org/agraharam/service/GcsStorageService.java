package org.agraharam.service;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.channels.Channels;

@Service
@Profile("prod")
public class GcsStorageService implements StorageService {

    @Value("${attachments.gcs.bucket}")
    private String bucket;

    private final Storage storage = StorageOptions.getDefaultInstance().getService();

    @Override
    public String save(String keyHint, String contentType, InputStream in, long size) throws IOException {
        String key = deriveKey(keyHint);
        BlobInfo blobInfo = BlobInfo.newBuilder(BlobId.of(bucket, key))
                .setContentType(contentType)
                .build();
        storage.createFrom(blobInfo, in);
        return key;
    }

    @Override
    public InputStream load(String storageKey) throws IOException {
        return Channels.newInputStream(
                storage.get(BlobId.of(bucket, storageKey)).reader()
        );
    }

    @Override
    public void delete(String storageKey) throws IOException {
        storage.delete(BlobId.of(bucket, storageKey));
    }
}
