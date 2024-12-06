<script setup>
import { ref, onMounted } from 'vue';
import AdminServices from '../services/adminServices';

const users = ref([]);
const stats = ref(null);
const loading = ref(false);
const errorMessage = ref('');

// Fetch all users
const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await AdminServices.getAllUsers();
    users.value = response.data;
  } catch (error) {
    errorMessage.value = 'Error fetching users: ' + error.message;
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

// Fetch system statistics
const fetchStats = async () => {
  try {
    const response = await AdminServices.getSystemStats();
    stats.value = response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

// Delete user
const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return;
  
  loading.value = true;
  try {
    await AdminServices.deleteUser(userId);
    await fetchUsers(); // Refresh user list
    await fetchStats(); // Refresh stats
  } catch (error) {
    errorMessage.value = 'Error deleting user: ' + error.message;
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

// Update user role
const updateUserRole = async (userId, newRole) => {
  loading.value = true;
  try {
    await AdminServices.updateUserRole(userId, newRole);
    await fetchUsers(); // Refresh user list
    await fetchStats(); // Refresh stats
  } catch (error) {
    errorMessage.value = 'Error updating user role: ' + error.message;
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
  fetchStats();
});
</script>

<template>
  <v-container>
    <!-- Stats Cards -->
    <v-row v-if="stats" class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Total Users</div>
            <div class="text-h4">{{ stats.totalUsers }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Admins</div>
            <div class="text-h4">{{ stats.adminCount }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Students</div>
            <div class="text-h4">{{ stats.studentCount }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Total Resumes</div>
            <div class="text-h4">{{ stats.totalResumes }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Error Alert -->
    <v-row v-if="errorMessage" class="mb-4">
      <v-col>
        <v-alert type="error" variant="tonal" closable>
          {{ errorMessage }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- Users Table -->
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            Users
            <v-btn
              color="primary"
              @click="fetchUsers"
              :loading="loading"
            >
              Refresh
            </v-btn>
          </v-card-title>
          
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">ID</th>
                  <th class="text-left">Name</th>
                  <th class="text-left">Email</th>
                  <th class="text-left">Role</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.user_id">
                  <td>{{ user.user_id }}</td>
                  <td>{{ user.fName }} {{ user.lName }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <v-chip
                      :color="user.role === 'admin' ? 'primary' : 'default'"
                      size="small"
                    >
                      {{ user.role }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <v-btn-group>
                      <v-btn
                        size="small"
                        color="primary"
                        variant="text"
                        :loading="loading"
                        @click="updateUserRole(user.user_id, user.role === 'admin' ? 'student' : 'admin')"
                      >
                        {{ user.role === 'admin' ? 'Make Student' : 'Make Admin' }}
                      </v-btn>
                      <v-btn
                        size="small"
                        color="error"
                        variant="text"
                        :loading="loading"
                        @click="deleteUser(user.user_id)"
                      >
                        Delete
                      </v-btn>
                    </v-btn-group>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>