<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Contact Information</v-toolbar-title>
      </v-toolbar>
      <br />
      <v-alert v-if="message" :type="messageType" dense>
        {{ message }}
      </v-alert>
      <br />
      <v-form ref="form" v-model="valid" lazy validation>
        <v-text-field
          v-model="contact.fname"
          id="fname"
          label="First Name"
          :counter="50"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="contact.lname"
          id="lname"
          label="Last Name"
          :counter="50"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="contact.email"
          id="email"
          label="Email"
          :rules="[rules.required, rules.email]"
        />
        <v-text-field
          v-model="contact.phone_number"
          id="phone_number"
          label="Phone Number"
          :rules="[rules.required, rules.phoneNumber]"
        />
        <v-textarea
          v-model="contact.address"
          id="address"
          label="Address"
          :counter="150"
          :rules="[rules.optionalAddress]"
        />
        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="saveContact"
        >
          Save
        </v-btn>

        <v-btn
          v-if="contact.id"
          color="error"
          class="mr-4"
          @click="() => deleteContact(contact.id)"
        >
          Delete
        </v-btn>

        <v-btn color="error" class="mr-4" @click="cancel">Cancel</v-btn>
      </v-form>
    </v-container>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"; // Import ref and watch together here
import { useRouter } from "vue-router";
import ContactServices from '../services/ContactServices.js';
// Router
const router = useRouter();

// Contact object to hold current contact information
const valid = ref(true);
const message = ref("Enter contact data and click save");
const messageType = ref("info");

const contact = ref({
  id: null,
  fname: "",
  lname: "",
  email: "",
  phone_number: "",
  address: "",
});

// Validation rules for form fields
const rules = {
  required: (value) => !!value || "This field is required",
  email: (value) => {
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return pattern.test(value) || "Please enter a valid email";
  },
  phoneNumber: (value) => {
    const pattern = /^[0-9]{10}$/;
    return pattern.test(value) || "Please enter a valid phone number";
  },
  optionalAddress: (value) => !value || value.length >= 5 || "Address must be at least 5 characters long",
};

watch(valid, (newValue) => {
  console.log("Form valid status:", newValue); // Should log `true` if form is valid
});

// Fetch existing contact information
const fetchContact = (contactId) => {
  ContactServices.getContact(contactId)
    .then((response) => {
      if (response && response.data) {
        contact.value = response.data;
      } else {
        message.value = "Failed to load contact data.";
        messageType.value = "error";
      }
    })
    .catch((e) => {
      message.value =
        e.response && e.response.data && e.response.data.message
          ? e.response.data.message
          : "Error loading contact data. Please try again.";
      messageType.value = "error";
    });
};

const saveContact = () => {
  const data = {
    fname: contact.value.fname,
    lname: contact.value.lname,
    email: contact.value.email,
    phone_number: contact.value.phone_number,
    address: contact.value.address,
  };

  console.log('Data to be saved:', data); // Log the data being sent
  
  // Check if `data` fields are empty
  if (!data.fname || !data.lname || !data.email || !data.phone_number || !data.address) {
    message.value = "All fields must be filled out!";
    messageType.value = "error";
    return;
  }

  if (contact.value.id) {
    // Update existing contact...
  } else {
    // Add new contact
    ContactServices.createContact(data)
      .then((response) => {
        if (response && response.data) {
          contact.value.id = response.data.id;
          message.value = "Contact saved successfully!";
          messageType.value = "success";

          // Here, push to the contact-view route with the id of the newly created contact
          router.push({ name: "contact-view", params: { id: contact.value.id } });
        } else {
          message.value = "Failed to save contact. No data returned.";
          messageType.value = "error";
        }
      })
      .catch((e) => {
        message.value =
          e.response && e.response.data && e.response.data.message
            ? e.response.data.message
            : "Error saving contact. Please try again.";
        messageType.value = "error";
      });
  }
};

// Delete contact
const deleteContact = (contactId) => {
  ContactServices.deleteContact(contactId)
    .then(() => {
      message.value = "Contact deleted successfully!";
      messageType.value = "success";
      router.push({ name: "view" });
    })
    .catch((e) => {
      message.value =
        e.response && e.response.data && e.response.data.message
          ? e.response.data.message
          : "Error deleting contact. Please try again.";
      messageType.value = "error";
    });
};

// Cancel action
const cancel = () => {
  router.push({ name: 'home' });  // This navigates to the homepage
};

</script>

<style scoped>
/* Add custom styles here */
.v-toolbar {
  background-color: #1976d2;
}

.v-btn {
  margin-top: 16px;
}

.v-alert {
  margin-bottom: 16px;
  font-weight: bold;
}
</style>
// we need to adopt to similar styles!