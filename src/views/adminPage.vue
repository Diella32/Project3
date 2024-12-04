<!-- src/views/AdminPage.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import AdminServices from '../services/adminServices';

const users = ref([]);
const loading = ref(false);
const errorMessage = ref('');

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

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-4">Admin Dashboard</h1>
      </v-col>
    </v-row>

    <v-row v-if="errorMessage" class="mb-4">
      <v-col>
        <v-alert type="error" variant="tonal">
          {{ errorMessage }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            Users Management
            <v-btn
              color="primary"
              @click="fetchUsers"
              :loading="loading"
            >
              Refresh Users
            </v-btn>
          </v-card-title>
          
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user._id">
                  <td>{{ user.fName }} {{ user.lName }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.role || 'User' }}</td>
                  <td>
                    <v-btn
                      size="small"
                      color="error"
                      variant="text"
                      @click="deleteUser(user._id)"
                      :loading="loading"
                    >
                      Delete
                    </v-btn>
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