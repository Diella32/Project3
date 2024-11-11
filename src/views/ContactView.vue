<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Contact Details</v-toolbar-title>
      </v-toolbar>

      <v-card>
        <v-card-text>
          <h3 v-if="loading">Loading...</h3>
          <h3 v-else>{{ message }}</h3>
          <p v-if="!loading"><strong>Name:</strong> {{ contact.fName }} {{ contact.lName }}</p>
          <p v-if="!loading"><strong>Email:</strong> {{ contact.email }}</p>
          <p v-if="!loading"><strong>Phone:</strong> {{ contact.phone_number }}</p>
          <p v-if="!loading"><strong>Address:</strong> {{ contact.address }}</p>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="editContact">Edit</v-btn>
          <v-btn color="error" @click="confirmDelete">Delete</v-btn> <!-- Delete button stays red -->
          <v-btn color="black" @click="goBack">Back</v-btn> <!-- Back button color set to black -->
          <!-- Next button for Add Education -->
          <v-btn color="black" @click="goToAddEducation">Next</v-btn> <!-- Next button color set to black -->
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ContactServices from '../services/ContactServices.js'; // Ensure correct path

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const message = ref("Contact Details");
const contact = ref({
  id: null,
  fName: "",  // First Name
  lName: "",  // Last Name
  email: "",
  phone_number: "",  // Phone Number
  address: "",  // Address
});

// Fetch contact details when the component mounts
onMounted(() => {
  const contactId = route.params.id;
  if (contactId) {
    fetchContact(contactId);
  }
});

const fetchContact = (contactId) => {
  ContactServices.getContact(contactId)
    .then(response => {
      contact.value = response.data;
      loading.value = false; // Data loaded, hide loading message
    })
    .catch(error => {
      message.value = "Failed to load contact details.";
      loading.value = false; // Hide loading message
      console.error(error);
    });
};

// Navigate to the edit page
const editContact = () => {
  router.push({ name: 'contact-form', params: { id: contact.value.id } });
};

// Confirm before deleting the contact
const confirmDelete = () => {
  if (confirm("Are you sure you want to delete this contact?")) {
    deleteContact();
  }
};

// Delete the contact and go back
const deleteContact = () => {
  ContactServices.deleteContact(contact.value.id)
    .then(() => {
      router.push({ name: 'resumes' });  // or another appropriate route
    })
    .catch(error => {
      message.value = "Failed to delete contact.";
      console.error(error);
    });
};

// Go back to the previous view
const goBack = () => {
  router.push({ name: 'resumes' });  // or another appropriate route
};

// Navigate to Add Education page
const goToAddEducation = () => {
  router.push({ name: 'addEducation' });
};
</script>

<style scoped>
h3 {
  margin-bottom: 1rem;
}
p {
  margin: 0.5rem 0;
}
</style>
