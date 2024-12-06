<script setup>
	const props = defineProps({
		selectedRequest: Object,
	})
</script>

<template>
	<v-card elevation="5" rounded="lg">
	      <v-container>
	        <v-card-title>Are you sure you want to close?</v-card-title>
	        <v-card-text>You have not added a comment to {{ selectedRequest.user.fName }}'s request. Are you sure you want to close it? This action is permanent.</v-card-text>
	        <v-card-actions>
	            <v-btn color="red" elevation="5" @click="$emit('handleClose')">
	                Close
	            </v-btn>
	            <v-btn flat @click="$emit('cancel')">
	                Cancel
	            </v-btn>
	        </v-card-actions>
	      </v-container>
	    </v-card>
</template>
