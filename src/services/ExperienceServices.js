import apiClient from './services.js';

export default {
    // Create a new experience
    createExperience(data) {
        return apiClient.post('/experience/', data);
    },

    // Get all experiences for a specific resume
    getExperiencesForResume(resumeId) {
        return apiClient.get(`resume/experience/resume/${resumeId}`);
    },

    getExperiencesForUser(userId) {
        return apiClient.get(`/experience/user/${userId}`);
    },

    // Get a single experience
    getExperienceById(id) {
        return apiClient.get(`/experience/${id}`);
    },

    // Update an experience
    updateExperience(id, data) {
        return apiClient.put(`/experience/${id}`, data);
    },

    // Delete an experience
    deleteExperience(id) {
        return apiClient.delete(`/experience/${id}`);
    },

    // Delete all experiences for a resume
    deleteAllExperiences(resumeId) {
        return apiClient.delete(`/experience/resume/${resumeId}`);
    },
}
