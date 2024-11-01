import apiClient from "./services.js";

export default {
  // Retrieve all resumes
  getAll() {
    return apiClient.get("/resumes");
  },
  
  // Retrieve all resumes for a specific user
  getAllForUser(userId) {
    return apiClient.get("/resumes/userResumes/" + userId);
  },
  
  // Retrieve a single resume by ID
  get(id) {
    return apiClient.get(`/resumes/${id}`);
  },
  
  // Create a new resume
  create(data) {
    return apiClient.post("/resumes", data);
  },
  
  // Update an existing resume
  update(id, data) {
    return apiClient.put(`/resumes/${id}`, data);
  },
  
  // Delete a resume by ID
  delete(id) {
    return apiClient.delete(`/resumes/${id}`);
  },
  
  // Delete all resumes
  deleteAll() {
    return apiClient.delete(`/resumes`);
  },

  // You can add more methods as needed
};
