<template>
  <div class="resume-wrapper">
    <!-- Header -->
    <v-app-bar color="primary" dark>
      <v-toolbar-title>Edit Resume</v-toolbar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-container fluid class="main-content">
      <v-row>
        <!-- Left Column: Resume Inputs -->
        <v-col cols="12" md="6" class="resume-input">
          <v-card class="resume-card" elevation="0">
            <v-card-item class="text-center header-section">
              <v-icon icon="mdi-file-document-edit" size="72" color="primary" class="mb-6"></v-icon>
              <v-card-title class="text-h2 font-weight-bold mb-4">Resume Inputs</v-card-title>
              <v-divider></v-divider>
            </v-card-item>
            <v-card-text>
              <!-- Title and Introduction Inputs -->
              <v-text-field
                v-model="resumeTitle"
                label="Resume Title"
                class="mb-4"
                required
              ></v-text-field>
              <v-textarea
                v-model="introduction"
                label="Introduction"
                class="mb-6"
                required
              ></v-textarea>
              <v-select
                v-model="selectedTemplate"
                :items="['Template 1', 'Template 2', 'Template 3', 'Template 4']"
                label="Select a Template"
                class="mb-6"
              ></v-select>

              <!-- Contact Information -->
              <v-select
                v-model="selectedContacts"
                :items="contacts"
                item-title="fName"
                item-value="id"
                label="Select Contact Information"
                class="mb-6"
                return-object
              ></v-select>

              <!--Education-->
              <v-select
                v-model="selectedEducations"
                :items="educations"
                item-title="degree"
                multiple
                chips
                label="Select Education Entries"
                class="mb-6"
                return-object
              ></v-select>
              <!--Projects-->
              <v-select
                v-model="selectedProjects"
                :items="projects"
                item-title="project_name"
                multiple
                chips
                label="Select Projects"
                class="mb-6"
                return-object
              ></v-select>
              <!--Personal Links-->
              <v-select
                v-model="selectedLinks"
                :items="links"
                item-title="url"
                multiple
                chips
                label="Select Personal Links"
                class="mb-6"
                return-object
              ></v-select>

              <!--Experiences-->
              <v-select
                v-model="selectedExperiences"
                :items="experiences"
                item-title="job_title"
                multiple
                chips
                label="Select Experiences"
                class="mb-6"
                return-object
              ></v-select>

              <!--Interests-->
              <v-select
                v-model="selectedInterests"
                :items="interests"
                item-title="interest"
                multiple
                chips
                label="Select Interests"
                class="mb-6"
                return-object
              ></v-select>

              
              <!-- Skills -->
              <v-select
                v-model="selectedSkills"
                :items="skills"
                item-title="skill_name"
                multiple
                chips
                label="Select Skills"
                class="mb-6"
                return-object
              ></v-select>

              <!-- Awards and Certifications -->
              <v-select
                v-model="selectedAwards"
                :items="awards"
                item-title="award_name"
                multiple
                chips
                label="Select Awards and Certifications"
                class="mb-6"
                return-object
              ></v-select>

              <!-- Save and Cancel Buttons -->
              <v-btn
                color="success"
                block
                @click="saveResume"
                :loading="isSaving"
                size="large"
                prepend-icon="mdi-content-save"
                class="mb-4"
              >
                Save Changes
              </v-btn>
              <v-btn
                color="error"
                block
                @click="cancelEdit"
                size="large"
                prepend-icon="mdi-cancel"
              >
                Cancel
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column: Resume Preview -->
        <v-col cols="12" md="6" class="resume-preview">
          <v-card class="resume-card" elevation="0">
            <v-card-item class="text-center header-section">
              <v-icon icon="mdi-eye" size="72" color="primary" class="mb-6"></v-icon>
              <v-card-title class="text-h2 font-weight-bold mb-4">Resume Preview</v-card-title>
              <v-divider></v-divider>
            </v-card-item>
            <v-card-text class="py-6">
              <div class="max-w-[8.5in] mx-auto p-8 bg-white">
                <!-- Header/Contact Information -->
                <div class="text-center mb-6" v-if="selectedContacts">
                  <h1 class="text-2xl font-bold mb-2">
                    {{ selectedContacts?.fName }} {{ selectedContacts?.lName }}
                  </h1>
                  <div class="text-sm">
                    <span>{{ selectedContacts?.address }}</span>
                    <span class="mx-2">|</span>
                    <span>{{ selectedContacts?.phone_number }}</span>
                    <span class="mx-2">|</span>
                    <span>{{ selectedContacts?.email }}</span>
                  </div>
                </div>

                <!-- Description -->
                <div class="mb-4" v-if="introduction">
                  <h2 class="text-lg font-bold border-b border-gray-400 mb-2">DESCRIPTION</h2>
                  <p class="text-sm">{{ introduction }}</p>
                </div>

                <!-- Education -->
                <div class="mb-4" v-if="selectedEducations?.length">
                  <h2 class="text-lg font-bold border-b border-gray-400 mb-2">EDUCATION</h2>
                  <div v-for="(edu, index) in selectedEducations" :key="index" class="mb-2">
                    <div class="flex justify-between">
                      <span class="font-bold">{{ edu.institution }}</span>
                      <span>{{ edu.start_date }} - {{ edu.end_date }}</span>
                    </div>
                    <div class="italic">{{ edu.degree }}</div>
                    <div v-if="edu.gpa">GPA : {{ edu.gpa }}</div>
                  </div>
                </div>

                <!-- Projects -->
                <div class="mb-4" v-if="selectedProjects?.length">
                  <h2 class="text-lg font-bold border-b border-gray-400 mb-2">PROJECTS</h2>
                  <div v-for="(project, index) in selectedProjects" :key="index" class="mb-2">
                    <span class="font-bold">{{ project.project_name }}</span>
                    <div>{{ project.description }}</div>
                    <div v-if="project.project_link">Link: {{ project.project_link }}</div>
                    <div v-if="project.technologies_used">
                      Technologies: {{ project.technologies_used }}
                    </div>
                  </div>
                </div>

                <!-- Skills -->
                <div class="mb-4" v-if="selectedSkills?.length">
                  <h2 class="text-lg font-bold border-b border-gray-400 mb-2">SKILLS</h2>
                  <div v-for="(skill, index) in selectedSkills" :key="index" class="mb-1">
                    <p class="text-sm">{{ skill.skill_name }}</p>
                    <p class="test-sm">{{ skill.category }}</p>
                  </div>
                </div>

                <!-- Awards -->
                <div class="mb-4" v-if="selectedAwards?.length">
                  <h2 class="text-lg font-bold border-b border-gray-400 mb-2">AWARDS</h2>
                  <div v-for="(award, index) in selectedAwards" :key="index" class="mb-1">
                    <span class="font-bold">{{ award.award_name }}</span>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ResumeServices from '../services/ResumeServices';
import store from '../store/store';

const user = store.getters.getLoginUserInfo;
const userId = user.user_id;

const router = useRouter();
const route = useRoute();
const resumeContent = ref(route.query.fileContent || '');


// Reactive variables for resume details and items
const resumeTitle = ref('');
const introduction = ref('');
const selectedContacts = ref([]);
const selectedEducations = ref([]);
const selectedProjects = ref([]);
const selectedLinks = ref([]);
const selectedSkills = ref([]);
const selectedExperiences = ref([]);
const selectedInterests = ref([]);
const awardCertifications = ref([]);

// To track which item is selected for editing
const selectedContact = ref(null);
const selectedEducation = ref(null);
const selectedProject = ref(null);
const selectedLink = ref(null);
const selectedExperience = ref(null);
const selectedSkill = ref(null);
const selectedInterest = ref(null);
const selectedAward = ref(null);

// Fetching the resume details
const fetchResume = async () => {
  try {
    const resumeId = route.params.id || window.location.pathname.split('/').pop();
    if (!resumeId) {
      console.error("Resume ID is undefined");
      return;
    }

    // Fetch resume details
    const response = await ResumeServices.getResume(userId, resumeId);
    const data = response.data;

    // Set main details
    resumeTitle.value = data.title || '';
    introduction.value = data.introduction || '';
    
    // Set related data (contacts, education, etc.)
    selectedContacts.value = data.contactinfo || [];
    selectedEducations.value = data.education || [];
    selectedProjects.value = data.projects || [];
    selectedSkills.value = data.skills || [];
    selectedLinks.value = data.personallinks || [];
    selectedExperiences.value = data.experiences || [];
    selectedInterests.value = data.interests || [];
    awardCertifications.value = data.awards || [];

  } catch (error) {
    console.error("Error fetching resume details:", error);
  }
};

// Handle item selection for editing (e.g., select a contact to edit)
const selectItemForEdit = (type, item) => {
  switch (type) {
    case 'contact':
      selectedContact.value = item;
      break;
    case 'education':
      selectedEducation.value = item;
      break;
    case 'project':
      selectedProject.value = item;
      break;
    case 'link':
      selectedLink.value = item;
      break;
    case 'experience':
      selectedExperience.value = item;
      break;
    case 'skill':
      selectedSkill.value = item;
      break;
    case 'interest':
      selectedInterest.value = item;
      break;
    case 'award':
      selectedAward.value = item;
      break;
    default:
      console.error("Unknown item type");
  }
};

// Save the resume after editing
const saveResume = async () => {
  try {
    // Check if any required field is missing
    if (!resumeTitle.value || !selectedContacts.value.length) {
      console.error("Please complete all required fields.");
      return;
    }

    // Prepare the data to send for saving
    const resumeData = {
      title: resumeTitle.value,
      introduction: introduction.value,
      contactinfo: selectedContacts.value,
      education: selectedEducations.value,
      projects: selectedProjects.value,
      skills: selectedSkills.value,
      personalLinks: selectedLinks.value,
      experiences: selectedExperiences.value,
      interests: selectedInterests.value,
      awards: awardCertifications.value,
    };

    // Send the updated resume data to the backend
    const response = await ResumeServices.update(route.params.id, resumeData);
    console.log("Resume updated successfully", response);
    router.push({ name: "resumes" });
  } catch (error) {
    console.error("Error saving resume", error);
  }
};

// Cancel the edit and return to the resume list
const cancelEdit = () => {
  router.push({ name: "resumes" });
};

// Fetch resume details when the page is mounted
onMounted(() => {
  fetchResume();
});
</script>


<style scoped>
.resume-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 70px;
  display: flex;
}

.resume-input,
.resume-preview {
  padding: 16px;
}

.resume-card {
  height: 100%;
}

.header-section {
  padding-top: 0;
  padding-bottom: 2rem;
}
</style>
