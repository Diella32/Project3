

   <!-- <template>
  <div class="interests">
    <h1 class="title">My Personal Interests</h1>
    
    <div class="interest-list">
      <ul>
        <li v-for="(interest, index) in interests" :key="index" class="interest-item">
          {{ interest }}
        </li>
      </ul>
    </div>

    
    <div class="add-interest">
      <input 
        v-model="newInterest" 
        type="text" 
        placeholder="Add a new interest" 
        @keyup.enter="addInterest"
        class="input-field"
      />
      <button @click="addInterest" class="add-button">+ Add</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Initially empty array for user to add interests dynamically
      interests: [],
      // New interest text
      newInterest: ''
    };
  },
  methods: {
    // Method to add a new interest
    addInterest() {
      if (this.newInterest.trim()) {
        this.interests.push(this.newInterest.trim()); // Add new interest
        this.newInterest = ''; // Clear input field after adding
      }
    }
  }
};
</script>
// here for change

<style scoped>
/* General style for the interests section */
.interests {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #f9f9f9; /* Light gray background */
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Title style */
.title {
  font-size: 36px;
  color: #6d2727; /* Dark gray color */
  font-weight: 600;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

/* Interest list styling */
.interest-list {
  margin-top: 20px;
}

.interest-item {
  font-size: 18px;
  color: #555555; /* Medium gray */
  margin-bottom: 12px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

/* Hover effect for each list item */
.interest-item:hover {
  transform: scale(1.05);
  background-color: #e8e8e8; /* Subtle gray background on hover */
}

/* Add interest input and button styling */
.add-interest {
  margin-top: 30px;
}

.input-field {
  padding: 10px;
  font-size: 16px;
  border-radius: 25px;
  border: 1px solid #ddd;
  outline: none;
  width: 240px;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #aaa; /* Slightly darker border on focus */
}

.add-button {
  padding: 10px 18px;
  font-size: 16px;
  background-color: #591b1b; /* Green background */
  color: white;
  border: none;
  border-radius: 25px;
  margin-left: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-button:hover {
  background-color: #672f2f; /* Slightly darker green on hover */
  transform: scale(1.05);
}
</style> -->



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
    
              <!-- Navigation Buttons -->
              <v-card-actions class="d-flex justify-space-between">

    <v-btn color="primary" @click="router.push({ name: 'enterCertifications' })">

      <v-icon left>mdi-arrow-left</v-icon>
      Previous
    </v-btn>
    <v-btn color="primary" @click="router.push({ name: 'GenerateResume' })">
      Done
      <v-icon right>mdi-arrow-right</v-icon>
    </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import interestServices from '../services/interestServices';
import store from '../store/store';
import { useRouter } from 'vue-router';


export default {
  props: {
    resumeId: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const router = useRouter();
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
      router,
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
