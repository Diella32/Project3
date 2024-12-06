import apiClient from './services.js';

export default {
  // Create a new request
  create(data) {
    return apiClient.post('/requests', data);
  },

  // Fetch all requests
  getAll() {
    return apiClient.get('/requests/resumes/${resumeId}`);');
  },

  // Fetch a specific request by ID
  getOne(requestId) {
    return apiClient.get(`/resume-t9/requests/requestId/${requestId}`);
  },

  // Fetch all requests for a specific user
  getAllForUser(userId) {
    return apiClient.get(`/resume-t9/requests/userReq/${userId}`);
  },

  // Fetch all requests for a specific status
  getAllForStatus(status) {
    return apiClient.get(`/resume-t9/requests/statusReq/${status}`);
  },

  // Update a request by ID
  update(requestId, data) {
    return apiClient.put(`/resume-t9/requests/${requestId}`, data);
  },

  // Delete a request by ID
  delete(requestId) {
    console.log('Deleting request with ID:', requestId);
    return apiClient.delete(`/resume-t9/requests/${requestId}`);
  }
};
