<template>
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