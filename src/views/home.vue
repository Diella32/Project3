<template>
  <div class="home-container">
    <v-row class="fill-height ma-0" align="center" justify="center">
      <v-col cols="12" class="pa-0">
        <v-card
          class="home-card"
          elevation="0"
          variant="elevated"
        >
          <!-- Header Section -->
          <v-card-item class="text-center pb-0">
            <v-icon
              icon="mdi-file-document-outline"
              size="64"
              color="primary"
              class="mb-4"
            ></v-icon>
            <v-card-title class="text-h2 font-weight-bold mb-2">
              Resume Builder

            </v-card-title>
            <v-card-subtitle class="text-h5 mb-4">
              Create professional resumes in minutes
            </v-card-subtitle>
          </v-card-item>

          <v-divider></v-divider>

          <!-- Main Options Section -->
          <v-card-text class="pt-6">
            <v-row justify="center" class="mb-8">
              <v-col cols="12" md="5" class="px-8">
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <v-card
                      class="option-card text-center pa-8"
                      v-bind="props"
                      :elevation="isHovering ? 4 : 1"
                      :class="{ 'on-hover': isHovering }"
                      @click="goTo('add')"
                    >
                      <v-icon icon="mdi-file-plus" size="72" color="primary" class="mb-6"></v-icon>
                      <h3 class="text-h4 mb-4">Create New Resume</h3>
                      <p class="text-h6 mb-6">Build a professional resume from scratch</p>
                      <v-btn
                        color="primary"
                        variant="elevated"
                        size="x-large"
                        block
                        @click="goTo('add')"
                      >
                        Get Started
                      </v-btn>
                    </v-card>
                  </template>
                </v-hover>
              </v-col>

              <v-col cols="12" md="5" class="px-8">
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <v-card
                      class="option-card text-center pa-8"
                      v-bind="props"
                      :elevation="isHovering ? 4 : 1"
                      :class="{ 'on-hover': isHovering }"
                      @click="triggerFileInput"
                    >
                      <v-icon icon="mdi-file-document-edit" size="72" color="secondary" class="mb-6"></v-icon>
                      <h3 class="text-h4 mb-4">Use Existing Resume</h3>
                      <p class="text-h6 mb-6">Upload and edit your existing resume</p>
                      <v-btn
                        color="secondary"
                        variant="elevated"
                        size="x-large"
                        block
                        @click.stop="triggerFileInput"
                      >
                        Upload Resume
                      </v-btn>
                      <input
                        type="file"
                        ref="fileInput"
                        @change="handleFileUpload"
                        accept=".pdf,.doc,.docx,.txt"
                        style="display: none"
                      />
                    </v-card>
                  </template>
                </v-hover>
              </v-col>
            </v-row>

            <!-- File Upload Dialog -->
            <v-dialog v-model="showUploadDialog" max-width="500">
              <v-card>
                <v-card-title class="text-h5 pa-6">
                  Resume Upload
                </v-card-title>
                <v-card-text class="pa-6">
                  <div v-if="uploadStatus.file">
                    Selected file: {{ uploadStatus.file.name }}
                  </div>
                  <div v-if="uploadStatus.error" class="text-error mt-4">
                    {{ uploadStatus.error }}
                  </div>
                  <div v-if="uploadStatus.success" class="text-success mt-4">
                    File uploaded successfully!
                  </div>
                </v-card-text>
                <v-card-actions class="pa-6">
                  <v-spacer></v-spacer>
                  <v-btn
                    color="grey"
                    variant="text"
                    size="large"
                    @click="showUploadDialog = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="primary"
                    size="large"
                    @click="processUploadedFile"
                    :disabled="!uploadStatus.file || uploadStatus.processing"
                    :loading="uploadStatus.processing"
                  >
                    Continue
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-text>

          <!-- Features Section -->
          <v-divider class="mb-12"></v-divider>

          <v-card-text class="pb-12">
            <h3 class="text-h4 text-center mb-12">Why Choose ResumeApp?</h3>
            <v-row justify="center" class="px-4">
              <v-col cols="12" md="4">
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <v-card
                      class="feature-card text-center pa-6"
                      flat
                      v-bind="props"
                      :elevation="isHovering ? 4 : 0"
                      :class="{ 'on-hover': isHovering }"
                    >
                      <v-icon icon="mdi-lightning-bolt" size="48" color="primary" class="mb-4"></v-icon>
                      <h3 class="text-h5 font-weight-bold mb-4">Quick & Easy</h3>
                      <p class="text-body-1">Build your resume in minutes with our intuitive tools</p>
                    </v-card>
                  </template>
                </v-hover>
              </v-col>

              <v-col cols="12" md="4">
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <v-card
                      class="feature-card text-center pa-6"
                      flat
                      v-bind="props"
                      :elevation="isHovering ? 4 : 0"
                      :class="{ 'on-hover': isHovering }"
                    >
                      <v-icon icon="mdi-palette" size="48" color="primary" class="mb-4"></v-icon>
                      <h3 class="text-h5 font-weight-bold mb-4">Professional Design</h3>
                      <p class="text-body-1">Create stunning resumes with our professional layouts</p>
                    </v-card>
                  </template>
                </v-hover>
              </v-col>

              <v-col cols="12" md="4">
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <v-card
                      class="feature-card text-center pa-6"
                      flat
                      v-bind="props"
                      :elevation="isHovering ? 4 : 0"
                      :class="{ 'on-hover': isHovering }"
                    >
                      <v-icon icon="mdi-download" size="48" color="primary" class="mb-4"></v-icon>
                      <h3 class="text-h5 font-weight-bold mb-4">Easy Export</h3>
                      <p class="text-body-1">Download your resume in PDF format</p>
                    </v-card>
                  </template>
                </v-hover>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const fileInput = ref(null);
const showUploadDialog = ref(false);
const uploadStatus = reactive({
  file: null,
  error: null,
  success: false,
  processing: false
});

const goTo = (routeName) => {
  router.push({ name: routeName });
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      uploadStatus.error = 'Please upload a PDF, DOC, DOCX, or TXT file.';
      uploadStatus.file = null;
    } else {
      uploadStatus.file = file;
      uploadStatus.error = null;
      uploadStatus.success = false;
    }
    showUploadDialog.value = true;
  }
};

const processUploadedFile = async () => {
  if (!uploadStatus.file) return;
  
  uploadStatus.processing = true;
  uploadStatus.error = null;
  
  try {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const fileContent = e.target.result;
      
      const resumeId = 'example-id';
      
      router.push({ 
        name: 'edit',
        params: { 
          id: resumeId
        },
        query: { 
          fileContent: fileContent
        }
      });
    };
    fileReader.readAsText(uploadStatus.file);
    
    uploadStatus.success = true;
    uploadStatus.processing = false;
  } catch (error) {
    uploadStatus.error = 'Error processing file. Please try again.';
    uploadStatus.processing = false;
  }
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow-y: auto;
}

.home-card {
  min-height: 100vh;
  background: transparent;
}

.option-card {
  transition: all 0.3s ease;
  border-radius: 16px;
  cursor: pointer;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
}

.feature-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
}

.on-hover {
  transform: translateY(-8px);
}

.v-btn {
  text-transform: none;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.text-error {
  color: #ff5252;
}

.text-success {
  color: #4caf50;
}

.fill-height {
  height: 100%;
}
</style>