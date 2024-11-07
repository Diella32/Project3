<template>
    <div class="certifications-container">
      <v-row class="fill-height ma-0" align="start" justify="center">
        <v-col cols="12" sm="10" md="8" lg="6" class="pa-4">
          <v-card class="certifications-card" elevation="2">
            <!-- Header Section -->
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
  
            <!-- Certifications Form -->
            <v-card-text class="py-6">
              <v-form v-model="isValid" @submit.prevent="saveCertification">
                <v-container>
                  <!-- Certifications List -->
                  <v-row v-if="certifications.length > 0">
                    <v-col cols="12">
                      <div v-for="cert in certifications" :key="cert.id" class="mb-6">
                        <v-card variant="outlined" class="mb-2">
                          <v-card-item>
                            <div class="d-flex justify-space-between align-center">
                              <div>
                                <v-card-title>{{ cert.title }}</v-card-title>
                                <v-card-subtitle>
                                  {{ cert.organization }} • {{ formatDate(cert.date) }}
                                </v-card-subtitle>
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
                      </div>
                    </v-col>
                  </v-row>
  
                  <!-- Add/Edit Form -->
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="certification.title"
                        label="Certification Name"
                        :rules="[v => !!v || 'Certification name is required']"
                        variant="outlined"
                        density="comfortable"
                        class="mb-4"
                      ></v-text-field>
                    </v-col>
  
                    <v-col cols="12">
                      <v-text-field
                        v-model="certification.organization"
                        label="Issuing Organization"
                        :rules="[v => !!v || 'Issuing organization is required']"
                        variant="outlined"
                        density="comfortable"
                        class="mb-4"
                      ></v-text-field>
                    </v-col>
  
                    <v-col cols="12">
                      <v-text-field
                        v-model="certification.date"
                        label="Date Earned"
                        type="month"
                        :rules="[v => !!v || 'Date is required']"
                        variant="outlined"
                        density="comfortable"
                        class="mb-4"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
  
                <!-- Action Buttons -->
                <v-card-actions class="px-4 pb-4">
                  <v-spacer></v-spacer>
                  <v-btn variant="outlined" color="primary" class="mr-4" @click="resetForm">
                    Clear
                  </v-btn>
                  <v-btn color="primary" :disabled="!isValid" @click="saveCertification">
                    {{ editMode ? 'Update Certification' : 'Add Certification' }}
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
  
            <!-- Navigation Buttons -->
            <v-divider></v-divider>
            <v-card-actions class="pa-4">
              <v-btn variant="outlined" @click="navigateTo('enterSkills')" prepend-icon="mdi-arrow-left">
                Previous: Skills
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="navigateTo('enterInterests')" append-icon="mdi-arrow-right">
                Next: Interests
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const isValid = ref(false);
  const editMode = ref(false);
  const certifications = ref([]);
  
  // Assuming resumeId is stored in localStorage or Vuex
  const resumeId = localStorage.getItem('currentResumeId');
  
  const certification = ref({
    title: '',
    organization: '',
    date: '',
    resumeId: resumeId
  });
  
  // API Integration
  const API_URL = 'http://your-api-url/api'; // Replace with your actual API URL
  
  // Fetch certifications on component mount
  onMounted(async () => {
    try {
      const response = await axios.get(`${API_URL}/award-certifications/resume/${resumeId}`);
      certifications.value = response.data;
    } catch (error) {
      console.error('Error fetching certifications:', error);
      // Add error handling/notification here
    }
  });
  
  const saveCertification = async () => {
    try {
      if (editMode.value) {
        await axios.put(`${API_URL}/award-certifications/${certification.value.id}`, certification.value);
      } else {
        await axios.post(`${API_URL}/award-certifications`, certification.value);
      }
      
      // Refresh the list
      const response = await axios.get(`${API_URL}/award-certifications/resume/${resumeId}`);
      certifications.value = response.data;
      
      resetForm();
    } catch (error) {
      console.error('Error saving certification:', error);
      // Add error handling/notification here
    }
  };
  
  const editCertification = (cert) => {
    editMode.value = true;
    certification.value = { ...cert };
  };
  
  const deleteCertification = async (id) => {
    try {
      await axios.delete(`${API_URL}/award-certifications/${id}`);
      certifications.value = certifications.value.filter(cert => cert.id !== id);
    } catch (error) {
      console.error('Error deleting certification:', error);
      // Add error handling/notification here
    }
  };
  
  const resetForm = () => {
    certification.value = {
      title: '',
      organization: '',
      date: '',
      resumeId: resumeId
    };
    editMode.value = false;
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };
  
  const navigateTo = (route) => {
    router.push({ name: route });
  };
  </script>
  
  <style scoped>
  .certifications-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    overflow-y: auto;
  }
  
  .certifications-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
  }
  
  .v-btn {
    text-transform: none;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  @media (max-width: 600px) {
    .certifications-container {
      padding: 1rem;
    }
    
    .text-h3 {
      font-size: 1.50rem !important;
    }
    
    .text-h6 {
      font-size: 0.5rem !important;
    }
  }
  </style>