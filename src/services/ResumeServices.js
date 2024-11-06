import apiClient from './services';

export default {
  getAll() {
    return apiClient.get("/"); // Update to match baseURL path
  },
  
  getAllForUser(userId) {
    return apiClient.get(`/userResumes/${userId}`);
  },
  
  get(id) {
    return apiClient.get(`/${id}`);
  },
  
  create(data) {
    return apiClient.post("/", data); // Match baseURL path
  },
  
  update(id, data) {
    return apiClient.put(`/${id}`, data);
  },
  
  delete(id) {
    return apiClient.delete(`/${id}`);
  },
  
  deleteAll() {
    return apiClient.delete("/");
  }
};
