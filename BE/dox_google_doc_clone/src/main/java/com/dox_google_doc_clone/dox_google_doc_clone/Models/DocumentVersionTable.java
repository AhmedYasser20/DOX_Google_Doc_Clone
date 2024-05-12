package com.dox_google_doc_clone.dox_google_doc_clone.Models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class DocumentVersionTable {
    @CreatedDate
    private LocalDateTime createdAt;

    @Id
    private String id;

    private List<String> documentVersions;

    private String documentId;

    public DocumentVersionTable(LocalDateTime createdAt, List<String> documentVersions,
            String documentId) {
        this.createdAt = createdAt;
        this.documentVersions = documentVersions;
        this.documentId = documentId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getDocumentVersions() {
        return documentVersions;
    }

    public void setDocumentVersions(List<String> documentVersions) {
        this.documentVersions = documentVersions;
    }

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }
}