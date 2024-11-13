import apiClient from './services';  // Import your configured axios instance

export default {
  getAllContacts(userId) {
    return apiClient.get(`/user/${userId}/contactInfo`).catch(error => {
      console.error("Error fetching contacts:", error.response || error.message);
      throw error;
    });
  },
  getContact(userId, id) {
    return apiClient.get(`/user/${userId}/contactInfo/${id}`).catch(error => {
      console.error("Error fetching contact:", error.response || error.message);
      throw error;
    });
  },
  createContact(data) {
    return apiClient.post(`/contactInfo`, data).catch(error => {
      console.error("Error creating contact:", error.response || error.message);
      throw error;
    });
  },
  updateContact(userId, id, data) {
    return apiClient.put(`/user/${userId}/contactInfo/${id}`, data).catch(error => {
      console.error("Error updating contact:", error.response || error.message);
      throw error;
    });
  },
  deleteContact(userId, id) {
    return apiClient.delete(`/user/${userId}/contactInfo/${id}`).catch(error => {
      console.error("Error deleting contact:", error.response || error.message);
      throw error;
    });
  },
  deleteAllContacts(userId) {
    return apiClient.delete(`/user/${userId}/contactInfo`).catch(error => {
      console.error("Error deleting all contacts:", error.response || error.message);
      throw error;
    });
  }
};
