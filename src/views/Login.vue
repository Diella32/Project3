<script setup>
import SocialLogin from "../components/SocialLogin.vue";
</script>

<template>
  <v-container fluid class="login-container fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="login-card elevation-12">
          <v-card-item class="text-center pb-0">
            <v-img
              src="public/oc-logo-white.png"  
              class="mx-auto mb-4"
              max-width="200"
              contain
            />
            <h1 class="text-h4 font-weight-bold primary--text mb-2">
              Welcome to Resume Generator!
            </h1>
            <p class="text-body-1 text-medium-emphasis mb-6">
              Create professional resumes with ease
            </p>
          </v-card-item>

          <v-card-text class="text-center">
            <SocialLogin />
          </v-card-text>

          <v-card-text class="text-center pt-0">
            <v-divider class="my-4">
              <span class="text-overline text-medium-emphasis">OR</span>
            </v-divider>
            
            <p class="text-body-2 text-medium-emphasis mb-0">
              Don't have an account? Sign up with Google to get started.
            </p>
          </v-card-text>

          <v-card-text class="text-center text-caption text-medium-emphasis">
            By continuing, you agree to our 
            <a href="#" class="text-decoration-none">Terms of Service</a> and 
            <a href="#" class="text-decoration-none">Privacy Policy</a>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.login-container {
  background: linear-gradient(135deg, var(--v-primary-base) 0%, var(--v-secondary-base) 100%);
  min-height: 100vh;
}

.login-card {
  border-radius: 16px;
  padding: 2rem 1.5rem;
}

.v-divider {
  position: relative;
}

.v-divider span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 0 1rem;
}

a {
  color: var(--v-primary-base);
}

a:hover {
  color: var(--v-secondary-base);
}
</style>