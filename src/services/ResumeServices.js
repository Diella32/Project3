import apiClient from './services';

export default {
  getAll() {
    return apiClient.get("/resumes"); // Fetch all resumes
  },
  
  getAllForUser(userId) {
    return apiClient.get(`/resumes/user/${userId}`); // Fetch all resumes for a specific user
  },
  
  getResume(userId, resumeId) {
    return apiClient.get(`/resumes/${resumeId}`); // Fetch a specific resume by ID
  },
  
  create(data) {
    return apiClient.post("/resumes", data); // Create a new resume
  },
  
  update(userId, resume_id,data) {
    return apiClient.put(`/resumes/${resume_id}`, data); // Update a resume by ID
  },
  
  delete(resume_id) {
    return apiClient.delete(`/resumes/${resume_id}`); // Delete a resume by ID
  },
  
  deleteAll() {
    return apiClient.delete("/resume/resumes"); // Delete all resumes
  }
};
