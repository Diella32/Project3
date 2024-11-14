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

            <!-- Resume Content -->
            <v-card-text class="resume-content py-6">
              <v-container>
                <v-row justify="center">
                  <v-col cols="12" md="8">
                    <!-- Contact Selection -->
                    <v-select
                      v-model="selectedContact"
                      :items="contacts"
                      item-title="fName"
                      item-value="id"
                      label="Select Contact Information"
                      class="mb-6"
                      return-object
                    ></v-select>

                    <!-- Education Selection -->
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

                    <!-- Projects Selection -->
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

                    <!-- Links Selection -->
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

                    <!-- Generate Button -->
                    <v-btn
                      color="primary"
                      block
                      @click="generateCompletePDF"
                      :loading="isGenerating"
                      :disabled="!selectedContact"
                      size="large"
                      prepend-icon="mdi-file-pdf-box"
                    >
                      Generate Complete Resume
                    </v-btn>

                    <!-- Preview Card -->
                    <v-card v-if="selectedContact" class="mt-6" variant="outlined">
                      <v-card-title>Resume Preview</v-card-title>
                      <v-card-text>
                        <h3 class="text-h6 mb-2">Contact Information</h3>
                        <div class="ml-3 mb-4">
                          <div>{{ selectedContact.fName }} {{ selectedContact.lName }}</div>
                          <div>{{ selectedContact.email }}</div>
                          <div>{{ selectedContact.phone_number }}</div>
                          <div>{{ selectedContact.address }}</div>
                        </div>

                        <h3 class="text-h6 mb-2">Education</h3>
                        <div v-for="edu in selectedEducations" :key="edu.id" class="ml-3 mb-2">
                          <div class="font-weight-bold">{{ edu.degree }}</div>
                          <div>{{ edu.institution }}</div>
                          <div>{{ edu.FieldOfStudy }}</div>
                          <div>{{ edu.startDate }} - {{ edu.endDate }}</div>
                          <div>GPA: {{ edu.gpa }}</div>
                        </div>

                        <h3 class="text-h6 mb-2">Projects</h3>
                        <div v-for="project in selectedProjects" :key="project.id" class="ml-3 mb-2">
                          <div class="font-weight-bold">{{ project.project_name }}</div>
                          <div>{{ project.description }}</div>
                          <div>{{ project.project_link }}</div>
                          <div>{{ project.technologies_used }}</div>
                          
                        </div>

                        <h3 class="text-h6 mb-2">Personal Links</h3>
                        <div v-for="link in selectedLinks" :key="link.id" class="ml-3 mb-2">
                          <div class="font-weight-bold">{{ link.type }}</div>
                          <div> {{ link.url }}</div>
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

<script setup>
import { ref, onMounted } from "vue";
import { jsPDF } from 'jspdf';
import ContactServices from "../services/ContactServices";
import EducationServices from "../services/ EducationServices";
import PersonalLinkServices from "../services/PersonalLinkServices";
import ProjectServices from "../services/ProjectServices";
import store from '../store/store';

const contacts = ref([]);
const educations = ref([]);
const projects = ref([]);
const links = ref([]);
const selectedContact = ref(null);
const selectedEducations = ref([]);
const selectedProjects = ref([]);
const selectedLinks = ref([]);
const isGenerating = ref(false);
const user = store.getters.getLoginUserInfo;
const userId = user.user_id;

// Snackbar state
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

// Fetch all data
const fetchAllData = async () => {
  try {
    const [contactsRes, educationsRes, projectsRes, linksRes] = await Promise.all([
      ContactServices.getAllContacts(userId),
      EducationServices.getAllEducations(userId),
      ProjectServices.getAllProjects(userId),
      PersonalLinkServices.getAllPersonalLinks(userId)
    ]);

    contacts.value = contactsRes.data;
    educations.value = educationsRes.data;
    projects.value = projectsRes.data;
    links.value = linksRes.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    showNotification("Failed to load data", "error");
  }
};

// Generate PDF function
const generateCompletePDF = async () => {
  if (!selectedContact.value) {
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
    doc.text(`${selectedContact.value.fName} ${selectedContact.value.lName}`, 20, yPos);

    // Contact Information
    yPos += 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Contact Information', 20, yPos);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPos += 10;
    doc.text(`Email: ${selectedContact.value.email}`, 25, yPos);
    yPos += 7;
    doc.text(`Phone: ${selectedContact.value.phone_number}`, 25, yPos);
    yPos += 7;
    doc.text(`Address: ${selectedContact.value.address}`, 25, yPos);

    // Education Section
    if (selectedEducations.value.length > 0) {
      yPos += 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Education', 20, yPos);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      selectedEducations.value.forEach(edu => {
        yPos += 10;
        doc.text(`${edu.degree} - ${edu.institution}`, 25, yPos);
        yPos += 7;
        doc.text(`Field: ${edu.FieldOfStudy}`, 25, yPos);
        yPos += 7;
        doc.text(`${edu.startDate} - ${edu.endDate}`, 25, yPos);
        yPos += 7;
        doc.text(`GPA: ${edu.gpa}`, 25, yPos);
      });
    }

    // Projects Section
    if (selectedProjects.value.length > 0) {
      yPos += 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Projects', 20, yPos);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      selectedProjects.value.forEach(project => {
        yPos += 10;
        doc.text(project.project_name, 25, yPos);
        yPos += 7;
        doc.text(project.technologies_used, 25,yPos)
        yPos += 7;
        doc.text(project.description, 25, yPos);
        yPos += 7;
        doc.text(project.project_link, 25, yPos);

      });
    }

    // Personal Links Section
    if (selectedLinks.value.length > 0) {
      yPos += 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Personal Links', 20, yPos);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      selectedLinks.value.forEach(link => {
        yPos += 10;
        doc.text(`${link.type}: ${link.url}`, 25, yPos);
      });
    }

    // Save the PDF
    doc.save(`${selectedContact.value.fName}_${selectedContact.value.lName}_Resume.pdf`);
    showNotification("Resume PDF generated successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    showNotification("Failed to generate PDF", "error");
  } finally {
    isGenerating.value = false;
  }
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

.resume-content {
  flex: 1;
}

.text-center {
  text-align: center;
}
</style>