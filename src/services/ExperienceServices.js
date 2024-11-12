import apiClient from './services.js';

export default {
    // Create a new experience
    createExperience(data) {
        return apiClient.post('/experiences/', data);
    },

    // Get all experiences for a specific resume
    getExperiencesForResume(resumeId) {
        return apiClient.get(`resume/experiences/resume/${resumeId}`);
    },

    // Get a single experience
    getExperienceById(id) {
        return apiClient.get(`resume/experiences/${id}`);
    },

    // Update an experience
    updateExperience(id, data) {
        return apiClient.put(`resume/experiences/${id}`, data);
    },

    // Delete an experience
    deleteExperience(id) {
        return apiClient.delete(`resume/experiences/${id}`);
    },

    // Delete all experiences for a resume
    deleteAllExperiences(resumeId) {
        return apiClient.delete(`resume/experiences/resume/${resumeId}`);
    },
}
