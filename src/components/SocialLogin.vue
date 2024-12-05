<script setup>
import { ref, onMounted } from "vue";
import AuthServices from "../services/authServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";

const router = useRouter();
const role = ref("");
const user = ref({});

const loginWithGoogle = () => {
  window.handleCredentialResponse = handleCredentialResponse;
  const client = import.meta.env.VITE_APP_CLIENT_ID;
  console.log(client);
  window.google.accounts.id.initialize({
    client_id: client,
    cancel_on_tap_outside: false,
    auto_select: true,
    callback: window.handleCredentialResponse,
  });
  window.google.accounts.id.renderButton(document.getElementById("parent_id"), {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signup_with",
    width: 400,
  });
};

const handleCredentialResponse = async (response) => {
  try {
    const loginResponse = await AuthServices.loginUser({
      credential: response.credential
    });
    
    if (!loginResponse?.data) {
      throw new Error("Invalid response from server");
    }
    
    const userData = loginResponse.data;
    console.log("Login response data:", userData);
    
    // Store user data
    Utils.setStore("user", userData);
    user.value = userData;

    // Check admin status and redirect
    if (userData.role === 'admin' || userData.isAdmin) {
      console.log('Admin user detected, redirecting to admin dashboard');
      router.push({ name: 'adminHome' });
    } else {
      console.log('Regular user detected, redirecting to home');
      router.push({ name: 'home' });
    }
  } catch (error) {
    console.error("Login error:", error);
  }
};

onMounted(() => {
  loginWithGoogle();
});
</script>

<template>
  <div class="signup-buttons">
    <v-row justify="center">
      <div display="flex" id="parent_id"></div>
    </v-row>
  </div>
</template>
