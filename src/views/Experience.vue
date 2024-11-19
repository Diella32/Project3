<template>
  <div class="experience-container">
    <h1>Work Experience</h1>
    <h2>Let's work on your experience</h2>
    <h3>Start with your most recent job first and work backward.</h3>

    <div class="form-box">
      <form @submit.prevent="saveExperience">
        <div class="form-group">
          <label>Job Title:</label>
          <input
            type="text"
            v-model="currentExperience.job_title"
            placeholder="Enter job title"
            required
          />
        </div>

        <div class="form-group">
          <label>Employer:</label>
          <input
            type="text"
            v-model="currentExperience.company"
            placeholder="Enter employer"
            required
          />
        </div>

        <div class="form-group">
          <label>Description:</label>
          <input
            type="text"
            v-model="currentExperience.description"
            placeholder="Enter description"
            required
          />
        </div>

        <div class="form-group">
          <label>Start Year:</label>
          <input
            type="text"
            v-model="currentExperience.start_date"
            placeholder="Enter start year (e.g., 2020)"
            required
          />
        </div>

        <div class="form-group">
          <label>End Year:</label>
          <input
            type="text"
            v-model="currentExperience.end_date"
            placeholder="Enter end year (e.g., 2023)"
            :disabled="currentExperience.currentlyWorking"
          />
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              v-model="currentExperience.currentlyWorking"
            />
            I currently work here
          </label>
        </div>

        <div class="button-group">
          <button class="btn-back" type="button" @click="goBack">Back</button>
          <button class="btn-save" type="submit">Save</button>
          <button class="btn-next" type="button" @click="goNext">Next</button>
        </div>
      </form>
    </div>

    <!-- List of Experiences -->
    <div class="experience-list">
      <h2>Your Experiences:</h2>
      <ul>
        <li v-for="experience in experiences" :key="experience.id" class="experience-item">
          <div class="experience-details">
            <strong>{{ experience.job_title }}</strong> at {{ experience.company }}
            ({{ experience.start_date }} - 
            {{ experience.currentlyWorking ? "Present" : experience.end_date }})
          </div>
          <div class="experience-details">
              {{ experience.description }}
              </div>

          <div class="action-buttons">
            <button @click="editExperience(experience)" class="btn-edit">Edit</button>
            <button @click="deleteExperience(experience.experience_id)" class="btn-delete">Delete</button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="alert-success">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import ExperienceServices from '../services/ExperienceServices';
import store from '../store/store';

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
        userId: store.getters.getLoginUserInfo?.user_id || null, // Safely handle missing user_id
      },
      experiences: [],
      successMessage: "",
    };
  },
  mounted() {
    console.log("Mounted: Loading experiences...");
    console.log("User ID on mount:", this.currentExperience.userId);

    // Only load experiences if userId is available
    if (this.currentExperience.userId) {
      this.loadExperiences();
    } else {
      console.error("User ID is not available on mount.");
    }
  },
  watch: {
    // Watch for changes in userId and load experiences when it becomes available
    'currentExperience.userId': function(newVal) {
      if (newVal) {
        console.log("User ID updated, loading experiences...");
        this.loadExperiences();
      }
    }
  },
  methods: {
    async loadExperiences() {
      if (!this.currentExperience.userId) {
        console.error("User ID is not available.");
        return;
      }

      try {
        console.log("Fetching experiences for user ID:", this.currentExperience.userId);
        const response = await ExperienceServices.getExperiences(this.currentExperience.userId);

        // Check the structure of the response
        console.log("Response from loadExperiences:", response);

        // Safely set experiences
        this.experiences = response.data || [];
        console.log("Experiences fetched and set:", this.experiences);
      } catch (error) {
        console.error("Error loading experiences:", error);
      }
    },
    async saveExperience() {
      alert("Save button clicked!");
      console.log("Save button clicked!");

      // Input validation for start_date and end_date
      if (!/^\d{4}$/.test(this.currentExperience.start_date)) {
        alert("Start Year must be a four-digit number (e.g., 2020).");
        return;
      }
      if (!this.currentExperience.currentlyWorking && !/^\d{4}$/.test(this.currentExperience.end_date)) {
        alert("End Year must be a four-digit number (e.g., 2023).");
        return;
      }

      try {
        console.log("Saving experience:", this.currentExperience);
        const response = await ExperienceServices.createExperience(this.currentExperience);

        console.log("Response from saveExperience:", response);

        if (response.data.experience_id) {
          this.successMessage = 'Your experience was saved successfully.';
          console.log("Success Message Set:", this.successMessage);
          this.loadExperiences();
          this.resetForm();
          setTimeout(() => {
            this.successMessage = "";
          }, 3000);
        } else {
          console.error("Failed to save experience. No experience_id in response.");
          alert("Failed to save experience. Please try again.");
        }
      } catch (error) {
        console.error("Error saving experience:", error);
        alert("Failed to save experience. Please try again.");
      }
    },
    editExperience(experience) {
      this.currentExperience = { ...experience };
    },
    async deleteExperience(id) {
      try {
        const response = await ExperienceServices.deleteExperience(id);
        if (response.data.success) {
          this.successMessage = 'Experience deleted successfully.';
          this.loadExperiences();
          setTimeout(() => {
            this.successMessage = "";
          }, 3000);
        }
      } catch (error) {
        console.error("Error deleting experience:", error);
        alert("Failed to delete experience. Please try again.");
      }
    },
    resetForm() {
      this.currentExperience = {
        job_title: "",
        company: "",
        description: "",
        start_date: "",
        end_date: "",
        currentlyWorking: false,
        userId: store.getters.getLoginUserInfo?.user_id || null, // Safely handle missing user_id
      };
    },
    goBack() {
      this.$router.push({ name: 'previous-step' });
    },
    goNext() {
      this.$router.push({ name: 'next-step' });
    },
  },
};
</script>


<style scoped>
.experience-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
}

h1, h2, h3 {
  text-align: center;
}

.form-box {
  width: 100%;
  max-width: 600px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input[type="text"], input[type="checkbox"] {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-back {
  background-color: hsl(0, 61%, 41%);
  color: #fff;
}

.btn-save {
  background-color: hsl(0, 61%, 41%);
  color: #fff;
}

.btn-next {
  background-color: hsl(0, 61%, 41%);
  color: #fff;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-edit {
  background-color: #17a2b8;
  color: #fff;
}

.btn-delete {
  background-color: #dc3545;
  color: #fff;
}

.alert-success {
  max-width: 600px;
  margin-top: 20px;
  padding: 10px;
  background-color: #dff0d8;
  color: rgb(118, 60, 60);
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  text-align: center;
}
</style>
