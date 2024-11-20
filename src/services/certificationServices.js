import apiClient from './services';

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
    const updateData = {
      ...data,
      award_id: award_id 
    };
    return apiClient.put(`/AwardCertification/${award_id}`, updateData);
  },

  deleteCertificationById(award_id) {
    console.log('Sending delete request for award_id:', award_id);
    return apiClient.delete(`/AwardCertification/${award_id}`);
  },
  // Delete all AwardCertificationss for a specific resume
  deleteAllCertifications(resumeId) {
    return apiClient.delete(`/resume/AwardCertifications/resume/${resumeId}`);
  },
};