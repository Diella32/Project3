import apiClient from './services.js';

export default {

  // Get all projects for a specific resume
  getAllProjects(userId) {
    return apiClient.get(`/projects/user/${userId}`);
  },

  // Get a single project by ID for a specific resume
  getProject(userId, projectId) {
    return apiClient.get(`/user/${userId}/projects/${projectId}`);
  },

  // Create a new project under a specific resume
  createProject(data) {
    return apiClient.post(`/projects`, data);
  },

  // Update an existing project by ID for a specific resume
  updateProject(userId, projectId, data) {
    return apiClient.put(`/user/${userId}/projects/${projectId}`, data);
  },

  // Delete a project by ID for a specific resume
  deleteProject(userId, projectId) {
    return apiClient.delete(`/user/${userId}/projects/${projectId}`);
  }
};
