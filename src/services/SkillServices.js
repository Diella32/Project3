import apiClient from './services.js';

export default {
  // Create a new skill
  createSkill(data) {
    return apiClient.post('/skills/', data);
  },

  // Get all skills for a specific user
  getSkills(userId) {
    return apiClient.get(`/skills/user/${userId}`);
  },

  // Get a single skill by ID
  getSkill(id) {
    return apiClient.get(`/skills/${id}`);
  },

  // Update a skill by ID
  updateSkill(id, data) {
    return apiClient.put(`/skills/${id}`, data);
  },

  // Delete a skill by ID
  deleteSkill(id) {
    return apiClient.delete(`/skills/${id}`);
  },

  // Delete all skills for a specific user
  deleteAllSkills(userId) {
    return apiClient.delete(`/skills/user/${userId}`);
  },
};
