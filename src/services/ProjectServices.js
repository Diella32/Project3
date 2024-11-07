import apiClient from './services.js';

export default {

  // Get all projects for a specific resume
  getAllProjects(resumeId) {
    return apiClient.get(`/resumes/${resumeId}/projects`);
  },

  // Get a single project by ID for a specific resume
  getProject(resumeId, projectId) {
    return apiClient.get(`/resumes/${resumeId}/projects/${projectId}`);
  },

  // Create a new project under a specific resume
  createProject(resumeId, data) {
    return apiClient.post(`/resumes/${resumeId}/projects`, data);
  },

  // Update an existing project by ID for a specific resume
  updateProject(resumeId, projectId, data) {
    return apiClient.put(`/resumes/${resumeId}/projects/${projectId}`, data);
  },

  // Delete a project by ID for a specific resume
  deleteProject(resumeId, projectId) {
    return apiClient.delete(`/resumes/${resumeId}/projects/${projectId}`);
  }
};
