<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ProjectServices from '../services/ProjectServices';
import store from '../store/store'

const user = store.getters.getLoginUserInfo
//console.log(user);

const router = useRouter();
const route = useRoute();
const projects = ref([]);
const expandedPanel = ref(null);
const isValidating = ref(false);
const projectForms = ref([]);

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
  url: v => !v || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v) || 'Please enter a valid URL',
};

// Computed property for overall validity
const isValid = computed(() => projects.value.every(project => project.valid));

// New project template
const newProjectTemplate = {
  project_name: '',
  description: '',
  technologies_used: '',
  url: '',
  userId: user.user_id,
  valid: false,
};

// Fetch all projects on component load
onMounted(async () => {
  const userId = user.user_id;
  try {
    const response = await ProjectServices.getAllProjects(userId);
    projects.value = response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    showNotification('Failed to load projects', 'error');
  }
});

// Methods
const addNewProject = () => {
  projects.value.push({ ...newProjectTemplate });
  expandedPanel.value = projects.value.length - 1;
};

const removeProject = (index) => {
  projects.value.splice(index, 1);
  showNotification('Project removed', 'info');
};

const validateProject = async (index) => {
  isValidating.value = true;
  try {
      const project = projects.value[index];
      if (!project.id) {
        // New project: Create on backend
        const response = await ProjectServices.createProject(project);
        project.id = response.data.id;
      } else {
        // Existing project: Update on backend
        await ProjectServices.updateProject(project.id, project);
      }
      showNotification('Project saved successfully', 'success');
      expandedPanel.value = null;
  } catch (error) {
    console.error('Error saving project:', error);
    showNotification('Failed to save project', 'error');
  } finally {
    isValidating.value = false;
  }
};

const showNotification = (text, color = 'success', timeout = 3000) => {
  snackbar.value = { show: true, text, color, timeout };
};
</script>

<template>
  <div class="projects-wrapper">
    <div class="projects-container">
      <v-row class="fill-height ma-0" align="start" justify="center">
        <v-col cols="12" class="pa-0">
          <v-card class="projects-card" elevation="0">
            <!-- Header -->
            <v-card-item class="text-center header-section">
              <v-icon icon="mdi-lightbulb" size="72" color="primary" class="mb-6"></v-icon>
              <v-card-title class="text-h2 font-weight-bold mb-4">Projects</v-card-title>
              <v-card-subtitle class="text-h5 mb-6">Add your personal and professional projects</v-card-subtitle>
            </v-card-item>

            <v-divider></v-divider>

            <!-- Projects List -->
            <v-card-text class="projects-content py-6">
              <v-container>
                <!-- Add New Project Button -->
                <v-row justify="center" class="mb-6">
                  <v-col cols="12" md="8">
                    <v-btn color="primary" block @click="addNewProject" size="large" prepend-icon="mdi-plus">
                      Add New Project
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- Projects List -->
                <v-row justify="center">
                  <v-col cols="12" md="8">
                    <v-expansion-panels v-model="expandedPanel">
                      <v-expansion-panel v-for="(project, index) in projects" :key="project.id || index" :disabled="isValidating">
                        <v-expansion-panel-title>
                          <span class="text-h6">{{ project.project_name || 'New Project' }}</span>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <v-form ref="projectForms" v-model="project.valid" @submit.prevent>
                            <!-- Project Title -->
                            <v-text-field v-model="project.project_name" label="Project Name" :rules="[rules.required]" variant="outlined" density="comfortable" class="mb-4"></v-text-field>

                            <!-- Project Description -->
                            <v-textarea v-model="project.description" label="Project Description" variant="outlined" density="comfortable" auto-grow class="mb-4"></v-textarea>

                            <!-- Technologies Used -->
                            <v-text-field v-model="project.technologies_used" label="Technologies Used" placeholder="Enter technologies separated by commas" variant="outlined" density="comfortable" class="mb-4"></v-text-field>

                            <!-- GitHub Link -->
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-text-field v-model="project.githubLink" label="GitHub Link" :rules="[rules.url]" variant="outlined" density="comfortable" prepend-inner-icon="mdi-github"></v-text-field>
                              </v-col>
                            </v-row>

                            <!-- Action Buttons -->
                            <v-row class="mt-4">
                              <v-col cols="6">
                                <v-btn color="error" variant="outlined" block @click="removeProject(index)" :disabled="isValidating">
                                  Delete Project
                                </v-btn>
                              </v-col>
                              <v-col cols="6">
                                <v-btn color="success" block @click="validateProject(index)" :loading="isValidating">
                                  Save Project
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
.projects-wrapper {
  min-height: 100vh;
  width: 100vw;
  background-color: rgb(var(--v-theme-background));
  display: flex;
  flex-direction: column;
}

.projects-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.projects-card {
  min-height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.header-section {
  padding-top: 4rem;
  padding-bottom: 2rem;
}

.projects-content {
  flex: 1;
}

.text-center {
  text-align: center;
}

.d-flex {
  display: flex;
}

.justify-space-between {
  justify-content: space-between;
}
</style>