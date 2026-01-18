import axiosInstance from "../config/axios.config";

// Submit a contact form
export const submitContact=(firstName, lastName, email, phone, subject, message) =>
    axiosInstance.post("/contact", {
        firstName,
        lastName,
        email,
        phone,
        subject,
        message
    });

// Get all contacts (admin)
export const getAllContacts=(status, search, page=1, limit=10) =>
    axiosInstance.get("/contact", {
        params: {status, search, page, limit}
    });

// Get single contact (admin)
export const getContactById=(contactId) =>
    axiosInstance.get(`/contact/${contactId}`);

// Update contact status (admin)
export const updateContactStatus=(contactId, status) =>
    axiosInstance.put(`/contact/${contactId}/status`, {status});

// Add reply to contact (admin) - LEGACY
export const addContactReply=(contactId, message) =>
    axiosInstance.post(`/contact/${contactId}/reply`, {message});

// Add reply to contact with email notification (admin) - ENHANCED
export const addContactReplyEnhanced=(contactId, reply, customerEmail, customerName, sendEmail=true) =>
    axiosInstance.post(`/contact/${contactId}/reply-enhanced`, {
        reply,
        customerEmail,
        customerName,
        sendEmail
    });

// Delete contact (admin)
export const deleteContact=(contactId) =>
    axiosInstance.delete(`/contact/${contactId}`);

// ============================================
// REDUX SLICE UPDATE NEEDED
// ============================================
// Update your contact.slice.js import to:
// import { addContactReplyEnhanced } from '../../api/contact.api';
//
// Then update sendReplyToContact thunk to:
// const response = await addContactReplyEnhanced(contactId, reply, customerEmail, customerName, true);