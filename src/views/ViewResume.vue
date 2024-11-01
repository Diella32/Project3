<script setup>
import ResumeServices from "../services/ResumeServices"
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const resume = ref({})
const message = ref("Resume Details")

const props = defineProps({
  id: {
    required: true,
  },
})

// Fetches resume data
const retrieveResume = () => {
  ResumeService.get(props.id)
    .then((response) => {
      resume.value = response.data
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error loading resume details"
    })
}

const editResume = () => {
  router.push({ name: "edit", params: { id: props.id } })
}

onMounted(() => {
  retrieveResume()
})
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Resume Details</v-toolbar-title>
      </v-toolbar>
      <v-card>
        <v-card-title>
          {{ resume.name || "Resume" }}
          <v-btn class="mx-2" color="primary" @click="editResume">Edit Resume</v-btn>
        </v-card-title>

        <v-card-text>
          <p><b>{{ message }}</b></p>

          <!-- Contact Information -->
          <section v-if="resume.contactInfo">
            <h3>Contact Information</h3>
            <p>Email: {{ resume.contactInfo.email }}</p>
            <p>Phone: {{ resume.contactInfo.phone }}</p>
            <p>Address: {{ resume.contactInfo.address }}</p>
          </section>

          <!-- Personal Links -->
          <section v-if="resume.personalLinks && resume.personalLinks.length">
            <h3>Personal Links</h3>
            <ul>
              <li v-for="link in resume.personalLinks" :key="link.id">{{ link.name }}: {{ link.url }}</li>
            </ul>
          </section>

          <!-- Education -->
          <section v-if="resume.education && resume.education.length">
            <h3>Education</h3>
            <ul>
              <li v-for="edu in resume.education" :key="edu.id">
                <strong>{{ edu.degree }}</strong> from {{ edu.institution }} ({{ edu.startYear }} - {{ edu.endYear }})
              </li>
            </ul>
          </section>

          <!-- Experience -->
          <section v-if="resume.experience && resume.experience.length">
            <h3>Experience</h3>
            <ul>
              <li v-for="exp in resume.experience" :key="exp.id">
                <strong>{{ exp.position }}</strong> at {{ exp.company }} ({{ exp.startDate }} - {{ exp.endDate }})
              </li>
            </ul>
          </section>

          <!-- Skills -->
          <section v-if="resume.skills && resume.skills.length">
            <h3>Skills</h3>
            <ul>
              <li v-for="skill in resume.skills" :key="skill.id">{{ skill.name }}</li>
            </ul>
          </section>

          <!-- Projects -->
          <section v-if="resume.projects && resume.projects.length">
            <h3>Projects</h3>
            <ul>
              <li v-for="project in resume.projects" :key="project.id">{{ project.title }}: {{ project.description }}</li>
            </ul>
          </section>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
h3 {
  margin-top: 20px;
  color: #333;
}
ul {
  list-style: none;
  padding: 0;
}
</style>
