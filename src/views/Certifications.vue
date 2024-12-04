<template>
  <div class="certifications-container">
    <v-row class="fill-height ma-0" align="start" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" class="pa-4">
        <v-card class="certifications-card" elevation="3">
          <v-card-item class="text-center pb-4">
            <v-icon icon="mdi-certificate" size="64" color="primary" class="mb-4"></v-icon>
            <v-card-title class="text-h3 font-weight-bold mb-2">
              Awards & Certifications
            </v-card-title>
            <v-card-subtitle class="text-h6">
              Add your professional certifications and achievements
            </v-card-subtitle>
          </v-card-item>
          

          <v-divider></v-divider>

          <v-card-text v-if="lastApiError" class="error--text my-2">
            API Error: {{ lastApiError }}
          </v-card-text>

          <!-- Certifications Form -->
          <v-card-text class="py-6">
            <v-form v-model="isValid" @submit.prevent="saveCertification">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="certificationForm.award_name"
                    label="Award/Certification Title"
                    :rules="[v => !!v || 'Title is required']"
                    variant="outlined"
                    density="comfortable"
                    class="mb-4"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="certificationForm.organization"
                    label="Issuing Organization"
                    variant="outlined"
                    density="comfortable"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-card-actions class="px-4 pb-4 d-flex justify-space-between">
                <v-btn variant="outlined" color="primary" @click="resetForm">
                  Clear
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="!isValid" type="submit">
                  {{ editMode ? 'Update' : 'Save' }}
                </v-btn>
              </v-card-actions>
            </v-form>

            <!-- Display existing certifications -->
            <v-row v-if="certifications.length > 0">
              <v-col cols="12" v-for="cert in certifications" :key="cert.id" class="mb-6">
                <v-card variant="outlined" class="mb-2">
                  <v-card-item>
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <v-card-title>{{ cert.award_name }}</v-card-title>
                        <v-card-subtitle>{{ cert.organization }}</v-card-subtitle>
                      </div>
                      <div>
                        <v-btn
                          icon="mdi-pencil"
                          variant="text"
                          density="comfortable"
                          @click="editCertification(cert)"
                          class="mr-2"
                        ></v-btn>
                        <v-btn
                          icon="mdi-delete"
                          variant="text"
                          color="error"
                          density="comfortable"
                          @click="deleteCertification(cert.id)"
                        ></v-btn>
                      </div>
                    </div>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Navigation Buttons -->
          <v-card-actions class="px-4 pt-2 pb-4 d-flex justify-space-between">
            <v-btn icon="mdi-arrow-left" color="primary" @click="goBack">Back</v-btn>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-arrow-right" color="primary" @click="goNext">Next</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import certificationServices from '../services/certificationServices';
import store from '../store/store';

const router = useRouter();
const isValid = ref(false);
const editMode = ref(false);
const certifications = ref([]);
const lastApiError = ref(null);
const snackbar = ref({ show: false, text: '', color: '' });

const user = store.getters.getLoginUserInfo;
const userId = user.user_id;

const certificationForm = ref({
  award_name: '',
  organization: '',
  userId: userId
});

const fetchCertifications = async () => {
  try {
    const response = await certificationServices.getCertification(userId);
    certifications.value = response.data;
  } catch (error) {
    lastApiError.value = error.response?.data?.message || error.message;
  }
};

onMounted(() => {
  fetchCertifications();
});

const saveCertification = async () => {
  try {
    let response;
    if (editMode.value) {
      response = await certificationServices.updateCertificationById(certificationForm.value.id, certificationForm.value);
    } else {
      response = await certificationServices.createCertification(certificationForm.value);
      certifications.value.push(response.data);
    }
    showNotification('Certification saved successfully', 'success');
    resetForm();
  } catch (error) {
    lastApiError.value = error.response?.data?.message || error.message;
    showNotification('Failed to save certification', 'error');
  }
};

const deleteCertification = async (id) => {
  try {
    await certificationServices.deleteCertificationById(id);
    certifications.value = certifications.value.filter(cert => cert.id !== id);
    showNotification('Certification deleted successfully', 'success');
  } catch (error) {
    showNotification('Failed to delete certification', 'error');
  }
};

const editCertification = (cert) => {
  certificationForm.value = { ...cert };
  editMode.value = true;
};

const resetForm = () => {
  certificationForm.value = { title: '', organization: '', userId };
  editMode.value = false;
};

const showNotification = (text, color) => {
  snackbar.value = { show: true, text, color };
};


const goBack = () => router.push('./personalInterests');
const goNext = () => router.push('/next-route');

</script>

<style scoped>
.certifications-container {
  background-color: #f5f5f5;
  padding-top: 2rem;
}
.certifications-card {
  border-radius: 8px;
}
</style>
