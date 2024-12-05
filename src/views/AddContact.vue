<script setup>
import { ref, onMounted, computed } from "vue";
//import { useRouter } from "vue-router"; // Import the router for navigation
import ContactServices from "../services/ContactServices";
import store from '../store/store';
import { useRouter, useRoute } from 'vue-router';



const router = useRouter(); // Initialize the router
const contacts = ref([]);
const expandedPanel = ref(null);
const isValidating = ref(false);
const contactForms = ref([]);
const user = store.getters.getLoginUserInfo;
const userId = user.user_id;
//const router = useRouter();


// Snackbar state
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  timeout: 3000,
});

// Validation rules
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
};

// Computed property for overall validity
const isValid = computed(() => contacts.value.every(contact => contact.valid));

// New contact template
const newContactTemplate = {
  fName: "",
  lName: "",
  email: "",
  phone_number: "",
  address: "",
  userId: user.user_id,
};

// Fetch all contacts
const fetchContacts = async () => {
  try {
    const response = await ContactServices.getAllContacts(user.user_id);
    contacts.value = response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    showNotification("Failed to load contacts", "error");
  }
};


onMounted(() => {
  fetchContacts();
});

// Methods
const addNewContact = () => {
  contacts.value.push({ 
    ...newContactTemplate});
  expandedPanel.value = contacts.value.length - 1;
};

const deleteContact = async (id) => {
  isValidating.value = true;
  try {
    await ContactServices.deleteContact(userId, id);
    await fetchContacts();
    showNotification("Contact deleted successfully");
  } catch (error) {
    console.error("Error deleting contact:", error);
    showNotification("Failed to delete contact", "error");
  } finally {
    isValidating.value = false;
  }
};

const saveContact = async (index) => {
  isValidating.value = true;
  try {
    const contact = contacts.value[index];

    if (!contact.contact_id) {
      // New contact: Create on backend
      const response = await ContactServices.createContact(contact);
      contact.id = response.data.id;
    } else {
      console.log("contact");
      // Existing contact: Update on backend
      await ContactServices.updateContact(contact.contact_id, contact);
    }
    showNotification("Contact saved successfully", "success");
    expandedPanel.value = null;
  } catch (error) {
    console.error("Error saving contact:", error);
    showNotification("Failed to save contact", "error");
  } finally {
    isValidating.value = false;
  }
};

const showNotification = (text, color = "success", timeout = 3000) => {
  snackbar.value = { show: true, text, color, timeout };
};
</script>

<template>
  <div class="contacts-wrapper">
    <div class="contacts-container">
      <v-row class="fill-height ma-0" align="start" justify="center">
        <v-col cols="12" class="pa-0">
          <v-card class="contacts-card" elevation="0">
            <!-- Header -->
            <v-card-item class="text-center header-section">
              <v-card-title class="text-h2 font-weight-bold mb-4">Contacts</v-card-title>
              <v-card-subtitle class="text-h5 mb-6">Add your personal and professional contacts</v-card-subtitle>
            </v-card-item>

            <v-divider></v-divider>

            <!-- Contacts List -->
            <v-card-text class="contacts-content py-6">
              <v-container>
                <!-- Add New Contact Button -->
                <v-row justify="center" class="mb-6">
                  <v-col cols="12" md="8">
                    <v-btn color="primary" block @click="addNewContact" size="large" prepend-icon="mdi-plus">
                      Add New Contact
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- Contacts List -->
                <v-row justify="center">
                  <v-col cols="12" md="8">
                    <v-expansion-panels v-model="expandedPanel">
                      <v-expansion-panel v-for="(contact, index) in contacts" :key="contact.id || index" :disabled="isValidating">
                        <v-expansion-panel-title>
                          <span class="text-h6">{{ contact.fName || 'New Contact' }}</span>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <v-form ref="contactForms" v-model="contact.valid" @submit.prevent>
                            <!-- Contact First Name -->
                            <v-text-field v-model="contact.fName" label="First Name" :rules="[rules.required]" variant="outlined" density="comfortable" class="mb-4"></v-text-field>

                            <!-- Contact Last Name -->
                            <v-text-field v-model="contact.lName" label="Last Name" variant="outlined" density="comfortable" class="mb-4"></v-text-field>

                            <!-- Contact Email -->
                            <v-text-field v-model="contact.email" label="Email" :rules="[rules.required, rules.email]" variant="outlined" density="comfortable" class="mb-4"></v-text-field>

                            <!-- Contact Phone -->
                            <v-text-field v-model="contact.phone_number" label="Phone Number" :rules="[rules.required, rules.phoneNumber]" variant="outlined" density="comfortable" class="mb-4"></v-text-field>

                            <!-- Contact Address -->
                            <v-textarea v-model="contact.address" label="Address" variant="outlined" density="comfortable" auto-grow class="mb-4"></v-textarea>

                            <!-- Action Buttons -->
                            <v-row class="mt-4">
                              <v-col cols="6">
                                <v-btn 
                                  color="error" 
                                  block 
                                  @click="deleteContact(contact.contact_id)"
                                  :disabled="isValidating"
                                >
                                  Delete Contact
                                </v-btn>
                              </v-col>
                              <v-col cols="6">
                                <v-btn 
                                  color="success" 
                                  block 
                                  @click="saveContact(index)"
                                  :loading="isValidating"
                                >
                                  Save Contact
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-form>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

  
  
    <!-- Navigation Buttons -->
    <v-card-actions class="d-flex justify-space-between">
      <v-btn color="primary" @click="router.push({ name: 'home' })">
        <v-icon left>mdi-arrow-left</v-icon>
        Previous
      </v-btn>
      <v-btn color="primary" @click="router.push({ name: 'PersonalLinks' })">
        Next
        <v-icon right>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
    


    <!-- Notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.contacts-wrapper {
  min-height: 100vh;
  width: 100vw;
  background-color: rgb(var(--v-theme-background));
  display: flex;
  flex-direction: column;
}

.contacts-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.contacts-card {
  min-height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.header-section {
  padding-top: 4rem;
  padding-bottom: 2rem;
}

.contacts-content {
  flex: 1;
}

.d-flex {
  display: flex;
}

.justify-space-between {
  justify-content: space-between;
}
.navigation-button {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
}
</style>
