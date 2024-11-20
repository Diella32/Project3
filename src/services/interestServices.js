import apiClient from './services.js';

export default {
  // Get all interests for a specific resume
  getAllInterests(userId) {
    return apiClient.get(`/interest/user/${userId}`);
  },

  // Get a single interest by ID for a specific resume
  getInterest(userId, resumeId, interestId) {
    return apiClient.get(`/resume/${resumeId}/interest/user/${userId}/interest/${interestId}`);
  },

  // Create a new interest under a specific resume
  createInterest(data) {
    return apiClient.post(`/interest`, data);
  },

  // Update an existing interest by ID for a specific resume
  updateInterest(userId, resumeId, interestId, data) {
    return apiClient.put(`/resume/${resumeId}/interest/user/${userId}/interest/${interestId}`, data);
  },

  // Delete an interest by ID for a specific resume
//   deleteInterest(userId, resumeId, interestId) {
//     return apiClient.delete(`/resume/${resumeId}/interest/user/${userId}/interest/${interestId}`);
//   }

  deleteInterest(data) {
    console.log(data)
    return apiClient.delete(`/interest/${data.interest_id}`, data);
  }
};
