<template>
  <v-container class="resume-list">
    <v-row class="mb-6" align="center">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold">My Resumes</h1>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
      </v-col>
    </v-row>

    <!-- Alert for messages -->
    <v-alert
      v-if="message"
      :color="message.includes('Failed') ? 'error' : 'success'"
      variant="tonal"
      closable
      class="mb-4"
    >
      {{ message }}
    </v-alert>

    <!-- Empty state -->
    <v-card
      v-if="!resumes.length"
      class="text-center pa-6"
      variant="outlined"
    >
      <v-icon
        icon="mdi-file-document-outline"
        size="64"
        color="grey-lighten-1"
        class="mb-4"
      ></v-icon>
      <h3 class="text-h6 mb-2">No resumes yet</h3>
      <p class="text-body-1 text-grey-darken-1 mb-4">
        Create your first resume to get started
      </p>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="router.push({ name: 'add' })"
      >
        Create New Resume
      </v-btn>
    </v-card>

    <!-- Resume list -->
    <v-row v-else>
      <v-col v-for="resume in resumes" :key="resume.id" cols="12" md="6" lg="4">
        <v-card
          class="h-100"
          elevation="2"
          :loading="resume.isLoading"
        >
          <v-card-title class="d-flex align-center">
            {{ resume.title }}
            <v-chip
              v-if="resume.status"
              size="small"
              class="ml-2"
              :color="getStatusColor(resume.status)"
            >
              {{ resume.status }}
            </v-chip>
          </v-card-title>
          
          <v-card-subtitle>
            Last updated: {{ new Date(resume.updatedAt).toLocaleDateString() }}
          </v-card-subtitle>

          <v-card-text>
            <p class="text-body-2">{{ resume.description || 'No description provided' }}</p>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              variant="text"
              color="primary"
              @click="viewResume(resume.id)"
              :disabled="resume.isLoading"
            >
              View
            </v-btn>
            <v-btn
              variant="text"
              color="warning"
              @click="editResume(resume.id)"
              :disabled="resume.isLoading"
            >
              Edit
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              color="error"
              @click="confirmDelete(resume)"
              :disabled="resume.isLoading"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          Delete Resume
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ selectedResume?.title }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showDeleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="deleteResume(selectedResume?.id)"
            :loading="isDeleting"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ResumeServices from '../services/ResumeServices'
import { useRouter } from 'vue-router'

const router = useRouter()
const resumes = ref([])
const message = ref('')
const showDeleteDialog = ref(false)
const selectedResume = ref(null)
const isDeleting = ref(false)

const fetchResumes = async () => {
  try {
    const response = await ResumeServices.getAllForUser()
    resumes.value = response.data.map(resume => ({
      ...resume,
      isLoading: false
    }))
  } catch (error) {
    message.value = 'Failed to load resumes.'
    console.error('Error fetching resumes:', error)
  }
}

const viewResume = (resumeId) => {
  router.push({ name: 'viewResume', params: { id: resumeId } })
}

const editResume = (resumeId) => {
  router.push({ name: 'editResume', params: { id: resumeId } })
}

const confirmDelete = (resume) => {
  selectedResume.value = resume
  showDeleteDialog.value = true
}

const deleteResume = async (resumeId) => {
  if (!resumeId) return
  
  isDeleting.value = true
  const resumeIndex = resumes.value.findIndex(r => r.id === resumeId)
  if (resumeIndex !== -1) {
    resumes.value[resumeIndex].isLoading = true
  }
  
  try {
    await ResumeServices.delete(resumeId)
    message.value = 'Resume deleted successfully.'
    await fetchResumes() // Refresh the list after deletion
  } catch (error) {
    message.value = 'Failed to delete resume.'
    console.error('Error deleting resume:', error)
    if (resumeIndex !== -1) {
      resumes.value[resumeIndex].isLoading = false
    }
  } finally {
    isDeleting.value = false
    showDeleteDialog.value = false
    selectedResume.value = null
  }
}

const getStatusColor = (status) => {
  const statusColors = {
    draft: 'grey',
    published: 'success',
    archived: 'warning'
  }
  return statusColors[status.toLowerCase()] || 'grey'
}

onMounted(fetchResumes)
</script>

<style scoped>
.resume-list {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-4px);
}
</style>