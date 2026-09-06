package com.resumebuilder.resume_builder.service;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TextExtractionService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public String extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty or missing.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 10MB limit.");
        }

        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        System.out.println("[PDF] Starting extraction: " + filename);

        try {
            String lowerName = filename.toLowerCase();
            String result;
            if (lowerName.endsWith(".pdf") || "application/pdf".equalsIgnoreCase(file.getContentType())) {
                result = extractTextFromPdf(file.getBytes());
            } else if (lowerName.endsWith(".docx") || "application/vnd.openxmlformats-officedocument.wordprocessingml.document".equalsIgnoreCase(file.getContentType())) {
                result = extractTextFromDocx(file);
            } else if (lowerName.endsWith(".txt") || "text/plain".equalsIgnoreCase(file.getContentType())) {
                result = extractTextFromTxt(file.getBytes());
            } else {
                throw new IllegalArgumentException("Unsupported file type (" + filename + "). Please upload PDF, DOCX, or TXT.");
            }
            System.out.println("[PDF] Extraction completed");
            System.out.println("[PDF] Character count: " + result.length());
            return result;
        } catch (IllegalArgumentException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to extract text from file: " + ex.getMessage(), ex);
        }
    }

    private String extractTextFromPdf(byte[] bytes) throws Exception {
        try (PDDocument document = Loader.loadPDF(bytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            if (text == null || text.trim().isEmpty()) {
                throw new IllegalArgumentException("Could not extract readable text from PDF. The document may be scanned or image-based.");
            }
            return text.trim();
        }
    }

    private String extractTextFromDocx(MultipartFile file) throws Exception {
        try (InputStream is = file.getInputStream();
             XWPFDocument doc = new XWPFDocument(is);
             XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
            String text = extractor.getText();
            if (text == null || text.trim().isEmpty()) {
                throw new IllegalArgumentException("DOCX file contains no readable text.");
            }
            return text.trim();
        }
    }

    private String extractTextFromTxt(byte[] bytes) {
        String text = new String(bytes, StandardCharsets.UTF_8).trim();
        if (text.isEmpty()) {
            throw new IllegalArgumentException("TXT file is empty.");
        }
        return text;
    }
}
