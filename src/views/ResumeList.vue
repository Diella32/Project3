<template>
  <v-container class="resume-list">
    <v-row class="mb-8" align="center">
      <v-col cols="12" sm="6">
        <h1 class="text-h4 font-weight-bold primary--text">My Resumes</h1>
      </v-col>
      <v-col cols="12" sm="6" class="text-sm-right">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'add' })" elevation="2">
          Create New Resume
        </v-btn>
      </v-col>
    </v-row>

    <!-- Alert for messages -->
    <v-alert v-if="message" :color="message.includes('Failed') ? 'error' : 'success'" variant="tonal" closable class="mb-6">
      {{ message }}
    </v-alert>

    <!-- Display message when no resumes are available -->
    <v-card v-if="!resumes.length" class="text-center pa-8" variant="outlined">
      <v-icon icon="mdi-file-document-outline" size="72" color="grey-lighten-1" class="mb-4"></v-icon>
      <h3 class="text-h5 mb-3">No resumes yet</h3>
      <p class="text-body-1 text-grey-darken-1 mb-6">
        Start building your professional profile by creating your first resume
      </p>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'add' })" size="large">
        Create Your First Resume
      </v-btn>
    </v-card>

    <!-- List of resumes -->
    <v-row v-else>
      <v-col v-for="(resume, index) in resumes" :key="resume.resume_id" cols="12" sm="6" lg="4">
        <v-card class="resume-card" style="min-height: 250px; width: 100%;" :loading="resume.isLoading">
          <v-card-item>
            <v-card-title class="text-h6 mb-2">{{ resume.title }}</v-card-title>
            <v-card-subtitle>
              Last updated: {{ new Date(resume.updatedAt).toLocaleDateString() }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <p class="text-truncate">{{ resume.introduction || 'No introduction provided' }}</p>
            <v-chip class="mt-2" :color="getStatusColor(resume.status)" size="small">
              {{ resume.status }}
            </v-chip>
          </v-card-text>

          <v-divider></v-divider>

          <!-- Actions for each resume -->
          <v-card-actions>
            <v-btn
              variant="text"
              color="primary"
              @click="viewResume(index)"
              :disabled="resume.isLoading"
            >
              <v-icon start>mdi-eye</v-icon>
              View
            </v-btn>
            <v-btn
              variant="text"
              color="warning"
              @click="editResume(resume.resume_id)"
              :disabled="resume.isLoading"
            >
              <v-icon start>mdi-pencil</v-icon>
              Edit
            </v-btn>
            <v-btn
              variant="text"
              color="success"
              @click="requestReview(resume.resume_id)"
              :disabled="resume.isLoading || resume.status === 'Under Review'"
            >
              <v-icon start>mdi-account-check-outline</v-icon>
               Review
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              color="error"
              @click="openDeleteDialog(resume)"
              :disabled="resume.isLoading"
            >
              <v-icon start>mdi-delete</v-icon>
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
          <v-btn color="grey-darken-1" variant="text" @click="showDeleteDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="deleteResume(selectedResume?.resume_id)"
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ResumeServices from '../services/ResumeServices';
import RequestServices from '../services/RequestServices';
import store from '../store/store';

const router = useRouter();
const resumes = ref([]);
const message = ref('');
const user = store.getters.getLoginUserInfo;
const userId = user.user_id;

const showDeleteDialog = ref(false);
const selectedResume = ref(null);
const isDeleting = ref(false);

// Function to fetch resumes and assign them to resumes array
const fetchResumes = async () => {
  try {
    const response = await ResumeServices.getAllForUser(user.user_id);
    resumes.value = response.data.map((resume) => ({
      ...resume,
      isLoading: false,
    }));
  } catch (error) {
    message.value = 'Failed to load resumes.';
    console.error('Error fetching resumes:', error);
  }
};

// Function to get the status color
const getStatusColor = (status) => {
  const statusColors = {
    Draft: 'grey',
    'In Progress': 'orange',
    Complete: 'green',
    Published: 'blue',
  };
  return statusColors[status] || 'grey'; // Default to grey if status is not found
};

// Function to view a selected resume
const viewResume = (index) => {
  const resume = resumes.value[index];
  if (resume && resume.resume_id) {
    router.push({ name: 'view', params: { id: resume.resume_id } });
  } else {
    console.error('Resume ID is undefined or resume not found');
  }
};

// Function to edit a selected resume
const editResume = (resumeId) => {
  router.push({ name: 'edit', params: { id: resumeId } });
};

// Function to request review for a resume
const requestReview = async (resumeId) => {
  try {
    const resume = resumes.value.find((r) => r.resume_id === resumeId);
    if (resume) {
      resume.isLoading = true; // Show loading state
      await RequestServices.create({ resume_id: resumeId });
      resume.status = 'Under Review'; // Update status locally
      message.value = 'Review request sent successfully.';
    }
  } catch (error) {
    message.value = 'Failed to send review request.';
    console.error('Error requesting review:', error);
  } finally {
    const resume = resumes.value.find((r) => r.resume_id === resumeId);
    if (resume) resume.isLoading = false; // Reset loading state
  }
};

// Function to open the delete dialog
const openDeleteDialog = (resume) => {
  selectedResume.value = resume;
  showDeleteDialog.value = true;
};

// Function to delete a selected resume
const deleteResume = async (resumeId) => {
  try {
    isDeleting.value = true;
    await ResumeServices.delete(resumeId);
    resumes.value = resumes.value.filter((resume) => resume.resume_id !== resumeId);
    message.value = 'Resume deleted successfully.';
  } catch (error) {
    message.value = 'Failed to delete resume.';
    console.error('Error deleting resume:', error);
  } finally {
    isDeleting.value = false;
    showDeleteDialog.value = false;
  }
};

onMounted(fetchResumes);
</script>
