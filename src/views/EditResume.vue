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

              <!-- Contact Information -->
              <section v-if="selectedContact.length" class="mb-6">
                <h3 class="text-h5 font-weight-bold mb-4">Contact Information</h3>
                <v-card v-for="(contact, index) in selectedContact" :key="index" class="mb-3 pa-4">
                  <v-text-field v-model="contact.fName" label="First Name" outlined dense />
                  <v-text-field v-model="contact.lName" label="Last Name" outlined dense />
                  <v-text-field v-model="contact.email" label="Email" outlined dense />
                  <v-text-field v-model="contact.phone_number" label="Phone" outlined dense />
                  <v-textarea v-model="contact.address" label="Address" outlined dense />
                </v-card>
              </section>

              <!-- Education -->
              <section v-if="selectedEducations.length" class="mb-6">
                <h3 class="text-h5 font-weight-bold mb-4">Education</h3>
                <v-card v-for="(edu, index) in selectedEducations" :key="index" class="mb-3 pa-4">
                  <v-text-field v-model="edu.institution" label="Institution" outlined dense />
                  <v-text-field v-model="edu.degree" label="Degree" outlined dense />
                  <v-text-field v-model="edu.FieldOfStudy" label="Field of Study" outlined dense />
                  <v-text-field v-model="edu.start_date" label="Start Date" outlined dense />
                  <v-text-field v-model="edu.end_date" label="End Date" outlined dense />
                </v-card>
              </section>

              <!-- Projects -->
              <section v-if="selectedProjects.length" class="mb-6">
                <h3 class="text-h5 font-weight-bold mb-4">Projects</h3>
                <v-card v-for="(project, index) in selectedProjects" :key="index" class="mb-3 pa-4">
                  <v-text-field v-model="project.project_name" label="Project Name" outlined dense />
                  <v-textarea v-model="project.description" label="Description" outlined dense />
                  <v-text-field v-model="project.technologies_used" label="Technologies Used" outlined dense />
                  <v-text-field v-model="project.project_link" label="Project Link" outlined dense />
                </v-card>
              </section>

              <!-- Skills -->
              <section v-if="selectedSkills.length" class="mb-6">
                <h3 class="text-h5 font-weight-bold mb-4">Skills</h3>
                <v-card v-for="(skill, index) in selectedSkills" :key="index" class="mb-3 pa-4">
                  <v-text-field v-model="skill.skill_name" label="Skill Name" outlined dense />
                </v-card>
              </section>

              <!-- Experiences -->
              <section v-if="selectedExperiences.length" class="mb-6">
                <h3 class="text-h5 font-weight-bold mb-4">Experiences</h3>
                <v-card v-for="(experience, index) in selectedExperiences" :key="index" class="mb-3 pa-4">
                  <v-text-field v-model="experience.job_title" label="Title" outlined dense />
                  <v-textarea v-model="experience.description" label="Description" outlined dense />
                  <v-text-field v-model="experience.start_date" label="Start Date" outlined dense />
                  <v-text-field v-model="experience.end_date" label="End Date" outlined dense />
                </v-card>
              </section>

              <!-- Interests -->
              <section v-if="selectedInterests.length" class="mb-6">
                <h3 class="text-h5 font-weight-bold mb-4">Interests</h3>
                <v-card v-for="(interest, index) in selectedInterests" :key="index" class="mb-3 pa-4">
                  <v-text-field v-model="interest.interest" label="Interest Name" outlined dense />
                </v-card>
              </section>

              <!-- Awards -->
              <section v-if="awardCertifications.length" class="mb-6">
                <h3 class="text-h5 font-weight-bold mb-4">Awards & Certifications</h3>
                <v-card v-for="(award, index) in awardCertifications" :key="index" class="mb-3 pa-4">
                  <v-text-field v-model="award.award_name" label="Award Title" outlined dense />
                  <v-text-field v-model="award.organization" label="Year" outlined dense />
                </v-card>
              </section>

              <!-- Personal Links -->
              <section v-if="selectedLinks?.length" class="mb-6">
                <h3 class="text-h5 font-weight-bold mb-4">Personal Links</h3>
                <v-card v-for="(link, index) in selectedLinks" :key="index" class="mb-3 pa-4">
                  <v-text-field v-model="link.url" label="URL" outlined dense />
                </v-card>
              </section>

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
                <div class="text-center mb-6" v-if="selectedContact?.length > 0">
                  <h1 class="text-2xl font-bold mb-2">
                    {{ selectedContact[0]?.fName }} {{ selectedContact[0]?.lName }}
                  </h1>
                  <div class="text-sm">
                    <span>{{ selectedContact[0]?.address }}</span>
                    <span class="mx-2">|</span>
                    <span>{{ selectedContact[0]?.phone_number }}</span>
                    <span class="mx-2">|</span>
                    <span>{{ selectedContact[0]?.email }}</span>
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
                  </div>
                </div>

                <!-- Experiences -->
                <div class="mb-4" v-if="selectedExperiences?.length">
                  <h2 class="text-lg font-bold border-b border-gray-400 mb-2">EXPERIENCES</h2>
                  <div v-for="(experience, index) in selectedExperiences" :key="index" class="mb-2">
                    <div class="flex justify-between">
                      <span class="font-bold">{{ experience.job_title }}</span>
                      <span>{{ experience.start_date }} - {{ experience.end_date }}</span>
                    </div>
                    <div>{{ experience.description }}</div>
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

                <!-- Personal Links -->
                <div class="mb-4" v-if="selectedLinks?.length">
                  <h2 class="text-lg font-bold border-b border-gray-400 mb-2">PERSONAL LINKS</h2>
                  <div v-for="(link, index) in selectedLinks" :key="index" class="mb-1">
                    <p class="text-sm">{{ link.url }}</p>
                  </div>
                </div>

                <!-- Skills -->
                <div class="mb-4" v-if="selectedSkills?.length">
                  <h2 class="text-lg font-bold border-b border-gray-400 mb-2">SKILLS</h2>
                  <div v-for="(skill, index) in selectedSkills" :key="index" class="mb-1">
                    <p class="text-sm">{{ skill.skill_name }}</p>
                  </div>
                </div>

                <!-- Interests -->
                <div class="mb-4" v-if="selectedInterests?.length">
                  <h2 class="text-lg font-bold border-b border-gray-400 mb-2">INTERESTS</h2>
                  <div v-for="(interest, index) in selectedInterests" :key="index" class="mb-1">
                    <p class="text-sm">{{ interest.interest }}</p>
                  </div>
                </div>

                <!-- Awards -->
                <div class="mb-4" v-if="awardCertifications?.length">
                  <h2 class="text-lg font-bold border-b border-gray-400 mb-2">AWARDS</h2>
                  <div v-for="(award, index) in awardCertifications" :key="index" class="mb-1">
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

const route = useRoute();
const router = useRouter();

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
const isSaving = ref(false);

const getStatusColor = (status) => {
  const colors = {
    Draft: 'grey',
    'In Progress': 'orange',
    Complete: 'green',
    Published: 'blue',
  };
  return colors[status] || 'grey';
};

const fetchResumeDetails = async () => {
  try {
    const resumeId = route.params.id;
    const response = await ResumeServices.getResume(resumeId);
    const data = response.data;

    resumeTitle.value = data.title || '';
    introduction.value = data.introduction || '';
    status.value = data.status || '';
    selectedContact.value = data.contacts || [];
    selectedEducations.value = data.educations || [];
    selectedProjects.value = data.projects || [];
    selectedLinks.value = data.personalLinks || [];
    selectedSkills.value = data.skills || [];
    selectedExperiences.value = data.experiences || [];
    selectedInterests.value = data.interests || [];
    awardCertifications.value = data.awards || [];
  } catch (error) {
    console.error('Error fetching resume details:', error);
  }
};

const saveResume = async () => {
  try {
    isSaving.value = true;
    const resumeId = route.params.id;

    const updatedData = {
      title: resumeTitle.value,
      introduction: introduction.value,
      status: status.value,
      contacts: selectedContact.value,
      educations: selectedEducations.value,
      projects: selectedProjects.value,
      skills: selectedSkills.value,
      personalLinks: selectedLinks.value,
      experiences: selectedExperiences.value,
      interests: selectedInterests.value,
      awards: awardCertifications.value,
    };

    await ResumeServices.update(resumeId, updatedData);
    router.push('/resumes');
  } catch (error) {
    console.error('Error saving resume:', error);
  } finally {
    isSaving.value = false;
  }
};

const cancelEdit = () => {
  router.push('/resumes');
};

onMounted(fetchResumeDetails);
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
