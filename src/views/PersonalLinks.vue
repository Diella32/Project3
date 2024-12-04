<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import PersonalLinkServices from '../services/PersonalLinkServices';
import store from '../store/store';

const router = useRouter();
const route = useRoute();
const personalLinks = ref([]);
const expandedPanel = ref(null);
const isValidating = ref(false);
const user = store.getters.getLoginUserInfo;
const userId = user.user_id;

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
  userId: user.user_id,
};

// Fetch all personal links
const fetchLinks = async () => {
  try {
    const response = await PersonalLinkServices.getAllPersonalLinks(user.user_id);
    personalLinks.value = response.data;
  } catch (error) {
    console.error('Error fetching personal links:', error);
    showNotification('Failed to load personal links', 'error');
  }
};

onMounted(() => {
  fetchLinks();
});

// Methods
const  addNewLink = () => {
  personalLinks.value.push({ ...newLinkTemplate });
  expandedPanel.value = personalLinks.value.length - 1;
};

const deleteLink = async (id) => {
  isValidating.value = true;
  try {
    await PersonalLinkServices.deletePersonalLinks(userId, id);
    await fetchLinks();
    showNotification('Link deleted successfully');
  } catch (error) {
    console.error('Error deleting link:', error);
    showNotification('Failed to delete link', 'error');
  } finally {
    isValidating.value = false;
  }
};

const saveLink = async (index) => {
  isValidating.value = true;
  try {
    const link = personalLinks.value[index];
    if (!link.link_id) {
      // New link: Create on backend
      const response = await PersonalLinkServices.createPersonalLinks(link);
      link.id = response.data.id;
    } else {
      // Existing link: Update on backend
      await PersonalLinkServices.updatePersonalLinks(link.link_id, link);
    }
    showNotification('Link saved successfully', 'success');
    expandedPanel.value = null;
  } catch (error) {
    console.error('Error saving link:', error);
    showNotification('Failed to save link', 'error');
  } finally {
    isValidating.value = false;
  }
};

const showNotification = (text, color = 'success', timeout = 3000) => {
  snackbar.value = { show: true, text, color, timeout };
};
</script>

<template>
  <div class="personal-links-wrapper">
    <div class="personal-links-container">
      <v-row class="fill-height ma-0" align="start" justify="center">
        <v-col cols="12" class="pa-0">
          <v-card class="personal-links-card" elevation="0">
            <!-- Header -->
            <v-card-item class="text-center header-section">
              <v-icon icon="mdi-link-variant" size="72" color="primary" class="mb-6"></v-icon>
              <v-card-title class="text-h2 font-weight-bold mb-4">Personal Links</v-card-title>
              <v-card-subtitle class="text-h5 mb-6">Add your social media, portfolio, and other important links</v-card-subtitle>
            </v-card-item>
            <v-divider></v-divider>

            <!-- Personal Links List -->
            <v-card-text class="personal-links-content py-6">
              <v-container>
                <!-- Add New Link Button -->
                <v-row justify="center" class="mb-6">
                  <v-col cols="12" md="8">
                    <v-btn color="primary" block @click="addNewLink" size="large" prepend-icon="mdi-plus">
                      Add New Link
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- Links List -->
                <v-row justify="center">
                  <v-col cols="12" md="8">
                    <v-expansion-panels v-model="expandedPanel">
                      <v-expansion-panel v-for="(link, index) in personalLinks" :key="link.id || index" :disabled="isValidating">
                        <v-expansion-panel-title>
                          <span class="text-h6">{{ link.url || 'New Link' }}</span>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <v-form @submit.prevent>
                            <!-- Link Type -->
                            <v-select v-model="link.type" :items="linkTypes" item-value="value" item-title="text" label="Link Type" :rules="[rules.required]"></v-select>

                            <!-- URL -->
                            <v-text-field v-model="link.url" label="URL" :rules="[rules.required, rules.url]" variant="outlined" class="mt-4"></v-text-field>

                            <!-- Action Buttons -->
                            <v-row class="mt-4">
                              <v-col cols="6">
                                <v-btn color="error" block @click="deleteLink(link.link_id)" :disabled="isValidating">
                                  Delete Link
                                </v-btn>
                              </v-col>
                              <v-col cols="6">
                                <v-btn color="success" block @click="saveLink(index)" :loading="isValidating">
                                  Save Link
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
      <v-btn color="primary" @click="router.push({ name: 'AddContact' })">
        <v-icon left>mdi-arrow-left</v-icon>
        Previous
      </v-btn>
      <v-btn color="primary" @click="router.push({ name: 'AddEducation' })">
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
.personal-links-wrapper {
  min-height: 100vh;
  width: 100vw;
  background-color: rgb(var(--v-theme-background));
  display: flex;
  flex-direction: column;
}

.personal-links-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.personal-links-card {
  min-height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.header-section {
  padding-top: 4rem;
  padding-bottom: 2rem;
}

.personal-links-content {
  flex: 1;
}

.text-center {
  text-align: center;
}

.d-flex {
  display: flex;
}

.justify-space-between {
  justify-content: space-between;
}
</style>
