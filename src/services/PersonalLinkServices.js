import apiClient from './services.js';

export default {

  // Get all PersonalLinks for a specific resume
  getAllPersonalLinks(userId) {
    return apiClient.get(`/PersonalLinks/user/${userId}`);
  },

  // Get a single PersonalLinks by ID for a specific resume
  getPersonalLinks(userId, projectId) {
    return apiClient.get(`/user/${userId}/PersonalLinks/${PersonalLinksId}`);
  },

  // Create a new PersonalLinks under a specific resume
  createPersonalLinks(data) {
    return apiClient.post(`/PersonalLinks`, data);
  },

  // Update an existing PersonalLinks by ID for a specific resume
  updatePersonalLinks(userId, PersonalLinksId, data) {
    return apiClient.put(`/user/${userId}/PersonalLinks/${PersonalLinksId}`, data);
  },

  // Delete a PersonalLinks by ID for a specific resume
  deletePersonalLinks(userId, PersonalLinksId) {
    return apiClient.delete(`/user/${userId}/PersonalLinks/${PersonalLinksId}`);
  }
};
