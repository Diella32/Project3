<template>
  <div class="interests-wrapper">
    <div class="interests-container">
      <v-row class="fill-height ma-0" align="start" justify="center">
        <v-col cols="12" class="pa-0">
          <v-card class="interests-card" elevation="0">
            <!-- Header -->
            <v-card-item class="text-center header-section">
              <v-icon icon="mdi-heart" size="72" color="primary" class="mb-6"></v-icon>
              <v-card-title class="text-h2 font-weight-bold mb-4">Interests</v-card-title>
              <v-card-subtitle class="text-h5 mb-6">Add your personal interests</v-card-subtitle>
            </v-card-item>

            <v-divider></v-divider>

            <!-- Interests List -->
            <v-card-text class="interests-content py-6">
              <v-container>
                <!-- Add New Interest -->
                <v-row justify="center" class="mb-6">
                  <v-col cols="12" md="8">
                    <v-form @submit.prevent="saveInterest">
                      <v-text-field
                        v-model="interestName"
                        label="Interest Name"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="comfortable"
                        class="mb-4"
                        required
                      ></v-text-field>
                      <v-btn color="primary" block @click="saveInterest" size="large" prepend-icon="mdi-plus">
                        Add Interest
                      </v-btn>
                    </v-form>
                  </v-col>
                </v-row>

                <!-- Interests List -->
                <v-row justify="center">
                  <v-col cols="12" md="8">
                    <v-expansion-panels v-model="expandedPanel">
                      <v-expansion-panel
                        v-for="(interest, index) in interests"
                        :key="interest.interest_id || index"
                        :disabled="isValidating"
                      >
                        <v-expansion-panel-title>
                          <span class="text-h6">{{ interest.interest }}</span>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <v-row class="mt-4">
                            <v-col cols="6">
                              <v-btn
                                color="error"
                                block
                                @click="deleteInterest(interest.interest_id)"
                                :disabled="isValidating"
                              >
                                Delete Interest
                              </v-btn>
                            </v-col>
                          </v-row>
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import interestServices from '../services/interestServices';
import store from '../store/store';

export default {
  props: {
    resumeId: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const interests = ref([]);
    const interestName = ref('');
    const expandedPanel = ref(null);
    const isValidating = ref(false);

    const userId = store.getters.getLoginUserInfo.user_id;

    const rules = {
      required: (v) => !!v || 'Field is required',
    };

    const fetchInterests = async () => {
      try {
        const response = await interestServices.getAllInterests(userId);
        interests.value = response.data;
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    const saveInterest = async () => {
      try {
        await interestServices.createInterest({
          interest: interestName.value,
          user_id: userId,
        });
        interestName.value = '';
        fetchInterests();
      } catch (error) {
        console.error('Error saving interest:', error);
      }
    };

    const deleteInterest = async (interestId) => {
      try {
        await interestServices.deleteInterest({ interest_id: interestId });
        fetchInterests();
      } catch (error) {
        console.error('Error deleting interest:', error);
      }
    };

    onMounted(() => {
      fetchInterests();
    });

    return {
      interests,
      interestName,
      expandedPanel,
      isValidating,
      saveInterest,
      deleteInterest,
      fetchInterests,
      rules,
    };
  },
};
</script>

<style scoped>
.interests-wrapper {
  min-height: 100vh;
  width: 100vw;
  background-color: rgb(var(--v-theme-background));
  display: flex;
  flex-direction: column;
}

.interests-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.interests-card {
  min-height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.header-section {
  padding-top: 4rem;
  padding-bottom: 2rem;
}

.interests-content {
  flex: 1;
}

.text-center {
  text-align: center;
}
</style>
