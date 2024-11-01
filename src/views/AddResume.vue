<template>
  <div class="create-resume">
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Create Resume</v-toolbar-title>
      </v-toolbar>

      <div class="resume-layout">
        <!-- Template Selection Section -->
        <div class="template-selection">
          <h5>Select a Template</h5>
          <div class="templates">
            <img
              v-for="template in templates"
              :key="template.id"
              :src="template.image"
              :alt="template.name"
              @click="selectTemplate(template.id)"
              class="template-image"
            />
          </div>
        </div>

        <!-- Resume Details Section -->
        <v-form ref="form" v-model="valid" lazy validation class="resume-details">
          <br />
          <h4>{{ message }}</h4>
          <br />
          <v-text-field
            v-model="resume.resume_name"
            id="resume_name"
            :counter="50"
            label="Resume Name"
            required
          ></v-text-field>

          <v-textarea
            v-model="resume.introduction"
            id="introduction"
            label="Introduction"
            rows="3"
          ></v-textarea>

          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="saveResume"
          >
            Save
          </v-btn>

          <v-btn color="error" class="mr-4" @click="cancel">Cancel</v-btn>
        </v-form>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ResumeService from '../services/ResumeServices.js'; // Ensure this service exists
import Utils from '../config/utils.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const valid = ref(false);
const user = Utils.getStore('user'); // Get the user data from local storage
const resume = ref({
  id: null,
  resume_name: '',
  introduction: '',
  template: null, // Initially null until a template is selected
  user_id: user.userId, // Assuming the user object has userId
});
const message = ref('Enter resume details and click save');

// Define available templates
const templates = ref([
  { id: 1, name: 'Template 1', image: 'template1.png' },
  { id: 2, name: 'Template 2', image: 'template2.png' },
  { id: 3, name: 'Template 3', image: 'template3.png' },
  { id: 4, name: 'Template 4', image: 'template4.png' },
]);

// Function to select a template
const selectTemplate = (id) => {
  resume.value.template = id;
};

// Function to save the resume
const saveResume = () => {
  const data = {
    resume_name: resume.value.resume_name,
    introduction: resume.value.introduction,
    template: resume.value.template,
    user_id: user.userId,
  };

  ResumeService.create(data)
    .then((response) => {
      console.log('API Response:', response);
      if (response && response.data) {
        resume.value.id = response.data.id;
        router.push({ name: 'add-personal-links', params: { resumeId: resume.value.id } });
      } else {
        console.error('Unexpected response structure:', response);
        message.value = 'Failed to create resume. Please try again.';
      }
    })
    .catch((e) => {
      console.error('Error occurred while creating resume:', e);
      message.value = e.response?.data?.message || 'An error occurred while creating the resume.';
    });
};

// Function to handle cancel action
const cancel = () => {
  router.push({ name: 'ResumeList' }); // Adjust the route as necessary
};

// onMounted hook for any initialization
onMounted(() => {
  // Load user data if needed
});
</script>

<style scoped>
.create-resume {
  display: flex;
  justify-content: space-between;
}

.resume-layout {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.template-selection {
  width: 300px; /* Adjust width as needed */
  margin-right: 20px; /* Space between template and details */
}

.templates {
  display: flex;
  flex-wrap: wrap; /* Allows for wrapping if needed */
  justify-content: space-between; /* Evenly distributes items */
}

.template-image {
  margin: 10px;
  cursor: pointer;
  width: 100px; /* Adjust size as needed */
  height: auto; /* Maintain aspect ratio */
}

.resume-details {
  flex: 1; /* Takes the remaining space */
}
</style>
