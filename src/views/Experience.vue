<template>
  <div class="experience-wrapper">
    <div class="experience-container">
      <v-row class="fill-height ma-0" align="start" justify="center">
        <v-col cols="12" class="pa-0">
          <v-card class="experience-card" elevation="0">
            <!-- Header -->
            <v-card-item class="text-center header-section">
              <v-icon icon="mdi-briefcase" size="72" color="primary" class="mb-6"></v-icon>
              <v-card-title class="text-h2 font-weight-bold mb-4">Work Experience</v-card-title>
              <v-card-subtitle class="text-h5 mb-6">
                Start with your most recent job first and work backward.
              </v-card-subtitle>
            </v-card-item>

            <v-divider></v-divider>

            <!-- Add New Experience Button -->
            <v-card-text class="experience-content py-6">
              <v-container>
                <v-row justify="center" class="mb-6">
                  <v-col cols="12" md="8">
                    <v-btn
                      color="primary"
                      block
                      @click="addNewExperience"
                      size="large"
                      prepend-icon="mdi-plus"
                    >
                      Add New Experience
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- Experiences List -->
                <v-row justify="center">
                  <v-col cols="12" md="8">
                    <v-expansion-panels v-model="expandedPanel">
                      <v-expansion-panel
                        v-for="(experience, index) in experiences"
                        :key="experience.experience_id || index"
                      >
                        <v-expansion-panel-title>
                          <span class="text-h6">
                            {{ experience.job_title || 'New Experience' }} at
                            {{ experience.company || 'Unknown' }}
                          </span>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <form @submit.prevent="saveExperience(experience)">
                            <!-- Job Title -->
                            <v-text-field
                              v-model="experience.job_title"
                              label="Job Title"
                              outlined
                              dense
                              class="mb-4"
                              required
                            ></v-text-field>

                            <!-- Employer -->
                            <v-text-field
                              v-model="experience.company"
                              label="Employer"
                              outlined
                              dense
                              class="mb-4"
                              required
                            ></v-text-field>

                            <!-- Description -->
                            <v-textarea
                              v-model="experience.description"
                              label="Description"
                              outlined
                              dense
                              auto-grow
                              class="mb-4"
                            ></v-textarea>

                            <!-- Start Year -->
                            <v-text-field
                              v-model="experience.start_date"
                              label="Start Year"
                              outlined
                              dense
                              class="mb-4"
                              placeholder="Enter start year (e.g., 2020)"
                              required
                            ></v-text-field>

                            <!-- End Year -->
                            <v-text-field
                              v-model="experience.end_date"
                              label="End Year"
                              outlined
                              dense
                              class="mb-4"
                              placeholder="Enter end year (e.g., 2023)"
                              :disabled="experience.currentlyWorking"
                            ></v-text-field>

                            <!-- Currently Working Checkbox -->
                            <v-checkbox
                              v-model="experience.currentlyWorking"
                              label="I currently work here"
                              dense
                              class="mb-4"
                            ></v-checkbox>

                            <!-- Action Buttons -->
                            <v-row>
                              <v-col cols="6">
                                <v-btn
                                  color="error"
                                  block
                                  @click="deleteExperience(experience.experience_id)"
                                >
                                  Delete
                                </v-btn>
                              </v-col>
                              <v-col cols="6">
                                <v-btn
                                  color="success"
                                  block
                                  type="submit"
                                >
                                  Save
                                </v-btn>
                              </v-col>
                            </v-row>
                          </form>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
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

    <!-- Success Message -->
    <div v-if="successMessage" class="alert-success">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import ExperienceServices from "../services/ExperienceServices";
import store from "../store/store";

export default {
  name: "Experience",
  data() {
    return {
      currentExperience: {
        job_title: "",
        company: "",
        description: "",
        start_date: "",
        end_date: "",
        currentlyWorking: false,
        userId: store.getters.getLoginUserInfo?.user_id || null,
      },
      experiences: [],
      expandedPanel: null,
      snackbar: {
        show: false,
        text: "",
        color: "success",
        timeout: 3000,
      },
      successMessage: "",
    };
  },
  mounted() {
    this.loadExperiences();
  },
  methods: {
    async loadExperiences() {
      try {
        const response = await ExperienceServices.getExperiencesForUser(
          this.currentExperience.userId
        );
        this.experiences = response.data || [];
      } catch (error) {
        console.log(error)
        this.showNotification("Failed to load experiences", "error");
      }
    },
    async saveExperience(experience) {
      try {
        if (experience.experience_id) {
          await ExperienceServices.updateExperience(experience.experience_id, experience);
        } else {
          const response = await ExperienceServices.createExperience({
            ...experience,
            userId: this.currentExperience.userId,
          });
          experience.experience_id = response.data.experience_id;
        }
        this.loadExperiences();
        this.showNotification("Experience saved successfully", "success");
      } catch (error) {
        this.showNotification("Failed to save experience", "error");
      }
    },
    addNewExperience() {
      this.experiences.push({
        job_title: "",
        company: "",
        description: "",
        start_date: "",
        end_date: "",
        currentlyWorking: false,
        userId: this.currentExperience.userId,
      });
      this.expandedPanel = this.experiences.length - 1;
    },
    async deleteExperience(id) {
      try {
        await ExperienceServices.deleteExperience(id);
        this.experiences = this.experiences.filter(
          (experience) => experience.experience_id !== id
        );
        this.showNotification("Experience deleted successfully", "success");
      } catch (error) {
        this.showNotification("Failed to delete experience", "error");
      }
    },
    showNotification(text, color = "success") {
      this.snackbar = { show: true, text, color };
    },
  },
};
</script>

<style scoped>
/* Consolidated styles */
.experience-wrapper {
  min-height: 100vh;
  width: 100vw;
  background-color: rgb(var(--v-theme-background));
  display: flex;
  flex-direction: column;
}

.experience-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.experience-card {
  min-height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.header-section {
  padding-top: 4rem;
  padding-bottom: 2rem;
}

.experience-content {
  flex: 1;
}

.alert-success {
  max-width: 500px;
  margin: 20px auto;
  padding: 10px;
  background-color: #dff0d8;
  color: #3c763d;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  text-align: center;
}
</style>
