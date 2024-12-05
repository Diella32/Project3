<template>
  <div class="skills-wrapper">
    <div class="skills-container">
      <v-row class="fill-height ma-0" align="start" justify="center">
        <v-col cols="12" class="pa-0">
          <v-card class="skills-card" elevation="0">
            <!-- Header -->
            <v-card-item class="text-center header-section">
              <v-icon icon="mdi-lightbulb" size="72" color="primary" class="mb-6"></v-icon>
              <v-card-title class="text-h2 font-weight-bold mb-4">Skills</v-card-title>
              <v-card-subtitle class="text-h5 mb-6">Highlight your key skills</v-card-subtitle>
            </v-card-item>

            <v-divider></v-divider>

            <!-- Skills List -->
            <v-card-text class="skills-content py-6">
              <v-container>
                <!-- Add New Skill Button -->
                <v-row justify="center" class="mb-6">
                  <v-col cols="12" md="8">
                    <v-btn color="primary" block @click="addNewSkill" size="large" prepend-icon="mdi-plus">
                      Add New Skill
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- Skills Expansion Panels -->
                <v-row justify="center">
                  <v-col cols="12" md="8">
                    <v-expansion-panels v-model="expandedPanel">
                      <v-expansion-panel
                        v-for="(skill, index) in skills"
                        :key="skill.skill_id || index"
                        :disabled="isValidating"
                      >
                        <v-expansion-panel-title>
                          <span class="text-h6">{{ skill.skill_name || 'New Skill' }}</span>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <v-form ref="skillForms" v-model="skill.valid" @submit.prevent>
                            <!-- Skill Name -->
                            <v-text-field
                              v-model="skill.skill_name"
                              label="Skill Name"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="comfortable"
                              class="mb-4"
                            ></v-text-field>

                            <!-- Proficiency Level -->
                            <v-select
                              v-model="skill.category"
                              label="Proficiency Level"
                              :items="proficiencyLevels"
                              :rules="[rules.required]"
                              variant="outlined"
                              density="comfortable"
                              class="mb-4"
                            ></v-select>

                            <!-- Action Buttons -->
                            <v-row class="mt-4">
                              <v-col cols="6">
                                <v-btn
                                  color="error"
                                  block
                                  @click="deleteSkill(skill.skill_id)"
                                  :disabled="isValidating"
                                >
                                  Delete Skill
                                </v-btn>
                              </v-col>
                              <v-col cols="6">
                                <v-btn
                                  color="success"
                                  block
                                  @click="validateSkill(index)"
                                  :loading="isValidating"
                                >
                                  Save Skill
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
      <v-btn color="primary" @click= "navigateToAddProjects()">
        <v-icon left>mdi-arrow-left</v-icon>
        Previous
      </v-btn>
      <v-btn color="primary" @click="router.push({ name: 'enterCertifications' })">
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

<script>
import { ref, onMounted, computed } from "vue";
import SkillServices from "../services/SkillServices";
import store from "../store/store";
import { useRouter, useRoute } from 'vue-router';




export default {
  name: "Skills",
  setup() {
    const user = store.getters.getLoginUserInfo;
    const skills = ref([]);
    const expandedPanel = ref(null);
    const isValidating = ref(false);
    const router = useRouter();

    // Snackbar state
    const snackbar = ref({
      show: false,
      text: "",
      color: "success",
      timeout: 3000,
    });

    // Validation rules
    const rules = {
      required: (v) => !!v || "Field is required",
    };

    // Proficiency Levels
    const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

    // Fetch all skills
    const fetchSkills = async () => {
      try {
        const response = await SkillServices.getSkills(user.user_id);
        skills.value = response.data;
      } catch (error) {
        console.error("Error fetching skills:", error);
        showNotification("Failed to load skills", "error");
      }
    };

    onMounted(() => {
      fetchSkills();
    });

    const navigateToAddProjects = () => {router.push({ name: 'AddProjects' })};

    // Methods
    const addNewSkill = () => {
      skills.value.push({
        skill_name: "",
        category: "",
        userId: user.user_id,
        valid: false,
      });
      expandedPanel.value = skills.value.length - 1;
    };

    const deleteSkill = async (id) => {
      isValidating.value = true;
      try {
        await SkillServices.deleteSkill(id);
        skills.value = skills.value.filter((skill) => skill.skill_id !== id);
        showNotification("Skill deleted successfully");
      } catch (error) {
        console.error("Error deleting skill:", error);
        showNotification("Failed to delete skill", "error");
      } finally {
        isValidating.value = false;
      }
    };
    

    const validateSkill = async (index) => {
      isValidating.value = true;
      try {
        const skill = skills.value[index];

        if (!skill.skill_id) {
          // New skill: Create on backend
          const response = await SkillServices.createSkill(skill);
          skill.skill_id = response.data.skill_id;
        } else {
          // Existing skill: Update on backend
          await SkillServices.updateSkill(skill.skill_id, skill);
        }
        showNotification("Skill saved successfully", "success");
        expandedPanel.value = null;
      } catch (error) {
        console.error("Error saving skill:", error);
        showNotification("Failed to save skill", "error");
      } finally {
        isValidating.value = false;
      }
    };

    const showNotification = (text, color = "success", timeout = 3000) => {
      snackbar.value = { show: true, text, color, timeout };
    };

    const goBack = () => {
      // Navigate to the previous step
    };

    const goNext = () => {
      // Navigate to the next step
    };

    return {
      router,
      skills,
      expandedPanel,
      isValidating,
      snackbar,
      rules,
      proficiencyLevels,
      addNewSkill,
      deleteSkill,
      validateSkill,
      showNotification,
      navigateToAddProjects,
    };
  },
};
</script>

<style scoped>
.skills-wrapper {
  min-height: 100vh;
  width: 100vw;
  background-color: rgb(var(--v-theme-background));
  display: flex;
  flex-direction: column;
}

.skills-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.skills-card {
  min-height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.header-section {
  padding-top: 4rem;
  padding-bottom: 2rem;
}

.skills-content {
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
