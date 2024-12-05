// src/services/adminServices.js
import apiClient from './services';

class AdminServices {
  // Get all users
  getAllUsers() {
    return apiClient.get("/admin/users");
  }

  // Delete a user
  deleteUser(userId) {
    return apiClient.delete(`/admin/users/${userId}`);
  }

  // Update user role
  updateUserRole(userId, role) {
    return apiClient.patch(`/admin/users/${userId}/role`, { role });
  }

  // Get system statistics
  getSystemStats() {
    return apiClient.get("/admin/stats");
  }
}

export default new AdminServices();