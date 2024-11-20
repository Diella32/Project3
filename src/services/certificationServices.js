import apiClient from '../services/services';

export default {
  createCertification(data) {
    return apiClient.post('/AwardCertification', data);
  },

  getCertification(userId) {
    return apiClient.get(`/AwardCertification/user/${userId}`);
  },

  getCertificationById(award_id) {
    return apiClient.get(`/AwardCertification/${award_id}`);
  },

  updateCertificationById(award_id, data) {
    return apiClient.put(`/AwardCertification/${award_id}`, data);
  },

  deleteCertificationById(award_id) {
    return apiClient.delete(`/AwardCertification/${award_id}`);
  },


  // Delete all AwardCertifications for a specific resume
  deleteAllCertifications(resumeId) {
    return apiClient.delete(`/resume/AwardCertification/resume/${resumeId}`);
  },
};