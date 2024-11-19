import apiClient from '../services/services';

export default {
  // Create a new AwardCertification
  createCertification(data) {
    return apiClient.post('/AwardCertification', data);
  },

  // Get all AwardCertifications for a specific user
  getCertification(userId) {
    // Updated to match the findAllForUser endpoint
    return apiClient.get(`/AwardCertification/user/${userId}`);
  },

  // Get a single AwardCertification by ID
  getCertificationById(id) {
    return apiClient.get(`/AwardCertification/${id}`);
  },

  // Update an AwardCertification by ID
  updateCertificationById(id, data) {
    return apiClient.put(`/AwardCertification/${id}`, data);
  },

  // Delete an AwardCertification by ID
  deleteCertificationById(id) {
    return apiClient.delete(`/AwardCertification/${id}`);
  },

  // Delete all AwardCertifications for a specific resume
  deleteAllCertifications(resumeId) {
    return apiClient.delete(`/resume/AwardCertification/resume/${resumeId}`);
  },
};