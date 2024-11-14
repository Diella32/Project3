import apiClient from '../services/services';

export default {
  // Create a new AwardCertifications
  createCertification(data) {
    return apiClient.post(`/AwardCertificatios/${id}`, data);
  },

  // Get all AwardCertificationss for a specific resume
  getCertification(userId) {
    return apiClient.get(`/AwardCertifications/${userId}`);
  },

  // Get a single AwardCertifications by ID
  getCertificationById(id) {
    return apiClient.get(`/AwardCertifications/${id}`);
  },

  // Update an AwardCertifications by ID
  updateCertificationById(id, data) {
    return apiClient.put(`/AwardCertifications/${id}`, data);
  },

  // Delete an AwardCertifications by ID
  deleteCertificationById(id) {
    return apiClient.delete(`/AwardCertifications/${id}`);
  },

  // Delete all AwardCertificationss for a specific resume
  deleteAllCertifications(resumeId) {
    return apiClient.delete(`/resume/AwardCertifications/resume/${resumeId}`);
  },
};