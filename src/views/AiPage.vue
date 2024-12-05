<template>
    <div class="container">
      <h2>Resume Matching Tool</h2>
      <form @submit.prevent="analyzeResume">
        <textarea v-model="resume" placeholder="Paste your resume here..." rows="8"></textarea>
        <textarea v-model="jobDescription" placeholder="Paste the job description here..." rows="8"></textarea>
        <button type="submit">Analyze</button>
      </form>
      <!-- AI -->
      <div v-if="output" class="output">
        <pre>{{ output }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        resume: "",
        jobDescription: "",
        output: "",
      };
    },
    methods: {
      async analyzeResume() {
        const API_KEY = "BKJgdiy66uXjXUsHSfJ5frHM2RbbkMVi9PdN5YFD"; // Your Cohere API Key
  
        this.output = "Analyzing...";
  
        try {
          const response = await fetch("https://api.cohere.ai/v1/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
              model: "command-r-08-2024",
              message: `Compare the following resume and job description. Provide a match percentage and actionable recommendations to improve the resume for this job.
              Resume:
              ${this.resume}
              Job Description:
              ${this.jobDescription}`,
              temperature: 0.3,
            }),
          });
  
          const data = await response.json();
          if (data.generations && data.generations[0].text) {
            this.output = data.generations[0].text;
          } else {
            this.output = "Failed to analyze. Please try again.";
          }
        } catch (error) {
          this.output = `Error: ${error.message}`;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your CSS here */
  .container {
    max-width: 600px;
    margin: auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  textarea {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  button {
    background-color: #5c67f2;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #4856c7;
  }
  .output {
    margin-top: 20px;
    padding: 10px;
    background-color: #e8f7e9;
    border: 1px solid #c2e2c5;
    border-radius: 4px;
  }
  </style>
  
  