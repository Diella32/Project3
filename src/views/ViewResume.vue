<template>
  <v-container class="resume-view">
    <v-card class="mx-auto" max-width="1000">
      <!-- Back Button
      <v-btn icon="mdi-arrow-left" variant="text" class="mb-4" @click="router.back()"></v-btn> -->

      <v-divider class="mb-6"></v-divider>

      <div class="max-w-[8.5in] mx-auto p-8 bg-white">
      <!-- Header/Contact Information -->
      <div class="text-center mb-6">
      <h1 class="text-2xl font-bold mb-2">
        {{ selectedContacts?.fName }} {{ selectedContacts?.lName }}
      </h1>
      <div class="text-sm">
        <span>{{ selectedContacts?.address }}</span>
        <span class="mx-2">|</span>
        <span>{{ selectedContacts?.phone_number }}</span>
        <span class="mx-2">|</span>
        <span>{{selectedContacts?.email }}</span>
      </div>
      </div>


      <!-- Resume Header -->
      <div class="d-flex align-center justify-space-between flex-wrap">
        <h2 class="text-h4 font-weight-bold mb-4">{{ resumeTitle }}</h2>
        <v-chip :color="getStatusColor(status)" class="ml-4">{{ status }}</v-chip>
      </div>
      <p class="text-body-1 mb-6">{{ introduction }}</p>


    <!-- Description
    <div class="mb-4">
      <h2 class="text-lg font-bold border-b border-gray-400 mb-2">DESCRIPTION</h2>
      <p class="text-sm">{{ introduction }}</p>
    </div> -->

    <!-- Education -->
    <div class="mb-4">
      <h2 class="text-lg font-bold border-b border-gray-400 mb-2">EDUCATION</h2>
      <div v-for="(edu, index) in selectedEducations" :key="index" class="mb-2">
        <div class="flex justify-between">
          <div>
            <span class="font-bold">{{ edu.institution }}</span>
          </div>
          <span>{{ edu.start_date }} - {{ edu.end_date }}</span>
        </div>
        <div class="flex justify-between">
          <span class="italic">{{ edu.degree }}</span>
          <span v-if="edu.gpa">GPA : {{ edu.gpa }}</span>
        </div>
      </div>
    </div>

    <!-- Projects -->
    <div class="mb-4">
      <h2 class="text-lg font-bold border-b border-gray-400 mb-2">PROJECTS</h2>
      <div v-for="(project, index) in selectedProjects" :key="index" class="mb-2">
        <div class="flex justify-between">
          <span class="font-bold">{{ project.project_name }}</span>
          <span>{{ project.project_link }}</span>
        </div>
        <ul class="list-disc ml-4 text-sm">
          <li>{{ project.description }}</li>
          <li>Technologies used: {{ project.technologies_used }}</li>
        </ul>
      </div>
    </div>

    <!-- Experiences -->
    <div class="mb-4">
      <h2 class="text-lg font-bold border-b border-gray-400 mb-2">EXPERIENCE</h2>
      <div v-for="(exp, index) in selectedExperiences" :key="index" class="mb-2">
        <div class="flex justify-between">
          <span class="font-bold">{{ exp.company }}</span>
          <span>{{ exp.start_date }} - {{ exp.end_date }}</span>
        </div>
        <div class="italic mb-1">{{ exp.title }}</div>
        <ul class="list-disc ml-4 text-sm">
          <li v-for="(resp, idx) in exp.description" :key="idx">
            {{ resp }}
          </li>
        </ul>
      </div>
    </div>

           <!-- Skills -->
             <div class="mb-4">
             <h2 class="text-lg font-bold border-b border-gray-400 mb-2">SKILLS</h2>
              <div v-for="(skill, index) in selectedSkills" :key="index" class="mb-1">
                <span class="font-bold">{{ skill.skill_name }}</span>
            </div>
            </div>

            <!-- Interests -->
            <div class="mb-4">
              <h2 class="text-lg font-bold border-b border-gray-400 mb-2">INTERESTS</h2>
              <div v-for="(interest, index) in selectedInterests" :key="index" class="mb-1">
                <span class="font-bold">{{ interest.interest }}</span>
              </div>
            </div>
            

    <!-- Awards & Certifications -->
    <div class="mb-4">
      <h2 class="text-lg font-bold border-b border-gray-400 mb-2">AWARDS & CERTIFICATIONS</h2>
      <div v-for="award  in awardCertifications" :key="award.id" class="flex justify-between mb-1 text-sm">
        <span>{{ award.award_name }}</span>
        <span>{{ award.organization }}</span>
      </div>
    </div>

    <!-- Personal Links -->
    <div class="mb-4">
      <h2 class="text-lg font-bold border-b border-gray-400 mb-2">PERSONAL LINKS</h2>
      <div v-for="(links, index) in selectedLinks" :key="index" class="text-sm mb-1">
        <span>{{ links.url }}</span>
      </div>
    </div>
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
const status = ref('');
const selectedContacts = ref([]);
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
    //console.log(selectedEducations.value);

    // Set main details
    resumeTitle.value = data.title || "";
    introduction.value = data.introduction || "";
    status.value = data.status || "";

    // Set related data
    selectedContacts.value = data.contactinfo || [];
    console.log('Selected Contacts:', selectedContacts.value);
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
  
}
</style>
