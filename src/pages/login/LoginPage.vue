<template>
  <q-page class="bg-grey-2 flex flex-center">
    <div class="container">
      <q-form @submit.prevent="handleLogin" ref="loginForm" class="q-gutter-y-md ">
        <div class="logo-header">
          <img :src="logo" alt="Bansay Logo" class="logo" />
          <h2 class="app-title">Bansay App</h2>
        </div>

        <h1 class="login-title">Login</h1>

        <div class="q-gutter-y-md">
          <q-input
            filled
            v-model="username"
            label="Username"
            placeholder="Enter your username"
            color="indigo"
            bg-color="indigo-2"
            dense
          >
            <template v-slot:append>
              <q-icon name="mdi-account" color="indigo" />
            </template>
          </q-input>
  
          <q-input
            filled
            v-model="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            color="indigo"
            bg-color="indigo-2"
            dense
          >
            <template v-slot:append>
              <q-icon name="mdi-lock" color="indigo" />
            </template>
          </q-input>
          <div v-if="hasError" class="flex items-center text-red q-mt-md q-pa-sm rounded-borders bg-red-2">
            <q-icon name="error" color="red"/>
            <span class="q-ml-sm">Incorrect username or password</span>
          </div>
        </div>

        <div class="forgot-link">
          <a href="#">Forgot Password?</a>
        </div>

        <q-btn 
          type="submit" 
          color="indigo" 
          :label="isLoading ? 'Loading...' : 'Login'" 
          class="full-width"
          :loading="isLoading"
          :disable="isLoading"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Loading...
          </template>
        </q-btn>

        <p>
          Don't have an account?
          <router-link to="/register">Register</router-link>
        </p>
        <p>Or login with</p>
        <div class="social-icons">
          <q-btn round color="red" icon="mdi-google" size="10px" />
          <q-btn round color="blue-8" icon="mdi-facebook" size="10px" />
          <q-btn round color="black" icon="mdi-github" size="10px" />
          <q-btn round color="blue-9" icon="mdi-linkedin" size="10px" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import '../../assets/styles/auth.css';
import { useRouter } from 'vue-router';
import { QBtn, QForm, QIcon, useQuasar } from 'quasar';
import logo from '../../assets/logo.png';
import { useAuthStore } from 'src/stores/auth-store';

export default defineComponent({
  name: 'LoginPage',
  components: { QBtn, QForm, QIcon },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const $q = useQuasar();

    const username = ref('');
    const password = ref('');
    const loginForm = ref<QForm | null>(null);
    
    const loginError = ref<string>('');
    const hasError = ref<boolean>(false);
    const isLoading = ref<boolean>(false);

    const handleLogin = async () => {
      loginError.value = '';
      hasError.value = false;
      isLoading.value = true;

      const valid = await loginForm.value?.validate();
      if (valid !== true) {
        hasError.value = true;
        isLoading.value = false;
        return;
      }

      try {
        const response = await authStore.login({
          username: username.value,
          password: password.value,
        });

        const role = response.user?.role;
        if (role === 'Student') {
          await router.push('/student-dashboard');
        } else if (role === 'Officer') {
          await router.push('/officer-dashboard');
        } else if (role === 'Admin') {
          await router.push('/admin-dashboard');
        } else {
          // Fallback if role doesn't match or is missing
          void router.push('/');
        }
        $q.notify({
          type: 'positive',
          message: 'Login successful',
        });
      } catch (error: unknown) {
        hasError.value = true;
        loginError.value = error instanceof Error && error.message
          ? 'Incorrect username or password'
          : 'Login failed';
          $q.notify({
            type: 'negative',
            message: loginError.value,
            position: 'top',
            timeout: 3000,
        });
      } finally {
        isLoading.value = false;
      }
    };

    return { 
      logo, 
      username, 
      password, 
      loginForm, 
      handleLogin, 
      loginError, 
      hasError,
      isLoading 
    };
  },
});
</script>