
<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Add Education</v-toolbar-title>
      </v-toolbar>
      <br />
      <v-alert v-if="message" :type="messageType" dense>
        {{ message }}
      </v-alert>
      <br />
      <v-form ref="form" v-model="valid" lazy validation>
        <v-text-field
          v-model="education.degree"
          id="degree"
          label="Degree"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="education.fieldOfStudy"
          id="fieldOfStudy"
          label="Field of Study"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="education.institution"
          id="institution"
          label="Institution"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="education.startDate"
          id="startDate"
          label="Start Date"
          type="date"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="education.endDate"
          id="endDate"
          label="End Date"
          type="date"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="education.gpa"
          id="gpa"
          label="GPA"
          type="number"
          :rules="[rules.required]"
        />

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="saveEducation"
        >
          Save
        </v-btn>

        <v-btn color="error" class="mr-4" @click="cancel">Cancel</v-btn>
      </v-form>
    </v-container>
  </div>
</template>
//the script
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import EducationServices from "../services/ EducationServices";

// Router
const router = useRouter();

// Education object to hold current education information
const valid = ref(true);
const message = ref("Enter education data and click save");
const messageType = ref("info");

const education = ref({
  degree: "",
  fieldOfStudy: "",
  institution: "",
  startDate: "",
  endDate: "",
  gpa: null,
});

// Validation rules for form fields
const rules = {
  required: (value) => !!value || "This field is required",
};

// Fetch the userId from localStorage (assuming it is stored after login)
const currentUserId = localStorage.getItem('userId');

// Save or Add new education
const saveEducation = () => {
  if (!currentUserId) {
    message.value = "User is not authenticated or user ID is missing!";
    messageType.value = "error";
    return;
  }

  const data = {
    degree: education.value.degree,
    fieldOfStudy: education.value.fieldOfStudy,
    institution: education.value.institution,
    startDate: education.value.startDate,
    endDate: education.value.endDate,
    gpa: education.value.gpa,
    userId: currentUserId, // Use the retrieved userId
  };

  EducationServices.createEducation(data)
    .then((response) => {
      if (response && response.data) {
        message.value = "Education saved successfully!";
        messageType.value = "success";
        router.push({ name: "view" });
      } else {
        message.value = "Failed to save education. No data returned.";
        messageType.value = "error";
      }
    })
    .catch((e) => {
      message.value =
        e.response && e.response.data && e.response.data.message
          ? e.response.data.message
          : "Error saving education. Please try again.";
      messageType.value = "error";
    });
};

// Cancel action
const cancel = () => {
  router.push({ name: "view" }); // Go back to the view page
};
</script>

<style scoped>
.v-toolbar {
  background-color: #1976d2; /* Blue background */
}

.v-btn {
  margin-top: 16px;
}

.v-alert {
  margin-bottom: 16px;
  font-weight: bold;
}
</style>
