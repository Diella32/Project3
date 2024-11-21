<script setup>
import { ref, onMounted, computed } from "vue";
import EducationServices from '../services/ EducationServices'
import store from '../store/store';
import { useRouter } from "vue-router"; 
const router = useRouter(); // Get router instance


const user = store.getters.getLoginUserInfo;
const educations = ref([]);
const expandedPanel = ref(null);
const isValidating = ref(false);
const educationForms = ref([]);
const userId = store.getters.getLoginUserInfo.user_id;

// Snackbar state
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

// Validation rules
const rules = {
  required: (value) => !!value || "This field is required",
};

// Computed property for overall validity
const isValid = computed(() => educations.value.every(education => education.valid));

// New education template
const newEducationTemplate = {
  degree: "",
  FieldOfStudy: "",
  institution: "",
  startDate: "",
  endDate: "",
  gpa: null,
  userId: user.user_id,
};

// Fetch all educations
const fetchEducations = async () => {
  try {
    const response = await EducationServices.getAllEducations(user.user_id);
    educations.value = response.data;
  } catch (error) {
    console.error("Error fetching educations:", error);
    showNotification("Failed to load educations", "error");
  }
};

onMounted(() => {
  fetchEducations();
});

// Methods
const addNewEducation = () => {
  educations.value.push({ ...newEducationTemplate });
  expandedPanel.value = educations.value.length - 1;
};

const deleteEducation = async (id) => {
  if (isValidating.value) return; // Prevent multiple deletions
  isValidating.value = true; // Start validation

  try {
    await EducationServices.deleteEducation(userId, id); // Call API to delete
    educations.value = educations.value.filter(education => education.id !== id); // Optimistic UI update
    showNotification("Education deleted successfully", "success"); // Notify user
  } catch (error) {
    console.error("Error deleting education:", error); // Log error
    showNotification("Failed to delete education", "error"); // Notify user of failure
  } finally {
    isValidating.value = false; // End validation
  }
};

const saveEducation = async (index) => {
  isValidating.value = true;
  try {
    const education = educations.value[index];

    if (!education.education_id) {
      // New education: Create on backend
      const response = await EducationServices.createEducation(education);
      education.id = response.data.id;
    } else {
      // Existing education: Update on backend
      await EducationServices.updateEducation(education.education_id, education);
    }
    showNotification("Education saved successfully", "success");
    expandedPanel.value = null;
  } catch (error) {
    console.error("Error saving education:", error);
    showNotification("Failed to save education", "error");
  } finally {
    isValidating.value = false;
  }
};

const showNotification = (text, color = "success", timeout = 3000) => {
  snackbar.value = { show: true, text, color, timeout };
};
</script>

<template>
  <div class="education-wrapper">
    <div class="education-container">
      <v-row class="fill-height ma-0" align="start" justify="center">
        <v-col cols="12" class="pa-0">
          <v-card class="education-card" elevation="0">
            <!-- Header -->
            <v-card-item class="text-center header-section">
              <v-icon icon="mdi-school" size="72" color="primary" class="mb-6"></v-icon>
              <v-card-title class="text-h2 font-weight-bold mb-4">Add Education</v-card-title>
              <v-card-subtitle class="text-h5 mb-6">Manage your education details</v-card-subtitle>
            </v-card-item>

            <v-divider></v-divider>

            <!-- Education List -->
            <v-card-text class="education-content py-6">
              <v-container>
                <!-- Add New Education Button -->
                <v-row justify="center" class="mb-6">
                  <v-col cols="12" md="8">
                    <v-btn color="primary" block @click="addNewEducation" size="large" prepend-icon="mdi-plus">
                      Add New Education
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- Education List -->
                <v-row justify="center">
                  <v-col cols="12" md="8">
                    <v-expansion-panels v-model="expandedPanel">
                      <v-expansion-panel v-for="(education, index) in educations" :key="education.id || index" :disabled="isValidating">
                        <v-expansion-panel-title>
                          <span class="text-h6">{{ education.degree || 'New Education' }}</span>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <v-form ref="educationForms" v-model="education.valid" @submit.prevent>
                            <!-- Degree -->
                            <v-text-field
                              v-model="education.degree"
                              label="Degree"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="comfortable"
                              class="mb-4"
                            ></v-text-field>

                            <!-- Field of Study -->
                            <v-text-field
                              v-model="education.FieldOfStudy"
                              label="Field of Study"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="comfortable"
                              class="mb-4"
                            ></v-text-field>

                            <!-- Institution -->
                            <v-text-field
                              v-model="education.institution"
                              label="Institution"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="comfortable"
                              class="mb-4"
                            ></v-text-field>

                            <!-- Start Date -->
                            <v-text-field
                              v-model="education.startDate"
                              label="Start Date"
                              type="date"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="comfortable"
                              class="mb-4"
                            ></v-text-field>

                            <!-- End Date -->
                            <v-text-field
                              v-model="education.endDate"
                              label="End Date"
                              type="date"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="comfortable"
                              class="mb-4"
                            ></v-text-field>

                            <!-- GPA -->
                            <v-text-field
                              v-model="education.gpa"
                              label="GPA"
                              type="number"
                              :rules="[rules.required]"
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
                                  @click="deleteEducation(education.id)"
                                  :disabled="isValidating"
                                >
                                  Delete Education
                                </v-btn>
                              </v-col>
                              <v-col cols="6">
                                <v-btn 
                                  color="success" 
                                  block 
                                  @click="saveEducation(index)"
                                  :loading="isValidating"
                                >
                                  Save Education
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
      <v-btn color="primary" @click="router.push({ name: 'AddContact' })">
        <v-icon left>mdi-arrow-left</v-icon>
        Previous
      </v-btn>
      <v-btn color="primary" @click="router.push({ name: 'PersonalLinks' })">
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

<style scoped>
.education-wrapper {
  min-height: 100vh;
  width: 100vw;
  background-color: rgb(var(--v-theme-background));
  display: flex;
  flex-direction: column;
}

.education-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.education-card {
  min-height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.header-section {
  padding-top: 4rem;
  padding-bottom: 2rem;
}

.education-content {
  flex: 1;
}

.text-center {
  text-align: center;
}
</style>


