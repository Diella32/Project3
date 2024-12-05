<template>
  <div class="basic-template max-w-4xl mx-auto p-8 bg-white">
    <!-- Header -->
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold">{{ data.name }}</h1>
      <div class="text-gray-600">
        {{ data.location }} | {{ data.phone }} | {{ data.email }} | {{ data.linkedin || 'LinkedIn/Website URL (optional)' }}
      </div>
    </div>

    <!-- Professional Summary -->
    <div v-if="data.introduction" class="mb-6">
      <h2 class="text-lg font-bold uppercase border-b-2 border-gray-300 mb-2">Professional Summary</h2>
      <p>{{ data.introduction }}</p>
    </div>

    <!-- Education Section -->
    <div class="mb-6">
      <h2 class="text-lg font-bold uppercase border-b-2 border-gray-300 mb-2">Education</h2>
      <div v-for="edu in data.education" :key="edu.id" class="mb-2">
        <strong>{{ edu.institution }}</strong>, {{ edu.location }}<br>
        <span>{{ edu.degree }}</span> ({{ edu.startDate }} - {{ edu.endDate }})<br>
        <span v-if="edu.gpa">GPA: {{ edu.gpa }}</span>
        <div v-if="edu.awards">Awards: {{ edu.awards }}</div>
        <div v-if="edu.coursework">Coursework: {{ edu.coursework }}</div>
      </div>
    </div>

    <!-- Professional Experience -->
    <div class="mb-6">
      <h2 class="text-lg font-bold uppercase border-b-2 border-gray-300 mb-2">Professional Experience</h2>
      <div v-for="exp in data.experience" :key="exp.id" class="mb-4">
        <strong>{{ exp.company }}</strong>, {{ exp.location }}<br>
        <em>{{ exp.title }}</em> ({{ exp.startDate }} - {{ exp.endDate }})<br>
        <ul class="list-disc ml-5 mt-1">
          <li v-for="(resp, index) in exp.responsibilities" :key="index">{{ resp }}</li>
        </ul>
      </div>
    </div>

    <!-- Skills Section -->
    <div v-if="data.skills && data.skills.length" class="mb-6">
      <h2 class="text-lg font-bold uppercase border-b-2 border-gray-300 mb-2">Skills</h2>
      <p>{{ data.skills.join(' | ') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.basic-template {
  font-family: Arial, sans-serif;
  line-height: 1.5;
}
.text-center {
  text-align: center;
}
.border-b-2 {
  border-bottom-width: 2px;
}
.list-disc {
  list-style-type: disc;
}
.ml-5 {
  margin-left: 1.25rem;
}
.mt-1 {
  margin-top: 0.25rem;
}
</style>
