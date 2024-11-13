<script setup>
import ContactServices from "../services/contactServices"; 
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(true);
// CHANGES
// Contact object to hold current contact information
const contact = ref({
  id: null,
  name: "",
  email: "",
  phone: "",
  address: "",
});
const message = ref("Enter contact data and click save");

// Function to fetch existing contact information
const fetchContact = (contactId) => {
  ContactServices.getContact(contactId)
    .then((response) => {
      contact.value = response.data;
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

// Save or Add new contact
const saveContact = () => {
  const data = {
    name: contact.value.name,
    email: contact.value.email,
    phone: contact.value.phone,
    address: contact.value.address,
  };

  if (contact.value.id) {
    // Update existing contact
    ContactServices.updateContact(contact.value.id, data)
      .then(() => {
        router.push({ name: "view" });
      })
      .catch((e) => {
        message.value = e.response.data.message;
      });
  } else {
    // Add new contact
    ContactServices.createContact(data)
      .then((response) => {
        contact.value.id = response.data.id;
        router.push({ name: "view" });
      })
      .catch((e) => {
        message.value = e.response.data.message;
      });
  }
};

// Delete contact
const deleteContact = (contactId) => {
  ContactServices.deleteContact(contactId)
    .then(() => {
      router.push({ name: "view" });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

// Cancel action
const cancel = () => {
  router.push({ name: "view" });
};
</script>

<template>
  <div>
    <v-container>
     
      <v-toolbar>
        <v-toolbar-title>Contact Information</v-toolbar-title>
      </v-toolbar>
      <br />
      <h4>{{ message }}</h4>
      <br />
      <v-form ref="form" v-model="valid" lazy validation>
       
        <v-text-field
          v-model="contact.name"
          id="name"
          :counter="50"
          label="Name"
          required
        ></v-text-field>
        <v-text-field
          v-model="contact.email"
          id="email"
          :counter="50"
          label="Email"
          required
        ></v-text-field>
        <v-text-field
          v-model="contact.phone"
          id="phone"
          :counter="15"
          label="Phone"
          required
        ></v-text-field>
        <v-text-field
          v-model="contact.address"
          id="address"
          :counter="100"
          label="Address"
          required
        ></v-text-field>

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

        
        <v-btn color="error" class="mr-4" @click="cancel"> Cancel </v-btn>
      </v-form>
    </v-container>
  </div>
</template>




