// src/services/adminServices.js
import axios from 'axios';
import Utils from '../config/utils';

const API_URL = 'your-api-base-url'; // Replace with your actual API URL

class AdminServices {
  // Get authentication token
  getAuthHeader() {
    const user = Utils.getStore('user');
    return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
  }

  // Get all users
  async getAllUsers() {
    return axios.get(`${API_URL}/admin/users`, {
      headers: this.getAuthHeader()
    });
  }

  // Delete a user
  async deleteUser(userId) {
    return axios.delete(`${API_URL}/admin/users/${userId}`, {
      headers: this.getAuthHeader()
    });
  }

  // Update user role
  async updateUserRole(userId, role) {
    return axios.patch(`${API_URL}/admin/users/${userId}/role`, 
      { role },
      { headers: this.getAuthHeader() }
    );
  }

  // Get system statistics
  async getSystemStats() {
    return axios.get(`${API_URL}/admin/stats`, {
      headers: this.getAuthHeader()
    });
  }
}

export default new AdminServices();