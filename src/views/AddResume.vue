<template>
  <div class="home-container">
    <v-row class="fill-height ma-0" align="start" justify="center">
      <v-col cols="12" class="pa-0">
        <v-card class="home-card" elevation="0">
          <!-- Header Section -->
          <v-card-item class="text-center pb-4">
            <v-icon
              icon="mdi-file-document-outline"
              size="72"
              color="primary"
              class="mb-6"
            ></v-icon>
            <v-card-title class="text-h2 font-weight-bold mb-4">
              Resume Builder
            </v-card-title>
            <v-card-subtitle class="text-h5 mb-6">
              Create your professional resume in minutes
            </v-card-subtitle>
          </v-card-item>

          <v-divider></v-divider>

          <!-- Resume Sections -->
          <v-card-text class="py-12">
            <v-container>
              <v-row justify="center" class="section-grid">
                <v-col cols="12" sm="6" md="4" lg="3" v-for="section in sections" :key="section.route">
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card
                      v-bind="props"
                      :elevation="isHovering ? 8 : 2"
                      @click="navigateTo(section.route)"
                      class="section-card"
                    >
                      <v-card-item class="pa-6">
                        <v-icon
                          :icon="section.icon"
                          size="48"
                          color="primary"
                          class="mb-4"
                        ></v-icon>
                        <v-card-title class="text-h5">{{ section.title }}</v-card-title>
                        <v-card-subtitle class="text-body-1 mt-2">
                          {{ section.subtitle }}
                        </v-card-subtitle>
                      </v-card-item>
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-divider class="mb-6"></v-divider>

          <!-- Template Selection and Generate Button -->
          <v-card-text class="pb-12">
            <v-container>
              <v-row align="center" justify="center">
                <v-col cols="12" md="6" lg="4">
                  <v-select
                    v-model="selectedTemplate"
                    :items="templates"
                    label="Select Resume Template"
                    variant="outlined"
                    class="mb-4"
                    density="comfortable"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4" lg="3" class="text-center">
                  <v-btn
                    color="primary"
                    size="x-large"
                    block
                    @click="generateResume"
                    :disabled="!selectedTemplate"
                  >
                    Generate PDF Resume
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedTemplate = ref('');

const templates = [
  { title: 'Professional', value: 'professional' },
  { title: 'Modern', value: 'modern' },
  { title: 'Creative', value: 'creative' },
  { title: 'Minimalist', value: 'minimalist' }
];

const sections = [
  {
    title: 'Contact Info',
    subtitle: 'Personal details and contact information',
    icon: 'mdi-account',
    route: 'enterContactInfo'
  },
  {
    title: 'Personal Links',
    subtitle: 'Social, GitHub, and Portfolio links',
    icon: 'mdi-link',
    route: 'enterLinks'
  },
  {
    title: 'Education',
    subtitle: 'Academic qualifications and achievements',
    icon: 'mdi-school',
    route: 'enterEducation'
  },
  {
    title: 'Experience',
    subtitle: 'Work history and professional experience',
    icon: 'mdi-briefcase',
    route: 'Experience'
  },
  {
    title: 'Projects',
    subtitle: 'Personal and professional projects',
    icon: 'mdi-lightbulb',
    route: 'enterProjects'
  },
  {
    title: 'Skills',
    subtitle: 'Technical and professional skills',
    icon: 'mdi-hammer-wrench',
    route: 'enterSkills'
  },
  {
    title: 'Awards/Certification',
    subtitle: 'Professional certifications and achievements',
    icon: 'mdi-certificate',
    route: 'enterCertifications'
  },
  {
    title: 'Interests',
    subtitle: 'Hobbies and personal interests',
    icon: 'mdi-heart',
    route: 'enterInterests'
  }
];

const navigateTo = (route) => {
  router.push({ name: route });
};

const generateResume = () => {
  if (selectedTemplate.value) {
    // Add your PDF generation logic here
    console.log('Generating PDF with template:', selectedTemplate.value);
  }
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow-y: auto;
}

.home-card {
  min-height: 100vh;
  background: transparent;
}

.section-card {
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
}

.section-card:hover {
  transform: translateY(-8px);
}

.section-grid {
  max-width: 1400px;
  margin: 0 auto;
}

.v-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 56px;
}

.v-card-title {
  line-height: 1.4;
}

.fill-height {
  height: 100%;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .home-container {
    padding: 1rem;
  }
  
  .v-card-item {
    padding: 1rem !important;
  }
  
  .text-h2 {
    font-size: 2rem !important;
  }
  
  .text-h5 {
    font-size: 1.25rem !important;
  }
}
</style>