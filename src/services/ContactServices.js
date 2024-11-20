// contactServices.js

import apiClient from './services';

export default {
  getAllContacts(userId) {
    return apiClient.get(`/contactInfo/user/${userId}`);
  },
  getContact(userId, contactInfoId) {
    return apiClient.get(`/user/${userId}/contactInfo/${contactInfoId}`);
  },

  createContact(data) {
    return apiClient.post('/contactInfo', data); 
  },

  updateContact(userId,contactInfoId, data) {
    return apiClient.put(`/contactInfo/${contactInfoId}`, data);  // Use the correct URL
  },

  deleteContact(userId,contactInfoId) {
    return apiClient.delete(`/contactInfo/${contactInfoId}`);  // Use the correct URL
  },

  deleteAllContacts() {
    return apiClient.delete("/contactInfo");  // Use the correct URL
  }
};


  