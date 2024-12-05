<template>
  <v-container class="resume-view">
    <v-card class="mx-auto" max-width="900">
      <!-- Back Button
      <v-btn icon="mdi-arrow-left" variant="text" class="mb-4" @click="router.back()"></v-btn> -->

      <!-- Resume Header -->
      <div class="d-flex align-center justify-space-between flex-wrap">
        <h2 class="text-h4 font-weight-bold mb-4">{{ resumeTitle }}</h2>
        <v-chip :color="getStatusColor(status)" class="ml-4">{{ status }}</v-chip>
      </div>
      <p class="text-body-1 mb-6">{{ introduction }}</p>

      <v-divider class="mb-6"></v-divider>

      <!-- Contact Information -->
      <section class="mb-6">
        <h3 class="text-h5 font-weight-bold mb-4">Contact Information</h3>
        <div v-for="contact in selectedContact" :key="contact.contact_id">
          <v-card variant="outlined" class="pa-4 mb-4">
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" class="mr-2">mdi-account</v-icon>
              <span>{{ contact?.fName }} {{ contact?.lName }}</span>
            </div>
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" class="mr-2">mdi-email</v-icon>
              <span>{{ contact?.email }}</span>
            </div>
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" class="mr-2">mdi-phone</v-icon>
              <span>{{ contact?.phone_number }}</span>
            </div>
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
              <span>{{ contact?.address }}</span>
            </div>
          </v-card>
        </div>
      </section>

      <!-- Education -->
      <section class="mb-6">
        <h3 class="text-h5 font-weight-bold mb-4">Education</h3>
        <v-card v-for="edu in selectedEducations" :key="edu.education_id" variant="outlined" class="mb-3 pa-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <h4 class="text-h6 font-weight-bold">{{ edu.institution }}</h4>
            <span class="text-caption">{{ edu.startDate }} - {{ edu.endDate }}</span>
          </div>
          <div class="font-weight-medium">{{ edu.degree }} in {{ edu.FieldOfStudy }}</div>
          <div v-if="edu.gpa" class="text-caption mt-2">GPA: {{ edu.gpa }}</div>
        </v-card>
      </section>

      <!-- Projects -->
      <section class="mb-6">
        <h3 class="text-h5 font-weight-bold mb-4">Projects</h3>
        <v-card v-for="project in selectedProjects" :key="project.project_id" variant="outlined" class="mb-3 pa-4">
          <h4 class="text-h6 font-weight-bold mb-2">{{ project.project_name }}</h4>
          <p class="mb-3">{{ project.description }}</p>
          <v-chip-group>
            <v-chip v-for="tech in project.technologies_used.split(',')" :key="tech" size="small" color="primary" variant="outlined">
              {{ tech.trim() }}
            </v-chip>
          </v-chip-group>
          <v-btn v-if="project.project_link" :href="project.project_link" target="_blank" variant="text" color="primary" class="mt-2" prepend-icon="mdi-link">
            View Project
          </v-btn>
        </v-card>
      </section>

      <!-- Skills -->
      <section class="mb-6">
        <h3 class="text-h5 font-weight-bold mb-4">Skills</h3>
        <v-chip v-for="skill in selectedSkills" :key="skill.skill_id" size="small" color="primary" variant="outlined" class="mr-2">
          {{ skill.skill_name }}
        </v-chip>
      </section>

      <!-- Experiences -->
      <section class="mb-6">
        <h3 class="text-h5 font-weight-bold mb-4">Experiences</h3>
        <v-card v-for="experience in selectedExperiences" :key="experience.experience_id" variant="outlined" class="mb-3 pa-4">
          <h4 class="text-h6 font-weight-bold">{{ experience.title }}</h4>
          <p>{{ experience.description }}</p>
          <div class="text-caption">{{ experience.startDate }} - {{ experience.endDate }}</div>
        </v-card>
      </section>

      <!-- Interests -->
      <section class="mb-6">
        <h3 class="text-h5 font-weight-bold mb-4">Interests</h3>
        <v-chip v-for="interest in selectedInterests" :key="interest.interest_id" size="small" color="primary" variant="outlined" class="mr-2">
          {{ interest.name }}
        </v-chip>
      </section>

      <!-- Awards -->
      <section class="mb-6">
        <h3 class="text-h5 font-weight-bold mb-4">Awards & Certifications</h3>
        <v-card v-for="award in awardCertifications" :key="award.award_id" variant="outlined" class="mb-3 pa-4">
          <h4 class="text-h6 font-weight-bold">{{ award.title }}</h4>
          <p class="text-caption">{{ award.year }}</p>
        </v-card>
      </section>

      <!-- Personal Links -->
      <section class="mb-6">
        <h3 class="text-h5 font-weight-bold mb-4">Personal Links</h3>
        <v-card variant="outlined" class="pa-4">
          <v-list>
            <v-list-item v-for="link in selectedLinks" :key="link.personal_link_id" :href="link.url" target="_blank" prepend-icon="mdi-link">
              <v-list-item-title>{{ link.url }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </section>
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
const status = ref('');
const selectedContact = ref([]);
const selectedEducations = ref([]);
const selectedProjects = ref([]);
const selectedLinks = ref([]);
const selectedSkills = ref([]);
const selectedExperiences = ref([]);
const selectedInterests = ref([]);
const awardCertifications = ref([]);

// Function to get the status color
const getStatusColor = (status) => {
  const statusColors = {
    Draft: 'grey',
    'In Progress': 'orange',
    Complete: 'green',
    Published: 'blue',
  };
  return statusColors[status] || 'grey';
};

// Function to fetch resume details
const fetchResumeDetails = async () => {
  try {
    const route = useRoute();
    const resumeId = route.params.id || window.location.pathname.split('/').pop();

    if (!userId || !resumeId) {
      console.error("User ID or Resume ID is undefined");
      return;
    }

    // Fetch resume details
    const response = await ResumeServices.getResume(userId, resumeId);
    const data = response.data;
    console.log(data);

    // Set main details
    resumeTitle.value = data.title || "";
    introduction.value = data.introduction || "";
    status.value = data.status || "";

    // Set related data
    selectedContact.value = data.ContactInfo || [];
    selectedEducations.value = data.education || [];
    selectedProjects.value = data.projects || [];
    selectedSkills.value = data.skills || [];
    selectedLinks.value = data.personalLinks || [];
    selectedExperiences.value = data.experiences || [];
    selectedInterests.value = data.interests || [];
    awardCertifications.value = data.awards || [];
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
}
</style>
