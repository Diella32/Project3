import apiClient from './services.js';

export default {
  // Create a new experience
  createExperience(data) {
    return apiClient.post('/experience/', data);
  },

  // Get all experiences for a specific resume
  getExperiences(userId) {
    return apiClient.get(`/experience/user/${userId}`);
  },

  // Get a single experience by ID
  getExperience(id) {
    return apiClient.get(`/experience/${id}`);
  },

  // Update an experience by ID
  updateExperience(id, data) {
    return apiClient.put(`/experience/${id}`, data);
  },

  // Delete an experience by ID
  deleteExperience(id) {
    return apiClient.delete(`/experience/${id}`);
  },

  // Delete all experiences for a specific resume
  deleteAllExperiences(resumeId) {
    return apiClient.delete(`/resume/experiences/resume/${resumeId}`);
  },
};
