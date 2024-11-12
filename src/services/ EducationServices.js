import apiClient from './services';

export default {
  // Retrieve all education entries for a specific resume
  getAllEducationForResume(resumeId) {
    return apiClient.get(`/education/${resumeId}`);
  },
  
  // Retrieve a specific education entry by ID
  getEducationById(id) {
    return apiClient.get(`/education/${id}`);
  },

  // Create a new education entry
  createEducation(data) {
    return apiClient.post("/education", data);
  },

  // Update an education entry by ID
  updateEducation(id, data) {
    return apiClient.put(`/education/${id}`, data);
  },

  // Delete a specific education entry by ID
  deleteEducation(id) {
    return apiClient.delete(`/education/${id}`);
  },

  // Delete all education entries
  deleteAllEducation() {
    return apiClient.delete("/education");
  }
};
