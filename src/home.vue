<template>
    <div class="home-container">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8">
            <v-card class="pa-4" elevation="2">
              <v-card-title class="text-h4 text-center">Welcome to ResumeApp</v-card-title>
              <v-card-subtitle class="text-center">
                Effortlessly build and manage your resumes with our professional tools.
              </v-card-subtitle>
  
              <v-divider></v-divider>
  
              <v-card-text class="text-center mt-4">
                <p>Create a new resume, manage your personal information, or view your existing resumes.</p>
              </v-card-text>
  
              <v-row justify="center" class="mt-4">
                <v-btn color="primary" @click="goTo('create-resume')">Create Resume</v-btn>
                <v-btn color="secondary" @click="goTo('view-resumes')">My Resumes</v-btn>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  const goTo = (routeName) => {
    router.push({ name: routeName });
  };
  </script>
  
  <style scoped>
  .home-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  </style>
  