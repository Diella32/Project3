<template>
    <div>
      <v-container>
        <v-toolbar>
          <v-toolbar-title>Contact Details</v-toolbar-title>
        </v-toolbar>
  
        <v-card>
          <v-card-text>
            <h3>{{ message }}</h3>
            <p><strong>Name:</strong> {{ contact.name }}</p>
            <p><strong>Email:</strong> {{ contact.email }}</p>
            <p><strong>Phone:</strong> {{ contact.phone }}</p>
            <p><strong>Address:</strong> {{ contact.address }}</p>
          </v-card-text>
  
          <v-card-actions>
            <v-btn color="primary" @click="editContact">Edit</v-btn>
            <v-btn color="error" @click="deleteContact">Delete</v-btn>
            <v-btn @click="goBack">Back</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import ContactServices from '../services/contactServices';
  
  const router = useRouter();
  const route = useRoute();
  
  const message = ref("Contact Details");
  const contact = ref({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
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
      })
      .catch(error => {
        message.value = "Failed to load contact details.";
        console.error(error);
      });
  };
  
  // Navigate to the edit page
  const editContact = () => {
    router.push({ name: 'contact-form', params: { id: contact.value.id } });
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
  </script>
  
  <style scoped>
  h3 {
    margin-bottom: 1rem;
  }
  p {
    margin: 0.5rem 0;
  }
  </style>
  