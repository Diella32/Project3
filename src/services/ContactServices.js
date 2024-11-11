// contactServices.js

import apiClient from './services';

export default {
  getAllContacts() {
    return apiClient.get("/contactInfo");
  },

  getContact(id) {
    return apiClient.get(`/contactInfo/${id}`);
  },

  createContact(data) {
    return apiClient.post("/contactInfo", data); 
  },

  updateContact(id, data) {
    return apiClient.put(`/contactInfo/${id}`, data);  // Use the correct URL
  },

  deleteContact(id) {
    return apiClient.delete(`/contactInfo/${id}`);  // Use the correct URL
  },

  deleteAllContacts() {
    return apiClient.delete("/contactInfo");  // Use the correct URL
  }
};
