<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import PersonalLinkServices from '../services/PersonalLinkServices';
import store from '../store/store'

const route = useRoute();
const personalLinks = ref([]);
const isLoading = ref(false);
const expandedPanel = ref(null);
const editingLink = ref(null);

// Snackbar state
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
});

// Available link types
const linkTypes = [
  { value: 'github', text: 'GitHub', icon: 'mdi-github' },
  { value: 'linkedin', text: 'LinkedIn', icon: 'mdi-linkedin' },
  { value: 'portfolio', text: 'Portfolio', icon: 'mdi-web' },
  { value: 'twitter', text: 'Twitter', icon: 'mdi-twitter' },
  { value: 'other', text: 'Other', icon: 'mdi-link' },
];

// Form validation rules
const rules = {
  required: v => !!v || 'Field is required',
  url: v => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v) || 'Please enter a valid URL',
};

// New link template
const newLinkTemplate = {
  url: '',
  type: '',
  userId: store.getters.getLoginUserInfo.user_id,

};

const fetchLinks = async () => {
  const userId = store.getters.getLoginUserInfo.user_id;
  try {
    const response = await PersonalLinkServices.getAllPersonalLinks(userId);
    personalLinks.value = response.data;
  } catch (error) {
    console.error('Error fetching personalLinks:', error);
    showNotification('Failed to load personalLinks', 'error');
  }
};

onMounted(async () => {
  await fetchLinks();
});

// Methods for CRUD operations
const addNewLink = () => {
  // Push a new link to the array instead of replacing it
  personalLinks.value.push({ ...newLinkTemplate });
  expandedPanel.value = personalLinks.value.length - 1;
  editingLink.value = personalLinks.value[personalLinks.value.length - 1];
};

const saveLink = async () => {
  if (!editingLink.value) return;
  
  isLoading.value = true;
  try {
    const userId = store.getters.getLoginUserInfo.user_id;
    const linkData = {
      ...editingLink.value,
      user_id: userId
    };

    if (editingLink.value.id) {
      await PersonalLinkServices.updatePersonalLinks(editingLink.value.id, linkData);
    } else {
      await PersonalLinkServices.createPersonalLinks(linkData);
    }

    await fetchLinks();
    showNotification('Link saved successfully');
    expandedPanel.value = null;
    editingLink.value = null;
  } catch (error) {
    console.error('Error saving link:', error);
    showNotification('Failed to save link', 'error');
  } finally {
    isLoading.value = false;
  }
};

const deleteLink = async (id) => {
  try {
    await PersonalLinkServices.deletePersonalLinks(id);
    await fetchLinks();
    showNotification('Link deleted successfully');
  } catch (error) {
    console.error('Error deleting link:', error);
    showNotification('Failed to delete link', 'error');
  }
};

const editLink = (link) => {
  editingLink.value = { ...link };
  expandedPanel.value = personalLinks.value.findIndex(l => l.id === link.id);
};

const showNotification = (text, color = 'success') => {
  snackbar.value = { show: true, text, color, timeout: 3000 };
};
</script>

<template>
  <v-card class="personal-links-card">
    <v-card-item class="text-center">
      <v-icon icon="mdi-link-variant" size="72" color="primary" class="mb-6"></v-icon>
      <v-card-title class="text-h2 font-weight-bold mb-4">Personal Links</v-card-title>
      <v-card-subtitle class="text-h5 mb-6">
        Add your social media, portfolio, and other important links
      </v-card-subtitle>
    </v-card-item>

    <v-divider></v-divider>

    <v-card-text class="py-6">
      <v-container>
        <!-- Add New Link Button -->
        <v-row justify="center" class="mb-6">
          <v-col cols="12" sm="8">
            <v-btn
              color="primary"
              block
              @click="addNewLink"
              size="large"
              prepend-icon="mdi-plus"
            >
              Add New Link
            </v-btn>
          </v-col>
        </v-row>

        <!-- Links List -->
        <v-row justify="center">
          <v-col cols="12" sm="8">
            <v-expansion-panels v-model="expandedPanel">
              <v-expansion-panel
                v-for="(link, index) in personalLinks"
                :key="link.id || index"
              >
                <v-expansion-panel-title>
                  <v-row no-gutters>
                    <v-col cols="auto" class="mr-4">
                      <v-icon :icon="linkTypes.find(t => t.value === link.type)?.icon || 'mdi-link'"></v-icon>
                    </v-col>
                    <v-col>
                      {{ link.url || "new link" }}
                    </v-col>
                  </v-row>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <v-form @submit.prevent="saveLink">
                    <!-- Link Type -->
                    <v-select
                      v-model="link.type"
                      :items="linkTypes"
                      item-value="value"
                      item-title="text"
                      label="Link Type"
                      :rules="[rules.required]"
                    ></v-select>

                    <!-- URL -->
                    <v-text-field
                      v-model="link.url"
                      label="URL"
                      :rules="[rules.required, rules.url]"
                      variant="outlined"
                      class="mt-4"
                    ></v-text-field>

                    <!-- Save Button -->
                    <v-btn
                      color="success"
                      block
                      class="mt-4"
                      @click="saveLink"
                      :loading="isLoading"
                    >
                      Save Link
                    </v-btn>

                    <!-- Delete Button -->
                    <v-btn
                      v-if="link.id"
                      color="error"
                      block
                      class="mt-2"
                      @click="deleteLink(link.id)"
                      :disabled="isLoading"
                    >
                      Delete Link
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