<template>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>{{ contact.id ? 'Edit Contact' : 'Add New Contact' }}</v-toolbar-title>
      </v-toolbar>
  
      <v-form v-model="valid" @submit.prevent="saveContact">
        <v-text-field 
          v-model="contact.fName"
          label="First Name"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-text-field 
          v-model="contact.lName"
          label="Last Name"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-text-field 
          v-model="contact.email"
          label="Email"
          :rules="[rules.required, rules.email]"
          required
        ></v-text-field>
        <v-text-field 
          v-model="contact.phone_number"
          label="Phone Number"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-text-field 
          v-model="contact.address"
          label="Address"
          required
        ></v-text-field>
  
        <!-- Button container with space between buttons -->
        <v-row>
          <v-col>
            <v-btn color="primary" type="submit" :disabled="!valid">
              Save
            </v-btn>
          </v-col>
          <v-col>
            <v-btn @click="cancelEdit" color="secondary">
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import ContactServices from '../services/ContactServices';
  
  const router = useRouter();
  const route = useRoute();
  
  const valid = ref(false);  // For form validation
  const contact = ref({
    id: null,
    fName: '',
    lName: '',
    email: '',
    phone_number: '',
    address: ''
  });
  
  // Validation rules
  const rules = {
    required: value => !!value || 'This field is required.',
    email: value => /.+@.+\..+/.test(value) || 'Enter a valid email.'
  };
  
  // Fetch contact data if we are editing
  onMounted(() => {
    const contactId = route.params.id;
    if (contactId) {
      fetchContact(contactId);
    }
  });
  
  // Fetch contact details for editing
  const fetchContact = (contactId) => {
    ContactServices.getContact(contactId)
      .then(response => {
        contact.value = response.data;
      })
      .catch(error => {
        console.error("Error fetching contact:", error);
      });
  };
  
  // Save the contact (create or update)
  const saveContact = () => {
    console.log("Saving contact:", contact.value); // Log to see the data being saved
  
    if (contact.value.id) {
      // Update the contact
      ContactServices.updateContact(contact.value.id, contact.value)
        .then(() => {
          console.log("Contact updated successfully.");
          router.push({ name: 'contact-view', params: { id: contact.value.id } });
        })
        .catch(error => {
          console.error("Error updating contact:", error);
        });
    } else {
      // Create a new contact
      ContactServices.createContact(contact.value)
        .then(() => {
          console.log("Contact created successfully.");
          router.push({ name: 'home' });  // Redirect to 'home' after saving
        })
        .catch(error => {
          console.error("Error creating contact:", error);
        });
    }
  };
  
  // Cancel the edit and navigate to another page (e.g., home or list)
  const cancelEdit = () => {
    router.push({ name: 'home' });  // Change 'home' to any valid route you want to navigate to
  };
  </script>
  
  <style scoped>
  /* Add any necessary styling */
  </style>
  