import apiClient from './services';

export default {
  // Retrieve all education entries for a specific resume
  getAllEducations(userId) {
    return apiClient.get(`/education/user/${userId}`);
  },
  
  // Retrieve a specific education entry by ID
  getEducationById(userId, educationId) {
    return apiClient.get(`/education/${educationId}`);
  },

  // Create a new education entry
  createEducation(data) {
    return apiClient.post(`/education`, data);
  },

  // Update an education entry by ID
  updateEducation(userId, educationId,data) {
    return apiClient.put(`/education/${educationId}`, data);
  },

  // Delete a specific education entry by ID
  deleteEducation(userId,educationId) {
    return apiClient.delete(`/education/${educationId}`);
  },

  // Delete all education entries
  deleteAllEducation() {
    return apiClient.delete("/education");
  }
};
