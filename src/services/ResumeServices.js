import apiClient from './services';

export default {
  // Fetch all resumes
  getAll() {
    return apiClient.get("/resumes");
  },

  // Fetch all resumes for a specific user
  getAllForUser(userId) {
    return apiClient.get(`/resumes/user/${userId}`);
  },

  // Fetch a specific resume by ID
  getResume(resumeId) {
    return apiClient.get(`/resumes/${resumeId}`);
  },

  // Create a new resume
  create(data) {
    return apiClient.post("/resumes", data);
  },

  // Update a resume by ID
  update(resumeId, data) {
    return apiClient.put(`/resumes/${resumeId}`, data);
  },

  // Delete a resume by ID
  delete(resumeId) {
    return apiClient.delete(`/resumes/${resumeId}`);
  },

  // Delete all resumes
  deleteAll() {
    return apiClient.delete("/resumes");
  }
};
