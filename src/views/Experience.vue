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
                          <v-form @submit.prevent="saveExperience">
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
                                  @click="saveExperience(experience)"
                                >
                                  Save
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-form>
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
    };
  },
  mounted() {
    this.loadExperiences();
  },
  methods: {
    async loadExperiences() {
      try {
        const response = await ExperienceServices.getExperiences(
          this.currentExperience.userId
        );
        this.experiences = response.data || [];
      } catch (error) {
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

.d-flex {
  display: flex;
}

.justify-space-between {
  justify-content: space-between;
}
</style>

    <div>
      <h1>Work Experience</h1>
      <h1>Let's work on your experience</h1>
      <h2>Start with your most recent job first and work backwards.</h2>
  
      <form @submit.prevent="saveExperience">
        <div>
          <label>Job Title:</label>
          <input
            type="text"
            v-model="currentExperience.jobTitle"
            placeholder="Enter job title"
            required
          />
        </div>
  
        <div>
          <label>Employer:</label>
          <input
            type="text"
            v-model="currentExperience.employer"
            placeholder="Enter employer"
            required
          />
        </div>
  
        <div>
          <label>City:</label>
          <input
            type="text"
            v-model="currentExperience.city"
            placeholder="Enter city"
            required
          />
        </div>
  
        <div>
          <label>Start Year:</label>
          <input
            type="text"
            v-model="currentExperience.startYear"
            placeholder="Enter start year (e.g., 2020)"
            required
          />
        </div>
  
        <div>
          <label>End Year:</label>
          <input
            type="text"
            v-model="currentExperience.endYear"
            placeholder="Enter end year (e.g., 2022)"
            :disabled="currentExperience.currentlyWorking"
          />
        </div>
  
        <div>
          <label>
            <input
              type="checkbox"
              v-model="currentExperience.currentlyWorking"
            />
            I currently work here
          </label>
        </div>
  
        <div>
          <button type="button" @click="goBack">Back</button>
          <button type="submit">Save</button>
          <button type="button" @click="goNext">Next</button>
        </div>
      </form>
  
      <!-- Success Message -->
      <div v-if="successMessage" class="alert-success">
        {{ successMessage }}
      </div>
    </div>
  </template>
  
  <script>
  import ExperienceServices from '/src/services/experienceServices.js';
  import { useRoute, useRouter } from 'vue-router';
  import { onMounted } from 'vue';
 
  export default {
    name: "experience",
    data() {
      return {
        currentExperience: {
          jobTitle: "",
          employer: "",
          city: "",
          startYear: "",
          endYear: "",
          currentlyWorking: false,
          resumeId: null // We'll set this in mounted
        },
        successMessage: "", // For showing success message
      };
    },
    
    mounted() {
      // Get resumeId from route params
      this.currentExperience.resumeId = this.$route.params.resumeId;
      
      // If no resumeId is present, you might want to handle that case
      if (!this.currentExperience.resumeId) {
        console.error('No resume ID provided');
        // Handle the error appropriately
      }
    },
    methods: {
      async saveExperience() {
        try {
          // Use the ExperienceServices to save the experience
          const response = await ExperienceServices.createExperience(this.currentExperience);
  
          // Check if the response indicates success
          if (response.data.success) {
            // Show success message
            this.successMessage = 'Your experience was saved successfully. Please add more experience or click Next.';
            // Reset the form fields but keep the resumeId
            const resumeId = this.currentExperience.resumeId;
            this.currentExperience = {
              jobTitle: "",
              employer: "",
              city: "",
              startYear: "",
              endYear: "",
              currentlyWorking: false,
              resumeId: resumeId // Maintain the resumeId
            };
  
            // Clear the success message after a few seconds
            setTimeout(() => {
              this.successMessage = "";
            }, 3000);
          }
        } catch (error) {
          console.error("Error saving experience:", error);
          // More detailed error message based on the error type
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            alert(error.response.data.message || "Failed to save experience. Please try again.");
          } else if (error.request) {
            // The request was made but no response was received
            alert("No response from server. Please check your connection and try again.");
          } else {
            // Something happened in setting up the request that triggered an Error
            alert("Failed to save experience. Please try again.");
          }
        }
      },
      goBack() {
        this.$router.push({ name: 'previous-step' }); // Replace with your actual route name
      },
      goNext() {
        this.$router.push({ name: 'next-step' }); // Replace with your actual route name
      },
    },
  };
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
  }
  h2 {
    text-align: center;
  }
  form {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  div {
    margin-bottom: 12px;
  }
  
  label {
    font-weight: bold;
    display: inline-block;
    width: 100px;
  }
  
  input[type="text"] {
    width: calc(100% - 120px);
    padding: 8px;
    margin-left: 10px;
  }
  
  input[type="checkbox"] {
    margin-left: 5px;
  }
  
  button {
    margin-right: 10px;
    padding: 8px 16px;
    border: none;
    background-color: #ea0010;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #b30000;
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