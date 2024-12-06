<template>
  <v-container class="resume-view">
    <v-card class="mx-auto" max-width="1000">
      <!-- Resume Header -->
      <v-divider class="mb-6"></v-divider>

      <div class="max-w-[8.5in] mx-auto p-8 bg-white">
        <!-- Right Column: Resume Preview -->
        <v-row>
          <v-col cols="12" md="6" class="resume-preview">
            <v-card class="resume-card" elevation="0">
              <v-card-item class="text-center header-section">
                <v-icon icon="mdi-eye" size="72" color="primary" class="mb-6"></v-icon>
                <v-card-title class="text-h2 font-weight-bold mb-4">Resume Preview</v-card-title>
                <div class="d-flex align-center justify-space-between flex-wrap">
                  <h2 class="text-h4 font-weight-bold mb-4">{{ resumeTitle }}</h2>
                </div>
                <v-divider></v-divider>
              </v-card-item>

              <!-- Contact Info Section (Under Resume Preview) -->
              <v-card-text class="py-6">
                <div class="text-center mb-6">
                  <h1 class="text-2xl font-bold mb-2">
                    {{ selectedContacts[0]?.fName }} {{ selectedContacts[0]?.lName }}
                  </h1>
                  <div class="text-sm">
                    <span>{{ selectedContacts[0]?.address }}</span>
                    <span class="mx-2">|</span>
                    <span>{{ selectedContacts[0]?.phone_number }}</span>
                    <span class="mx-2">|</span>
                    <span>{{ selectedContacts[0]?.email }}</span>
                  </div>
                </div>
              </v-card-text>

              <v-divider></v-divider>

              <!-- Resume Details Sections -->
              <v-card-text class="py-6">
                <div class="max-w-[8.5in] mx-auto p-8 bg-white">
                  <!-- Description -->
                  <div class="mb-4">
                    <h2 class="text-lg font-bold border-b border-gray-400 mb-2">DESCRIPTION</h2>
                    <p class="text-sm">{{ introduction }}</p>
                  </div>

                  <!-- Education -->
                  <div v-if="selectedProjects?.length" class="mb-4">
                    <h2 class="text-lg font-bold border-b border-gray-400 mb-2">EDUCATION</h2>
                    <div v-for="(edu, index) in selectedEducations" :key="index" class="mb-2">
                      <div class="flex justify-between">
                        <span class="font-bold">{{ edu.institution }}</span>
                        <span>{{ edu.start_date }} - {{ edu.end_date }}</span>
                      </div>
                      <div class="italic">{{ edu.degree }}</div>
                      <div v-if="edu.gpa">GPA: {{ edu.gpa }}</div>
                    </div>
                  </div>

                  <!-- Personal Links -->
                  <div v-if="selectedProjects?.length" class="mb-4">
                    <h2 class="text-lg font-bold border-b border-gray-400 mb-2">PERSONAL LINKS</h2>
                    <div v-for="(link, index) in selectedLinks" :key="index" class="mb-1">
                      <span class="font-bold">{{ link.url }}</span>
                    </div>
                  </div>

                  <!-- Projects -->
                  <div v-if="selectedProjects?.length" class="mb-4">
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
                  <div v-if="selectedSkills?.length" class="mb-4">
                    <h2 class="text-lg font-bold border-b border-gray-400 mb-2">SKILLS</h2>
                    <div v-for="(skill, index) in selectedSkills" :key="index" class="mb-1">
                      <span class="font-bold">{{ skill.skill_name }}</span>
                    </div>
                  </div>

                  <!-- Experiences -->

                  <div v-if="selectedExperiences?.length" class="mb-4">
                    <h2 class="text-lg font-bold border-b border-gray-400 mb-2">EXPERIENCES</h2>
                    <div v-for="(experience, index) in selectedExperiences" :key="index" class="mb-1">
                      <span class="font-bold">{{ experience.job_title }}</span>
                      <div>{{ experience.company }}</div>
                      <div class="flex justify-end">
                        <span>{{ experience.start_date }} - {{ experience.end_date }}</span>
                      </div>
                      <div>{{ experience.description }}</div>
                    </div>
                  </div>

                  <!-- Interests -->
                  <div v-if="selectedInterests?.length" class="mb-4">
                    <h2 class="text-lg font-bold border-b border-gray-400 mb-2">INTERESTS</h2>
                    <div v-for="(interest, index) in selectedInterests" :key="index" class="mb-1">
                      <span class="font-bold">{{ interest.interest }}</span>
                    </div>
                  </div>

                  <!-- Awards -->
                  <div v-if="selectedAwards?.length" class="mb-4">
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
      </div>
    </v-card>
  </v-container>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ResumeServices from '../services/ResumeServices';
import store from '../store/store';

const user = store.getters.getLoginUserInfo;
const userId = user.user_id;

// Reactive variables for resume details
const resumeTitle = ref('');
const introduction = ref('');
const selectedContacts = ref([]);
const selectedEducations = ref([]);
const selectedProjects = ref([]);
const selectedLinks = ref([]);
const selectedSkills = ref([]);
const selectedExperiences = ref([]);
const selectedInterests = ref([]);
const selectedAwards = ref([]);
const awardCertifications = ref([]);

// Fetch resume details
const fetchResumeDetails = async () => {
  try {
    const route = useRoute();
    const resumeId = route.params.id || window.location.pathname.split('/').pop();
    
    if (!userId || !resumeId) {
      console.error("User ID or Resume ID is undefined");
      return;
    }

    // Fetch resume details
    const response = await ResumeServices.getResume(resumeId);
    const data = response.data;

    // Set main details
    resumeTitle.value = data.title || '';
    introduction.value = data.introduction || '';
    
    // Set related data
    selectedContacts.value = data.contactinfo || [];
    selectedEducations.value = data.education || [];
    selectedProjects.value = data.projects || [];
    selectedSkills.value = data.skills || [];
    selectedLinks.value = data.personallinks || [];
    selectedExperiences.value = data.experiences || [];
    selectedInterests.value = data.interests || [];
    selectedAwards.value = data.awards || [];

  } catch (error) {
    console.error("Error fetching resume details:", error);
  }
};

onMounted(fetchResumeDetails);
</script>

<style scoped>
.resume-view {
  padding-top: 2rem;
  padding-bottom: 2rem;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.resume-card {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.header-section {
  background-color: #f3f4f6;
  padding: 20px;
}

.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-sm {
  font-size: 0.875rem;
}

.font-bold {
  font-weight: 600;
}

.italic {
  font-style: italic;
}
</style>
