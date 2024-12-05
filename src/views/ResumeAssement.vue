<template>
  <div>
    <h1>Resume Assessment</h1>
    <form @submit.prevent="submitAssessment">
      <textarea v-model="resumeText" placeholder="Paste your resume here"></textarea>
      <textarea v-model="jobDescription" placeholder="Paste the job description here"></textarea>
      <button type="submit">Assess Resume</button>
    </form>
    <div v-if="assessmentResult">
      <h2>Assessment Result</h2>
      <p>{{ assessmentResult }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      resumeText: '',
      jobDescription: '',
      assessmentResult: null
    };
  },
  methods: {
    async submitAssessment() {
      try {
        const response = await axios.post('/api/assess-resume', {
          resumeText: this.resumeText,
          jobDescription: this.jobDescription
        });
        this.assessmentResult = response.data.assessment;
      } catch (error) {
        console.error("Error during resume assessment", error);
      }
    }
  }
};
</script>

<style>
/* Add your custom styles here */
</style>
