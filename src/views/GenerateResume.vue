<template>
  <div class="resume-wrapper">
    <div class="resume-container">
      <v-row class="fill-height ma-0" align="start" justify="center">
        <v-col cols="12" class="pa-0">
          <v-card class="resume-card" elevation="0">
            <!-- Header -->
            <v-card-item class="text-center header-section">
              <v-icon icon="mdi-file-document" size="72" color="primary" class="mb-6"></v-icon>
              <v-card-title class="text-h2 font-weight-bold mb-4">Generate Resume</v-card-title>
              <v-card-subtitle class="text-h5 mb-6">Create your comprehensive resume</v-card-subtitle>
            </v-card-item>

            <v-divider></v-divider>

            <!-- Resume Form Inputs -->
            <v-card-text class="resume-content py-6">
              <v-container>
                <v-row justify="center">
                  <v-col cols="12" md="8">
                    <!-- Title and Introduction Inputs -->
                    <v-text-field
                      v-model="resumeTitle"
                      label="Resume Title"
                      class="mb-4"
                    ></v-text-field>
                    <v-textarea
                      v-model="introduction"
                      label="Introduction"
                      class="mb-6"
                    ></v-textarea>
                    <v-select
                      v-model="selectedTemplate"
                      :items="['Template 1', 'Template 2', 'Template 3', 'Template 4']"
                      label="Select a Template"
                      class="mb-6"
                    ></v-select>

                    <!-- Contact, Education, Projects, Links Selections -->
                    <v-select
                      v-model="selectedContacts"
                      :items="contacts"
                      item-title="fName"
                      item-value="id"
                      label="Select Contact Information"
                      class="mb-6"
                      return-object
                    ></v-select>
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
                    <v-select
                      v-model="selectedProjects"
                      :items="projects"
                      item-title="title"
                      multiple
                      chips
                      label="Select Projects"
                      class="mb-6"
                      return-object
                    ></v-select>
                    <v-select
                      v-model="selectedLinks"
                      :items="links"
                      item-title="title"
                      multiple
                      chips
                      label="Select Personal Links"
                      class="mb-6"
                      return-object
                    ></v-select>

                    <!-- Save and Generate Buttons -->
                    <v-btn
                      color="secondary"
                      block
                      @click="saveResume"
                      :loading="isSaving"
                      size="large"
                      prepend-icon="mdi-content-save"
                      class="mb-4"
                    >
                      Save Resume
                    </v-btn>
                    <v-btn
                      color="primary"
                      block
                      @click="generateAndSavePDF"
                      :loading="isGenerating"
                      :disabled="!selectedContacts"
                      size="large"
                      prepend-icon="mdi-file-pdf-box"
                      class="mb-4"
                    >
                      Generate and Save Resume
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>


            <v-divider></v-divider>

            <!-- Resume Preview -->
            <v-card-text class="resume-preview py-6">
              <v-container>
                <v-row justify="center">
                  <v-col cols="12" md="8">
                    <v-card class="mt-6" variant="outlined">

                      <v-card-title>Resume Preview</v-card-title>
                      <v-card-text>
                        <h3 class="text-h6 mb-2">Title: {{ resumeTitle }}</h3>
                        <p class="mb-4">{{ introduction }}</p>

                        <h3 class="text-h6 mb-2">Contact Information</h3>
                        <div class="ml-3 mb-4">
                          <div>{{ selectedContacts?.fName }} {{ selectedContacts?.lName }}</div>
                          <div>{{ selectedContacts?.email }}</div>
                          <div>{{ selectedContacts?.phone_number }}</div>
                          <div>{{ selectedContacts?.address }}</div>
                        </div>

                        <h3 class="text-h6 mb-2">Education</h3>
                        <div v-for="edu in selectedEducations" :key="edu.id" class="ml-3 mb-2">
                          <div class="font-weight-bold">{{ edu.degree }}</div>
                          <div>{{ edu.institution }}</div>
                          <div>{{ edu.FieldOfStudy }}</div>
                          <div>{{ edu.startDate }} - {{ edu.endDate }}</div>
                          <div v-if="edu.gpa">GPA: {{ edu.gpa }}</div>
                        </div>

                        <h3 class="text-h6 mb-2">Projects</h3>
                        <div v-for="project in selectedProjects" :key="project.id" class="ml-3 mb-2">
                          <div class="font-weight-bold">{{ project.project_name }}</div>
                          <div>{{ project.description }}</div>
                          <div>{{ project.technologies_used }}</div>
                          <div>{{ project.project_link }}</div>
                        </div>

                        <h3 class="text-h6 mb-2">Personal Links</h3>
                        <div v-for="link in selectedLinks" :key="link.id" class="ml-3 mb-2">
                          <div class="font-weight-bold">{{ link.type }}</div>
                          <div>{{ link.url }}</div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Notifications -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { jsPDF } from 'jspdf';
import ContactServices from "../services/ContactServices";
import EducationServices from "../services/ EducationServices";
import PersonalLinkServices from "../services/PersonalLinkServices";
import ProjectServices from "../services/ProjectServices";
import ExperienceServices from "../services/ExperienceServices";
import certificationServices from "../services/certificationServices";
import ResumeServices from "../services/ResumeServices";
import store from '../store/store';

const contacts = ref([]);
const educations = ref([]);
const projects = ref([]);
const links = ref([]);
const selectedContacts = ref([]);
const selectedEducations = ref([]);
const selectedProjects = ref([]);
const selectedLinks = ref([]);
const resumeTitle = ref('');
const introduction = ref('');
const selectedTemplate = ref('Template 1');
const isGenerating = ref(false);
const isSaving = ref(false);
const user = store.getters.getLoginUserInfo;
const userId = user.user_id;

// Snackbar state
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

const fetchAllData = async () => {
  try {
    const [contactsRes, educationsRes, projectsRes, linksRes] = await Promise.all([
      ContactServices.getAllContacts(userId),
      EducationServices.getAllEducations(userId),
      ProjectServices.getAllProjects(userId),
      PersonalLinkServices.getAllPersonalLinks(userId),
      //ExperienceServices.getAllExperiences(userId),
      // SkillServices.getAllSkills(userId),
      // InterestServices.getAllInterests(userId),
    ]);

    // Populate reactive variables with fetched data
    contacts.value = contactsRes.data;
    educations.value = educationsRes.data;
    projects.value = projectsRes.data;
    links.value = linksRes.data;
    // experiences.value = experiencesRes.data;
    // skills.value = skillsRes.data;
    // interests.value = interestsRes.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    showNotification("Failed to load data", "error");
  }
};


const saveResume = async () => {
  if (!resumeTitle.value || !selectedContacts.value) {
    showNotification("Please provide a title and select contact information", "error");
    return;
  }

  // Map selected relationships to their respective IDs
  const contactIds = Array.isArray(selectedContacts.value)
    ? selectedContacts.value.map(contact => contact.contact_id)
    : [selectedContacts.value.contact_id];

    const projectIds = Array.isArray(selectedProjects.value)
    ? selectedProjects.value.map(proj => proj.project_id)
    : [];


  const educationIds = Array.isArray(selectedEducations.value)
    ? selectedEducations.value.map(edu => edu.education_id)
    : [];

    console.log("Selected Educations:", selectedEducations.value);


  const linkIds = Array.isArray(selectedLinks.value)
    ? selectedLinks.value.map(link => link.link_id)
    : [];

  // const experienceIds = Array.isArray(selectedExperiences.value)
  //   ? selectedExperiences.value.map(exp => exp.id)
  //   : [];

  // const skillIds = Array.isArray(selectedSkills.value)
  //   ? selectedSkills.value.map(skill => skill.id)
  //   : [];

  // const interestIds = Array.isArray(selectedInterests.value)
  //   ? selectedInterests.value.map(interest => interest.id)
  //   : [];

  isSaving.value = true;
  try {
    const resumeData = {
      title: resumeTitle.value,
      introduction: introduction.value,
      template_choice: selectedTemplate.value,
      userId: user.user_id,
      selectedContacts: contactIds,
      selectedEducation: educationIds,
      selectedProjects: projectIds,
      selectedPersonalLinks: linkIds,
      // selectedExperiences: experienceIds,
      // selectedSkills: skillIds,
      // selectedInterests: interestIds,
    };
    console.log(resumeData)

    // Save the resume to the backend
    await ResumeServices.create(resumeData);
    showNotification("Resume saved successfully");
  } catch (error) {
    console.error("Error saving resume:", error);
    showNotification("Failed to save resume", "error");
  } finally {
    isSaving.value = false;
  }
};


// Function to Generate PDF and Save Resume
const generateAndSavePDF = async () => {
  if (!selectedContacts.value) {
    showNotification("Please select contact information", "error");
    return;
  }

  isGenerating.value = true;
  try {
    const doc = new jsPDF();
    let yPos = 20;

    // Header with name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`${selectedContacts.value.fName} ${selectedContacts.value.lName}`, 20, yPos);

    // Contact Information
    yPos += 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Contact Information', 20, yPos);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPos += 10;
    doc.text(`Email: ${selectedContacts.value.email}`, 25, yPos);
    yPos += 7;
    doc.text(`Phone: ${selectedContacts.value.phone_number}`, 25, yPos);
    yPos += 7;
    doc.text(`Address: ${selectedContacts.value.address}`, 25, yPos);



     // Education
     if (selectedEducations.value.length > 0) {
      yPos += 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Education', 20, yPos);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      selectedEducations.value.forEach((edu) => {
        yPos += 10;
        doc.text(`${edu.degree} in ${edu.FieldOfStudy}`, 25, yPos);
        yPos += 7;
        doc.text(`${edu.institution}`, 25, yPos);
        yPos += 7;
        doc.text(`(${edu.startDate} - ${edu.endDate})`, 25, yPos);
        if (edu.gpa) {
          yPos += 7;
          doc.text(`GPA: ${edu.gpa}`, 25, yPos);
        }
      });
    }


    // Projects
    if (selectedProjects.value.length > 0) {
      yPos += 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Projects', 20, yPos);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      selectedProjects.value.forEach((project) => {
        yPos += 10;
        doc.text(`${project.project_name}`, 25, yPos);
        yPos += 7;
        doc.text(`${project.description}`, 25, yPos);
        if (project.technologies_used) {
          yPos += 7;
          doc.text(`Technologies: ${project.technologies_used}`, 25, yPos);
        }
        if (project.project_link) {
          yPos += 7;
          doc.text(`Link: ${project.project_link}`, 25, yPos);
        }
      });
    }

    // Personal Links
    if (selectedLinks.value.length > 0) {
      yPos += 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Personal Links', 20, yPos);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      selectedLinks.value.forEach((link) => {
        yPos += 10;
        doc.text(`${link.url}`, 25, yPos);
      });
    }


    // Experiences
    if (selectedExperiences.value.length > 0) {
      yPos += 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Experiences', 20, yPos);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      selectedExperiences.value.forEach((experience) => {
        yPos += 10;
        doc.text(`${experience.title}`, 25, yPos);
        yPos += 7;
        doc.text(`${experience.description}`, 25, yPos);
        yPos += 7;
        doc.text(`(${experience.startDate} - ${experience.endDate})`, 25, yPos);
      });
    }

    // Interests
    if (selectedInterests.value.length > 0) {
      yPos += 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Interests', 20, yPos);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      selectedInterests.value.forEach((interest) => {
        yPos += 10;
        doc.text(`${interest.name}`, 25, yPos);
      });
    }




    // Add Education, Projects, and Links (same logic as before)
    // ...

    // Save the PDF locally (optional)
    doc.save(`${selectedContacts.value.fName}_${selectedContacts.value.lName}_Resume.pdf`);

    // Prepare data for the backend
    const resumeData = {
      title: resumeTitle.value,
      introduction: introduction.value,
      template_choice: selectedTemplate.value,
      userId:user.user_id,
    };

    // Save the resume to the backend
    await ResumeServices.create(resumeData);

    showNotification("Resume PDF generated and saved successfully");
  } catch (error) {
    console.error("Error generating or saving PDF:", error);
    showNotification("Failed to generate or save PDF", "error");
  } finally {
    isGenerating.value = false;
  }
};

const deleteResume = () => {
  selectedContact.value = null;
  selectedEducations.value = [];
  selectedProjects.value = [];
  selectedLinks.value = [];
  showNotification("Resume deleted", "success");
};


const showNotification = (text, color = "success", timeout = 3000) => {
  snackbar.value = { show: true, text, color, timeout };
};

onMounted(() => {
  fetchAllData();
});
</script>

<style scoped>
.resume-wrapper {
  min-height: 100vh;
  width: 100vw;
  background-color: rgb(var(--v-theme-background));
  display: flex;
  flex-direction: column;
}

.resume-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.resume-card {
  min-height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.header-section {
  padding-top: 4rem;
  padding-bottom: 2rem;
}

.resume-content,
.resume-preview {
  flex: 1;
}

.text-center {
  text-align: center;
}
</style>
