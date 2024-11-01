<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Create Resume</v-toolbar-title>
      </v-toolbar>
      
      <v-row>
        <v-col cols="4">
          <h4>Select a Template</h4>
          <div class="template-gallery">
            <v-img
              v-for="(template, index) in templates"
              :key="index"
              :src="template.src"
              class="template-image"
              @click="selectTemplate(index)"
            ></v-img>
          </div>
        </v-col>
        
        <v-col cols="8">
          <h4>Resume Details</h4>
          <v-form ref="form" v-model="valid" lazy validation>
            <v-text-field
              v-model="resume.resume_name"
              id="resume_name"
              :counter="50"
              label="Resume Name"
              required
            ></v-text-field>
            
            <v-textarea
              v-model="resume.introduction"
              id="introduction"
              label="Introduction"
              rows="3"
            ></v-textarea>

            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="saveResume"
            >
              Save
            </v-btn>

            <v-btn color="error" class="mr-4" @click="cancel">Cancel</v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
// Your existing setup code here
</script>

<style scoped>
.template-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.template-image {
  width: 100%;  /* Adjust width as necessary */
  max-width: 200px;  /* Limit maximum width */
  height: auto;  /* Maintain aspect ratio */
  cursor: pointer;  /* Show pointer on hover */
  margin: 10px 0;  /* Add some space between images */
}
</style>
