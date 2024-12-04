<template>
  <div class="resume-wrapper">
    <!-- Header -->
    <v-app-bar color="primary" dark>
      <v-toolbar-title>Generate Resume</v-toolbar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-container fluid class="main-content">
      <v-row>
        <!-- Left Column: Resume Inputs -->
        <v-col cols="12" md="6" class="resume-input">
          <v-card class="resume-card" elevation="0">
            <v-card-item class="text-center header-section">
              <v-icon icon="mdi-file-document" size="72" color="primary" class="mb-6"></v-icon>
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
                item-title="project_name"
                multiple
                chips
                label="Select Projects"
                class="mb-6"
                return-object
              ></v-select>
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
              >
                Generate and Save Resume
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
                <div class="text-center mb-6">
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
                <div class="mb-4">
                  <h2 class="text-lg font-bold border-b border-gray-400 mb-2">DESCRIPTION</h2>
                  <p class="text-sm">{{ introduction }}</p>
                </div>

                <!-- Education -->
                <div class="mb-4">
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
                <div class="mb-4">
                  <h2 class="text-lg font-bold border-b border-gray-400 mb-2">PERSONAL LINKS</h2>
                  <div v-for="(link, index) in selectedLinks" :key="index" class="mb-1">
                    <span class="font-bold">{{ link.url }}</span>
                  </div>
                </div>

                <!-- Projects -->
                <div class="mb-4">
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
                <div class="mb-4">
                  <h2 class="text-lg font-bold border-b border-gray-400 mb-2">SKILLS</h2>
                  <div v-for="(skill, index) in selectedSkills" :key="index" class="mb-1">
                    <span class="font-bold">{{ skill.skill_name }}</span>
                  </div>
                </div>

                <!-- Awards -->
                <div class="mb-4">
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
import { ref, onMounted } from "vue";
import { jsPDF } from 'jspdf';
import ContactServices from "../services/ContactServices";
import EducationServices from "../services/ EducationServices";
import PersonalLinkServices from "../services/PersonalLinkServices";
import ProjectServices from "../services/ProjectServices";
import ExperienceServices from "../services/ExperienceServices";
import SkillServices from "../services/SkillServices";
import interestServices from "../services/interestServices";
import certificationServices from "../services/certificationServices";
import ResumeServices from "../services/ResumeServices";
import store from '../store/store';

const contacts = ref([]);
const educations = ref([]);
const projects = ref([]);
const links = ref([]);
const experiences= ref([]);
const skills= ref([]);
const interests= ref([]);
const awards= ref([]);

const selectedContacts = ref([]);
const selectedEducations = ref([]);
const selectedProjects = ref([]);
const selectedLinks = ref([]);
const selectedExperiences = ref([]);
const selectedInterests = ref([]);
const selectedSkills= ref([]);
const selectedAwards= ref([]);

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
    //experiences.value = experiencesRes.data;
    const [contactsRes, educationsRes, projectsRes, linksRes, experiencesRes, skillsRes, interestsRes, awardsRes] = await Promise.all([
      ContactServices.getAllContacts(userId),
      EducationServices.getAllEducations(userId),
      ProjectServices.getAllProjects(userId),
      PersonalLinkServices.getAllPersonalLinks(userId),
      ExperienceServices.getExperiences(userId),
      SkillServices.getSkills(userId),
      interestServices.getAllInterests(userId),
      certificationServices.getCertification(userId),
    ]);
    console.log(linksRes);

    // Populate reactive variables with fetched data
    contacts.value = contactsRes.data;
    educations.value = educationsRes.data;
    projects.value = projectsRes.data;
    links.value = linksRes.data;
    experiences.value = experiencesRes.data;
    skills.value = skillsRes.data;
    interests.value = interestsRes.data;
    awards.value=awardsRes.data;

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

    //console.log("Selected Educations:", selectedEducations.value);


  const linkIds = Array.isArray(selectedLinks.value)
    ? selectedLinks.value.map(link => link.link_id)
    : [];

  const experienceIds = Array.isArray(selectedExperiences.value)
     ? selectedExperiences.value.map(exp => exp.experience_id)
     : [];

   const skillIds = Array.isArray(selectedSkills.value)
     ? selectedSkills.value.map(skill => skill.skill_id)
     : [];

   const interestIds = Array.isArray(selectedInterests.value)
     ? selectedInterests.value.map(interest => interest.interest_id)
     : [];

     const awardIds = Array.isArray(selectedAwards.value)
     ? selectedAwards.value.map(awards => awards.award_id)
     : [];   

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
      selectedExperiences: experienceIds,
      selectedSkills: skillIds,
      selectedInterests: interestIds,
      selectedAwards:awardIds,
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
    let yPos = 20; // Starting Y position

    // Header with name
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(`${selectedContacts.value.fName} ${selectedContacts.value.lName}`, 105, yPos, { align: "center" });

    // Contact Information
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Address: ${selectedContacts.value.address}`, 105, yPos, { align: "center" });
    yPos += 7;
    doc.text(`Phone: ${selectedContacts.value.phone_number}`, 105, yPos, { align: "center" });
    yPos += 7;
    doc.text(`Email: ${selectedContacts.value.email}`, 105, yPos, { align: "center" });

    // Introduction
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPTION", 20, yPos);

    yPos += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(introduction.value, 170), 20, yPos);

    // Education Section
    if (selectedEducations.value.length > 0) {
      yPos += 20;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("EDUCATION", 20, yPos);

      selectedEducations.value.forEach((edu) => {
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`${edu.institution}`, 20, yPos);
        doc.text(`${edu.start_date} - ${edu.end_date}`, 170, yPos, { align: "right" });

        yPos += 7;
        doc.text(`${edu.degree}`, 20, yPos);
        if (edu.gpa) {
          yPos += 7;
          doc.text(`GPA: ${edu.gpa}`, 20, yPos);
        }
      });
    }

    // Projects Section
    if (selectedProjects.value.length > 0) {
      yPos += 20;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("PROJECTS", 20, yPos);

      selectedProjects.value.forEach((project) => {
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`${project.project_name}`, 20, yPos);
        yPos += 7;
        doc.text(doc.splitTextToSize(`Description: ${project.description}`, 170), 20, yPos);
        yPos += 10;
        doc.text(`Technologies: ${project.technologies_used}`, 20, yPos);
        if (project.project_link) {
          yPos += 7;
          doc.text(`Link: ${project.project_link}`, 20, yPos);
        }
      });
    }

    // Experiences Section
    if (selectedExperiences.value.length > 0) {
      yPos += 20;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("EXPERIENCE", 20, yPos);

      selectedExperiences.value.forEach((exp) => {
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`${exp.company}`, 20, yPos);
        doc.text(`${exp.start_date} - ${exp.end_date}`, 170, yPos, { align: "right" });

        yPos += 7;
        doc.text(`${exp.title}`, 20, yPos);
        yPos += 7;
        doc.text(doc.splitTextToSize(exp.description.join(", "), 170), 20, yPos);
      });
    }

    // Skills Section
    if (selectedSkills.value.length > 0) {
      yPos += 20;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("SKILLS", 20, yPos);

      yPos += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(selectedSkills.value.join(" • "), 20, yPos);
    }

    // Interests Section
    if (selectedInterests.value.length > 0) {
      yPos += 20;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("INTERESTS", 20, yPos);

      yPos += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(selectedInterests.value.join(" • "), 20, yPos);
    }

    // Awards Section
    if (selectedAwards.value.length > 0) {
      yPos += 20;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("AWARDS & CERTIFICATIONS", 20, yPos);

      selectedAwards.value.forEach((award) => {
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`${award.title}`, 20, yPos);
        yPos += 7;
        doc.text(`${award.year}`, 170, yPos, { align: "right" });
      });
    }

    // Save the PDF
    doc.save(`${selectedContacts.value.fName}_${selectedContacts.value.lName}_Resume.pdf`);

    // Prepare data for backend saving
    const resumeData = {
      title: resumeTitle.value,
      introduction: introduction.value,
      template_choice: selectedTemplate.value,
      user_id: user.user_id,
    };

    await ResumeServices.create(resumeData);

    showNotification("Resume PDF generated and saved successfully");
  } catch (error) {
    console.error("Error generating or saving PDF:", error);
    showNotification("Failed to generate or save PDF", "error");
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