<script setup>
import ocLogo from "/oc-logo-white.png";
import { ref, onMounted, computed } from "vue";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";
import { useRouter } from "vue-router";

const router = useRouter();

const user = ref(null);
const title = ref("ResumeApp");
const initials = ref("");
const name = ref("");
const logoURL = ref("");

// Add computed properties for role checks
const isAdmin = computed(() => user.value?.role === 'admin');
const isStudent = computed(() => user.value?.role === 'student');

const resetMenu = () => {
  user.value = null;
  user.value = Utils.getStore("user");
  if (user.value) {
    initials.value = user.value.fName[0] + user.value.lName[0];
    name.value = user.value.fName + " " + user.value.lName;
  }
};

const adminActions = [
  {
    title: "User Management",
    component: "adminUserManager",
  },
  {
    title: "Requests",
    component: "adminRequests",
  },
];

const logout = () => {
  AuthServices.logoutUser(user.value)
    .then((response) => {
      console.log(response);
      Utils.removeItem("user");
      localStorage.removeItem('user');
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const navigateTo = (componentName) => {
  router.push({ name: componentName });
};

onMounted(() => {
  logoURL.value = ocLogo;
  resetMenu();
});
</script>

<template>
  <div>
    <v-app-bar app>
      <router-link :to="{ name: 'home' }">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
        ></v-img>
      </router-link>
      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="user">
        <!-- Show to all logged in users -->
        <v-btn class="mx-2" :to="{ name: 'home' }"> Home </v-btn>
        
        <!-- Show only to students -->
        <v-btn v-if="isStudent" class="mx-2" :to="{ name: 'resumes' }"> 
          My Resumes 
        </v-btn>
        
        <!-- Show only to admins -->
        <v-btn v-if="isAdmin" class="mx-2" :to="{ name: 'admin' }"> 
          Admin 
          <v-menu activator="parent" open-on-hover>
            <v-list>
              <v-list-item
                v-for="(item, index) in adminActions"
                :key="index"
                :value="index"
                @click="navigateTo(item.component)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu></v-btn>
      </div>
      <v-menu bottom min-width="200px" rounded offset-y v-if="user">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon x-large>
            <v-avatar v-if="user" color="secondary">
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="secondary" class="mt-2 mb-2">
                <span class="accent--text font-weight-bold">{{ initials }}</span>
              </v-avatar>
              <h3>{{ name }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>
