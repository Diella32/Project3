<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminServices from '../services/adminServices';

const router = useRouter();
const users = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const selectedRoles = ref([]);
const availableRoles = ["admin", "student"];

const checkAdminAccess = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'admin') {
    router.push('/');
    return false;
  }
  return true;
};

const fetchUsers = async () => {
  if (!checkAdminAccess()) return;
  
  loading.value = true;
  try {
    const response = await AdminServices.getAllUsers();
    users.value = response.data;
    selectedRoles.value = users.value.map(user => user.role);
  } catch (error) {
    errorMessage.value = 'Error fetching users: ' + error.message;
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

const saveUserRole = async (user, index) => {
  loading.value = true;
  try {
    await AdminServices.updateUserRole(user.id, selectedRoles.value[index]);
    await fetchUsers();
  } catch (error) {
    errorMessage.value = 'Error updating user role: ' + error.message;
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
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (checkAdminAccess()) {
    fetchUsers();
  }
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
                  <th class="text-left">ID</th>
                  <th class="text-left">Last</th>
                  <th class="text-left">First</th>
                  <th class="text-left">Email</th>
                  <th class="text-left">Role</th>
                  <th class="text-left">Std. ID</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in users" :key="user.id" style="background-color: #d5dfe7">
                  <td>{{ user.id }}</td>
                  <td>{{ user.lName }}</td>
                  <td>{{ user.fName }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <v-combobox
                      :items="availableRoles"
                      label="roles"
                      v-model="selectedRoles[index]"
                    ></v-combobox>
                  </td>
                  <td>{{ user.studentId }}</td>
                  <td>
                    <v-btn
                      size="small"
                      color="primary"
                      class="mr-2"
                      :loading="loading"
                      @click="saveUserRole(user, index)"
                    >
                      Save
                    </v-btn>
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