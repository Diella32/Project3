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
        <v-btn class="mx-2" @click="navigateTo('home')">
          HOME
        </v-btn>
        
        <v-btn class="mx-2" @click="navigateTo('resumes')">
          MY RESUMES
        </v-btn>
        
        <v-btn 
          v-if="isAdmin"
          class="mx-2"
        >
          ADMIN
          <v-menu activator="parent">
            <v-list>
              <v-list-item @click="navigateTo('adminUserManager')">
                <v-list-item-title>User Management</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navigateTo('adminRequests')">
                <v-list-item-title>Requests</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>

        <v-menu bottom min-width="200px" rounded offset-y>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon>
              <v-avatar color="secondary">
                <span class="text-white">{{ initials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar color="secondary">
                  <span class="text-white">{{ initials }}</span>
                </v-avatar>
                <h3>{{ name }}</h3>
                <p class="text-caption mt-1">
                  {{ user.email }}
                </p>
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text @click="logout">
                  Logout
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
  </div>
</template>

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

const isAdmin = computed(() => {
  return user.value && (user.value.role === 'admin' || user.value.isAdmin);
});

const resetMenu = () => {
  user.value = Utils.getStore("user");
  if (user.value) {
    initials.value = user.value.fName[0] + user.value.lName[0];
    name.value = user.value.fName + " " + user.value.lName;
  }
};

const logout = () => {
  AuthServices.logoutUser(user.value)
    .then(() => {
      Utils.removeItem("user");
      localStorage.removeItem('user');
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const navigateTo = (routeName) => {
  console.log('Navigating to:', routeName); // Debug log
  router.push({ name: routeName }).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', err);
    }
  });
};

onMounted(() => {
  logoURL.value = ocLogo;
  resetMenu();
});
</script>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>