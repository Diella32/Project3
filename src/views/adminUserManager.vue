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

const deleteUser = async (userId) => {
  loading.value = true;
  try {
    await AdminServices.deleteUser(userId);
    await fetchUsers();
  } catch (error) {
    errorMessage.value = 'Error deleting user: ' + error.message;
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
        <h1 class="text-h4 mb-4">User Management</h1>
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
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.fName }} {{ user.lName }}</td>
                  <td>{{ user.email }}</td>
                  <td class="text-center">
                    <v-btn
                      size="small"
                      color="error"
                      variant="text"
                      :loading="loading"
                      @click="deleteUser(user.id)"
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