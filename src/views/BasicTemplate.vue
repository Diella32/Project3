<template>
    <div class="create-resume">
      <v-container fluid class="pa-0">
        <v-card class="mb-4">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Create Resume</v-toolbar-title>
          </v-toolbar>
        </v-card>
  
        <div class="resume-layout">
          <!-- Template Selection Sidebar -->
          <v-card class="template-sidebar">
            <v-card-title class="text-h6">Select a Template</v-card-title>
            <div class="templates-grid">
              <v-card
                v-for="template in templates"
                :key="template.id"
                :class="{'template-card': true, 'selected': selectedTemplateId === template.id}"
                @click="selectTemplate(template.id)"
                elevation="2"
                hover
              >
                <img
                  :src="template.image"
                  :alt="template.name"
                  class="template-thumbnail"
                />
                <v-card-text class="template-info">
                  <div class="text-subtitle-2 font-weight-bold">{{ template.name }}</div>
                </v-card-text>
              </v-card>
            </div>
          </v-card>
  
          <!-- Main Content Area -->
          <div class="main-content" :class="{'has-template': selectedTemplateId}">
            <v-card class="form-card mb-4">
              <v-card-title class="text-h6">Enter Resume Details</v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="resume.name"
                    label="Resume Name"
                    required
                    :rules="[v => !!v || 'Resume name is required']"
                    class="mb-4"
                  ></v-text-field>
  
                  <v-textarea
                    v-model="resume.introduction"
                    label="Introduction"
                    rows="5"
                    auto-grow
                    class="mb-6"
                  ></v-textarea>
  
                  <div class="d-flex">
                    <v-btn
                      color="primary"
                      size="large"
                      class="me-4"
                      :disabled="!valid"
                      @click="saveResume"
                    >
                      Save and Continue
                    </v-btn>
  
                    <v-btn
                      color="error"
                      size="large"
                      variant="outlined"
                      @click="cancel"
                    >
                      Cancel
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
  
            <!-- Preview Selected Template -->
            <div v-if="selectedTemplateId" class="resume-preview">
              <h2 class="text-lg font-bold">Template Preview</h2>
              <component :is="getTemplateComponent(selectedTemplateId)" :data="resumeData"></component>
            </div>
  
            <v-card v-else class="select-prompt">
              <v-card-text class="text-center pa-8">
                <v-icon size="64" color="primary" class="mb-4">mdi-file-document-outline</v-icon>
                <h3 class="text-h5 mb-2">Select a Template</h3>
                <p class="text-body-1">Choose a template from the left to get started</p>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-container>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import BasicTemplate from './templates/BasicTemplate.vue';
  import ModernTemplate from './templates/ModernTemplate.vue';
  import AcademicTemplate from './templates/AcademicTemplate.vue';
  import CreativeTemplate from './templates/CreativeTemplate.vue';
  import ResumeServices from '../services/ResumeServices.js';
  import Utils from '../config/utils.js';
  
  const router = useRouter();
  const valid = ref(false);
  const user = Utils.getStore('user');
  const resume = ref({
    id: null,
    name: '',
    introduction: '',
    template: null,
    user_id: user.userId,
  });
  const selectedTemplateId = ref(null);
  const templates = ref([
    { id: 1, name: 'Basic Professional', image: '/template1.png' },
    { id: 2, name: 'Modern Minimal', image: '/template2.png' },
    { id: 3, name: 'Creative Portfolio', image: '/template3.png' },
    { id: 4, name: 'Executive Brief', image: '/template4.png' },
  ]);
  
  const selectTemplate = (id) => {
    selectedTemplateId.value = id;
    resume.value.template = id;
  };
  
  const getTemplateComponent = (id) => {
    switch (id) {
      case 1:
        return BasicTemplate;
      case 2:
        return ModernTemplate;
      case 3:
        return AcademicTemplate;
      case 4:
        return CreativeTemplate;
      default:
        return BasicTemplate;
    }
  };
  
  const saveResume = async () => {
    try {
      const data = {
        name: resume.value.name,
        introduction: resume.value.introduction,
        template: resume.value.template,
        user_id: user.userId,
      };
  
      const response = await ResumeServices.create(data);
      if (response?.data?.id) {
        router.push({ name: 'add-contact-info', params: { resumeId: response.data.id } });
      } else {
        throw new Error('Failed to create resume');
      }
    } catch (e) {
      console.error('Error creating resume:', e);
    }
  };
  
  const cancel = () => {
    router.push({ name: 'ResumeList' });
  };
  </script>
  
  <style scoped>
  .create-resume {
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  .resume-layout {
    display: flex;
    gap: 24px;
    padding: 0 16px;
  }
  
  .template-sidebar {
    width: 300px;
    flex-shrink: 0;
    height: calc(100vh - 120px);
    overflow-y: auto;
    padding: 16px;
  }
  
  .templates-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
  }
  
  .template-card {
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
  }
  
  .template-card:hover {
    transform: translateY(-2px);
  }
  
  .template-card.selected {
    border-color: var(--v-primary-base);
    background-color: rgba(var(--v-primary-base), 0.05);
  }
  
  .template-thumbnail {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
  
  .template-info {
    padding: 8px;
  }
  
  .main-content {
    flex-grow: 1;
    transition: all 0.3s ease;
    max-width: calc(100% - 324px);
  }
  
  .resume-preview {
    margin-top: 24px;
  }
  
  .select-prompt {
    margin-top: 64px;
  }
  
  @media (max-width: 960px) {
    .resume-layout {
      flex-direction: column;
    }
  
    .template-sidebar {
      width: 100%;
      height: auto;
      max-height: 300px;
    }
  
    .templates-grid {
      flex-direction: row;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding-bottom: 16px;
    }
  
    .template-card {
      min-width: 200px;
    }
  
    .main-content {
      max-width: 100%;
    }
  }
  </style>
  