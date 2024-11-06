<script setup>
import { ref, onMounted } from 'vue'
import ResumeServices from '../services/ResumeServices'
import { useRouter, useRoute } from 'vue-router'

const resume = ref({
  title: '',
  description: '',
})
const message = ref('')
const route = useRoute()
const router = useRouter()
const resumeId = route.params.id

const fetchResume = async () => {
  try {
    const response = await ResumeServices.get(resumeId)
    resume.value = response.data
  } catch (error) {
    message.value = 'Failed to load resume.'
    console.error(error)
  }
}

const saveResume = async () => {
  try {
    await ResumeServices.update(resumeId, resume.value)
    message.value = 'Resume updated successfully.'
    router.push({ name: 'resumeList' }) // Redirect to resume list after saving
  } catch (error) {
    message.value = 'Failed to update resume.'
    console.error(error)
  }
}

const cancelEdit = () => {
  router.push({ name: 'resumeList' })
}

onMounted(fetchResume)
</script>

<template>
  <div>
    <h1>Edit Resume</h1>
    <p>{{ message }}</p>

    <v-container>
      <v-form ref="form" lazy-validation>
        <v-text-field
          v-model="resume.title"
          label="Resume Title"
          required
        ></v-text-field>
        <v-textarea
          v-model="resume.description"
          label="Resume Description"
          required
        ></v-textarea>

        <v-btn color="success" @click="saveResume">Save</v-btn>
        <v-btn color="error" @click="cancelEdit">Cancel</v-btn>
      </v-form>
    </v-container>
  </div>
</template>
