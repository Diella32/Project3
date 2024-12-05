<script setup>
import { ref } from "vue";


const resumeRequest = ref({
  userId: '',
  notes: '',     // Optional notes from student
  status: 'pending' // Initial status
});

// Emit events for form submission and cancellation
const emit = defineEmits(['createResumeRequest', 'cancel']);

const submitRequest = () => {
  emit('createResumeRequest', resumeRequest.value);
};
</script>

<template>
  <v-container>
    <v-card
      elevation="5"
      rounded="lg"
      width="20rem"
      style="padding-bottom: 16px; padding-left: 16px"
    >
      <v-card-title>Request Resume Review</v-card-title>
      
      <v-textarea
        v-model="resumeRequest.notes"
        label="Notes for Reviewer"
        variant="underlined"
        style="width: 90%; padding-left: 16px"
        placeholder="Add any specific concerns or areas you'd like reviewed..."
        rows="3"
      ></v-textarea>

      <v-btn
        @click="submitRequest"
        rounded="lg"
        elevation="2"
        style="
          background-color: #118acb;
          color: white;
          float: right;
          margin-right: 24px;
        "
      >
        Submit Request
      </v-btn>
      
      <v-btn
        flat
        @click="$emit('cancel')"
        rounded="lg"
        elevation="2"
        style="
          background-color: silver;
          color: black;
          float: right;
          margin-right: 16px;
        "
      >
        Cancel
      </v-btn>
    </v-card>
  </v-container>
</template> 