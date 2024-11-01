<script setup>
import { ref, onMounted } from 'vue'
import ResumeServices from '../services/ResumeServices'
import { useRouter } from 'vue-router'

const resumes = ref([])
const message = ref('')
const router = useRouter()

const fetchResumes = async () => {
  try {
    const response = await ResumeServices.getAllForUser() // Fetch all resumes for the user
    resumes.value = response.data
  } catch (error) {
    message.value = 'Failed to load resumes.'
    console.error(error)
  }
}

const viewResume = (resumeId) => {
  router.push({ name: 'viewResume', params: { id: resumeId } })
}

const editResume = (resumeId) => {
  router.push({ name: 'editResume', params: { id: resumeId } })
}

const deleteResume = async (resumeId) => {
  try {
    await ResumeService.delete(resumeId)
    message.value = 'Resume deleted successfully.'
    fetchResumes() // Refresh the list after deletion
  } catch (error) {
    message.value = 'Failed to delete resume.'
    console.error(error)
  }
}

onMounted(fetchResumes)
</script>

<template>
  <div>
    <h1>My Resumes</h1>
    <p>{{ message }}</p>

    <v-container>
      <v-row>
        <v-col v-for="resume in resumes" :key="resume.id" cols="12" md="6">
          <v-card>
            <v-card-title>{{ resume.title }}</v-card-title>
            <v-card-subtitle>{{ resume.description }}</v-card-subtitle>

            <v-card-actions>
              <v-btn color="primary" @click="ViewResume(resume.id)">View</v-btn>
              <v-btn color="warning" @click="EditResume(resume.id)">Edit</v-btn>
              <v-btn color="error" @click="DeleteResume(resume.id)">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
