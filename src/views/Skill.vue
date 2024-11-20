<template>
    <div class="skills-container">
      <h1>Skills</h1>
      <h2>Highlight your key skills</h2>
      <h3>Include skills relevant to the jobs you are targeting.</h3>
  
      <div class="form-box">
        <form @submit.prevent="saveSkill">
          <div class="form-group">
            <label>Skill:</label>
            <input
              type="text"
              v-model="currentSkill.name"
              placeholder="Enter skill"
              required
            />
          </div>
  
          <div class="form-group">
            <label>Proficiency Level:</label>
            <select v-model="currentSkill.proficiency" required>
              <option value="" disabled>Select proficiency level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
  
          <div class="button-group">
            <button class="btn-back" type="button" @click="goBack">Back</button>
            <button class="btn-save" type="submit">Save</button>
            <button class="btn-next" type="button" @click="goNext">Next</button>
          </div>
        </form>
      </div>
  
      <!-- List of Skills -->
      <div v-if="skills && skills.length" class="skills-list">
        <h2>Your Skills:</h2>
        <ul>
          <li v-for="skill in skills" :key="skill.id" class="skill-item">
            <div class="skill-details">
              <strong>{{ skill.name }}</strong> - {{ skill.proficiency }}
            </div>
            <div class="action-buttons">
              <button @click="editSkill(skill)" class="btn-edit">Edit</button>
              <button @click="deleteSkill(skill.id)" class="btn-delete">Delete</button>
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
  import SkillServices from '../services/SkillServices';
  import store from '../store/store';
  
  export default {
    name: "Skills",
    data() {
      return {
        currentSkill: {
          name: "",
          proficiency: "",
          userId: store.getters.getLoginUserInfo?.user_id || null,
        },
        skills: [],
        successMessage: "",
      };
    },
    mounted() {
      if (this.currentSkill.userId) {
        this.loadSkills();
      } else {
        console.error("User ID is not available on mount.");
      }
    },
    watch: {
      'currentSkill.userId': function(newVal) {
        if (newVal) {
          this.loadSkills();
        }
      }
    },
    methods: {
      async loadSkills() {
        if (!this.currentSkill.userId) {
          console.error("User ID is not available.");
          return;
        }
  
        try {
          const response = await SkillServices.getSkills(this.currentSkill.userId);
          this.skills = response.data.skills || [];
        } catch (error) {
          console.error("Error loading skills:", error);
        }
      },
      async saveSkill() {
        try {
          const response = await SkillServices.createSkill(this.currentSkill);
          if (response.data.skill_id) {
            this.successMessage = 'Your skill was saved successfully.';
            this.loadSkills();
            this.resetForm();
            setTimeout(() => {
              this.successMessage = "";
            }, 3000);
          } else {
            alert("Failed to save skill. Please try again.");
          }
        } catch (error) {
          console.error("Error saving skill:", error);
          alert("Failed to save skill. Please try again.");
        }
      },
      editSkill(skill) {
        this.currentSkill = { ...skill };
      },
      async deleteSkill(id) {
        try {
          const response = await SkillServices.deleteSkill(id);
          if (response.data.success) {
            this.successMessage = 'Skill deleted successfully.';
            this.loadSkills();
            setTimeout(() => {
              this.successMessage = "";
            }, 3000);
          }
        } catch (error) {
          console.error("Error deleting skill:", error);
          alert("Failed to delete skill. Please try again.");
        }
      },
      resetForm() {
        this.currentSkill = {
          name: "",
          proficiency: "",
          userId: store.getters.getLoginUserInfo?.user_id || null,
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
  .skills-container {
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
  
  input[type="text"], select {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
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
  