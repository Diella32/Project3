<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ContactServices from '../services/ContactServices';
import store from '../store/store'

const route = useRoute();
const contacts = ref([]);
const isLoading = ref(false);
const expandedPanel = ref(null);
const editingContact = ref(null);

// Snackbar state
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
});

// Form validation rules
const rules = {
  required: v => !!v || 'Field is required',
  email: v => /.+@.+\..+/.test(v) || 'Please enter a valid email',
};

// New contact template (updated with firstName, lastName, and address)
const newContactTemplate = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  userId: store.getters.getLoginUserInfo.user_id, // Automatically get user ID from the store
};

const fetchContacts = async () => {
  const userId = store.getters.getLoginUserInfo.user_id; // Get userId from the store
  try {
    const response = await ContactServices.getAllContacts(userId);
    contacts.value = response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    showNotification('Failed to load contacts', 'error');
  }
};

onMounted(async () => {
  await fetchContacts();
});

// Methods for CRUD operations
const addNewContact = () => {
  // Push a new contact to the array instead of replacing it
  contacts.value.push({ ...newContactTemplate });
  expandedPanel.value = contacts.value.length - 1;
  editingContact.value = contacts.value[contacts.value.length - 1];
};

const saveContact = async () => {
  if (!editingContact.value) return;

  isLoading.value = true;
  try {
    const userId = store.getters.getLoginUserInfo.user_id; // Get userId from the store
    const contactData = {
      ...editingContact.value,
      user_id: userId,
    };

    if (editingContact.value.id) {
      await ContactServices.updateContact(editingContact.value.id, contactData);
    } else {
      await ContactServices.createContact(contactData);
    }

    await fetchContacts();
    showNotification('Contact saved successfully');
    expandedPanel.value = null;
    editingContact.value = null;
  } catch (error) {
    console.error('Error saving contact:', error);
    showNotification('Failed to save contact', 'error');
  } finally {
    isLoading.value = false;
  }
};

const deleteContact = async (id) => {
  try {
    await ContactServices.deleteContact(id);
    await fetchContacts();
    showNotification('Contact deleted successfully');
  } catch (error) {
    console.error('Error deleting contact:', error);
    showNotification('Failed to delete contact', 'error');
  }
};

const editContact = (contact) => {
  editingContact.value = { ...contact };
  expandedPanel.value = contacts.value.findIndex(c => c.id === contact.id);
};

const showNotification = (text, color = 'success') => {
  snackbar.value = { show: true, text, color, timeout: 3000 };
};
</script>
<template>
  <v-card class="contacts-card">
    <v-card-item class="text-center">
      <v-icon icon="mdi-account" size="72" color="primary" class="mb-6"></v-icon>
      <v-card-title class="text-h2 font-weight-bold mb-4">Contacts</v-card-title>
    </v-card-item>

    <v-divider></v-divider>

    <v-card-text class="py-6">
      <v-container>
        <!-- Add New Contact Button -->
        <v-row justify="center" class="mb-6">
          <v-col cols="12" sm="8">
            <v-btn
              color="primary"
              block
              @click="addNewContact"
              size="large"
              prepend-icon="mdi-plus"
            >
              Add New Contact
            </v-btn>
          </v-col>
        </v-row>

        <!-- Contacts List -->
        <v-row justify="center">
          <v-col cols="12" sm="8">
            <v-expansion-panels v-model="expandedPanel">
              <v-expansion-panel
                v-for="(contact, index) in contacts"
                :key="contact.id || index"
              >
                <v-expansion-panel-title>
                  <v-row no-gutters>
                    <v-col cols="auto" class="mr-4">
                      <v-icon>mdi-account-circle</v-icon>
                    </v-col>
                    <v-col>
                      {{ contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : "New Contact" }}
                    </v-col>
                  </v-row>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <v-form @submit.prevent="saveContact">
                    <!-- First Name -->
                    <v-text-field
                      v-model="contact.firstName"
                      label="First Name"
                      :rules="[rules.required]"
                      variant="outlined"
                      class="mt-4"
                    ></v-text-field>

                    <!-- Last Name -->
                    <v-text-field
                      v-model="contact.lastName"
                      label="Last Name"
                      :rules="[rules.required]"
                      variant="outlined"
                      class="mt-4"
                    ></v-text-field>

                    <!-- Email -->
                    <v-text-field
                      v-model="contact.email"
                      label="Email"
                      :rules="[rules.required, rules.email]"
                      variant="outlined"
                      class="mt-4"
                    ></v-text-field>

                    <!-- Phone -->
                    <v-text-field
                      v-model="contact.phone"
                      label="Phone"
                      variant="outlined"
                      class="mt-4"
                    ></v-text-field>

                    <!-- Address -->
                    <v-textarea
                      v-model="contact.address"
                      label="Address"
                      variant="outlined"
                      class="mt-4"
                    ></v-textarea>

                    <!-- Save Button -->
                    <v-btn
                      color="success"
                      block
                      class="mt-4"
                      @click="saveContact"
                      :loading="isLoading"
                    >
                      Save Contact
                    </v-btn>

                    <!-- Delete Button -->
                    <v-btn
                      v-if="contact.id"
                      color="error"
                      block
                      class="mt-2"
                      @click="deleteContact(contact.id)"
                      :disabled="isLoading"
                    >
                      Delete Contact
                    </v-btn>
                  </v-form>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>

  <!-- Notifications -->
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
    {{ snackbar.text }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>
