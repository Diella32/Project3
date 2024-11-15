import apiClient from '../services/services';

export default {
  // Create a new AwardCertifications
  createCertification(data) {
    return apiClient.post(`/AwardCertification/${id}`, data);
  },

  // Get all AwardCertificationss for a specific resume
  getCertification(userId) {
    return apiClient.get(`/AwardCertification/${userId}`);
  },

  // Get a single AwardCertifications by ID
  getCertificationById(id) {
    return apiClient.get(`/AwardCertification/${id}`);
  },

  // Update an AwardCertifications by ID
  updateCertificationById(id, data) {
    return apiClient.put(`/AwardCertification/${id}`, data);
  },

  // Delete an AwardCertifications by ID
  deleteCertificationById(id) {
    return apiClient.delete(`/AwardCertification/${id}`);
  },

  // Delete all AwardCertificationss for a specific resume
  deleteAllCertifications(resumeId) {
    return apiClient.delete(`/resume/AwardCertification/resume/${resumeId}`);
  },
};