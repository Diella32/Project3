<script setup>
const props = defineProps({
  selectedRequest: Object,  // Changed from selectedResume to selectedRequest
})

const comment = ref('')

const emit = defineEmits(['addComment', 'cancel'])

const handleSubmit = () => {
  if (!comment.value.trim()) return
  
  emit('addComment', {
    content: comment.value,
    createdAt: new Date(),
    requestId: props.selectedRequest.id,  // Changed from resumeId to requestId
    resumeId: props.selectedRequest.resume.id  // Added reference to the resume through the request
  })
  
  comment.value = ''
}
</script>

<template>
  <v-card elevation="5" rounded="lg">
    <v-container>
      <v-card-title>Add Comment to {{ selectedRequest.user.fName }}'s Resume Request</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="comment"
          label="Comment"
          placeholder="Enter your comment about this resume request..."
          rows="4"
          auto-grow
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" elevation="5" @click="handleSubmit">
          Submit
        </v-btn>
        <v-btn flat @click="$emit('cancel')">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-container>
  </v-card>
</template>
