<template>
  <div class="certifications-wrapper">
    <div class="certifications-container">
      <v-row class="fill-height ma-0" align="start" justify="center">
        <v-col cols="12" class="pa-0">
          <v-card class="certifications-card" elevation="0">
            <!-- Header -->
            <v-card-item class="text-center header-section">
              <v-icon icon="mdi-certificate" size="72" color="primary" class="mb-6"></v-icon>
              <v-card-title class="text-h2 font-weight-bold mb-4">Awards & Certifications</v-card-title>
              <v-card-subtitle class="text-h5 mb-6">Add your certifications and achievements</v-card-subtitle>
            </v-card-item>

            <v-divider></v-divider>

            <!-- Certifications List -->
            <v-card-text class="certifications-content py-6">
              <v-container>
                <!-- Add New Certification Button -->
                <v-row justify="center" class="mb-6">
                  <v-col cols="12" md="8">
                    <v-btn color="primary" block @click="addNewCertification" size="large" prepend-icon="mdi-plus">
                      Add New Certification
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- Certifications List -->
                <v-row justify="center">
                  <v-col cols="12" md="8">
                    <v-expansion-panels v-model="expandedPanel">
                      <v-expansion-panel v-for="(cert, index) in certifications" :key="cert.id || index" :disabled="isValidating">
                        <v-expansion-panel-title>
                          <span class="text-h6">{{ cert.award_name || 'New Certification' }}</span>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <v-form v-model="cert.valid">
                            <!-- Award/Certification Title -->
                            <v-text-field
                              v-model="cert.award_name"
                              label="Award/Certification Title"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="comfortable"
                              class="mb-4"
                            ></v-text-field>

                            <!-- Issuing Organization -->
                            <v-text-field
                              v-model="cert.organization"
                              label="Issuing Organization"
                              variant="outlined"
                              density="comfortable"
                              class="mb-4"
                            ></v-text-field>

                            <!-- Action Buttons -->
                            <v-row class="mt-4">
                              <v-col cols="6">
                                <v-btn
                                  color="error"
                                  block
                                  @click="deleteCertification(cert.id)"
                                  :disabled="isValidating"
                                >
                                  Delete
                                </v-btn>
                              </v-col>
                              <v-col cols="6">
                                <v-btn
                                  color="success"
                                  block
                                  @click="validateCertification(index)"
                                  :loading="isValidating"
                                >
                                  Save
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-form>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

          <!-- Navigation Buttons -->
          <v-card-actions class="d-flex justify-space-between">

      <v-btn color="primary" @click="router.push({ name: 'Skill' })">

        <v-icon left>mdi-arrow-left</v-icon>
        Previous
      </v-btn>
      <v-btn color="primary" @click="router.push({ name: 'enterInterests' })">
        Next
        <v-icon right>mdi-arrow-right</v-icon>
      </v-btn>
      </v-card-actions>

    <!-- Notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>




<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import certificationServices from '../services/certificationServices';
import store from '../store/store';

const router = useRouter();
const user = store.getters.getLoginUserInfo;

// State variables
const certifications = ref([]);
const expandedPanel = ref(null);
const isValidating = ref(false);

// Snackbar state
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
});

// Validation rules
const rules = {
  required: v => !!v || 'Field is required',
};

// Computed property for overall validity
const isValid = computed(() => certifications.value.every(cert => cert.valid));

// New certification template
const newCertificationTemplate = {
  award_name: '',
  organization: '',
  userId: user.user_id,
  valid: false,
};

// Fetch certifications
const fetchCertifications = async () => {
  try {
    const response = await certificationServices.getCertification(user.user_id);
    certifications.value = response.data || [];
  } catch (error) {
    console.error('Error fetching certifications:', error);
    showNotification('Failed to load certifications', 'error');
  }
};

onMounted(() => {
  fetchCertifications();
});

// Add a new certification
const addNewCertification = () => {
  certifications.value.push({ ...newCertificationTemplate });
  expandedPanel.value = certifications.value.length - 1;
};

// Save a certification
const validateCertification = async (index) => {
  isValidating.value = true;
  try {
    const cert = certifications.value[index];

    if (!cert.award_id) {
      // New certification: Create on backend
      const response = await certificationServices.createCertification(cert);
      cert.id = response.data.id;
    } else {
      // Existing certification: Update on backend
      await certificationServices.updateCertificationById(cert.id, cert);
    }
    showNotification('Certification saved successfully', 'success');
    expandedPanel.value = null;
  } catch (error) {
    console.error('Error saving certification:', error);
    showNotification('Failed to save certification', 'error');
  } finally {
    isValidating.value = false;
  }
};

// Delete a certification
const deleteCertification = async (id) => {
  isValidating.value = true;
  try {
    await certificationServices.deleteCertificationById(userId, id);
    certifications.value = certifications.value.filter(cert => cert.id !== id);
    showNotification('Certification deleted successfully');
  } catch (error) {
    console.error('Error deleting certification:', error);
    showNotification('Failed to delete certification', 'error');
  } finally {
    isValidating.value = false;
  }
};

// Show notification
const showNotification = (text, color = 'success', timeout = 3000) => {
  snackbar.value = { show: true, text, color, timeout };
};
</script>



<style scoped>
.certifications-wrapper {
  min-height: 100vh;
  width: 100vw;
  background-color: rgb(var(--v-theme-background));
  display: flex;
  flex-direction: column;
}

.certifications-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.certifications-card {
  min-height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.header-section {
  padding-top: 4rem;
  padding-bottom: 2rem;
}

.certifications-content {
  flex: 1;
}

.text-center {
  text-align: center;
}
</style>
