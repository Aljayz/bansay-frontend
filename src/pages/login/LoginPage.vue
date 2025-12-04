<template>
  <q-page class="bg-grey-2 flex flex-center">
    <div class="container landscape-container">
      <!-- Left side: Logo and App Info -->
      <div class="left-side">
        <div class="logo-section">
          <img :src="logo" alt="Bansay Logo" class="logo" />
          <h1 class="app-title">Bansay App</h1>
          <p class="app-subtitle">Welcome back to your community</p>
        </div>
      </div>

      <!-- Right side: Login Form -->
      <div class="right-side">
        <q-form @submit.prevent="handleLogin" ref="loginForm" class="form-wrapper">
          <h1 class="login-title">Sign In</h1>
          
          <div class="q-gutter-y-lg">
            <q-input
              filled
              v-model="username"
              label="Username"
              placeholder="Enter your username"
              color="indigo"
              bg-color="indigo-2"
              dense
              lazy-rules
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
              lazy-rules
            >
              <template v-slot:append>
                <q-icon name="mdi-lock" color="indigo" />
              </template>
            </q-input>
            
            <div v-if="hasError" class="flex items-center text-red q-mt-sm q-pa-sm rounded-borders bg-red-1">
              <q-icon name="error" color="red" size="sm"/>
              <span class="q-ml-sm text-body2">Incorrect username or password</span>
            </div>
          </div>

          <div class="forgot-link text-right q-mt-sm">
            <a href="#" class="text-indigo text-caption">Forgot Password?</a>
          </div>

          <div class="q-mt-lg">
            <q-btn 
              type="submit" 
              color="indigo" 
              :label="isLoading ? 'Signing in...' : 'Sign In'" 
              class="full-width"
              :loading="isLoading"
              :disable="isLoading"
              size="lg"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Signing in...
              </template>
            </q-btn>
          </div>

          <div class="q-mt-lg text-center">
            <p class="text-body2">
              Don't have an account?
              <router-link to="/register" class="text-indigo q-ml-xs">Register</router-link>
            </p>
          </div>

          <div class="q-mt-lg text-center">
            <p class="text-caption text-grey-7">Or login with</p>
            <div class="social-icons q-mt-sm">
              <q-btn round color="red" icon="mdi-google" size="sm" />
              <q-btn round color="blue-8" icon="mdi-facebook" size="sm" />
              <q-btn round color="black" icon="mdi-github" size="sm" />
              <q-btn round color="blue-9" icon="mdi-linkedin" size="sm" />
            </div>
          </div>
        </q-form>
      </div>
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

<style scoped>
.landscape-container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  min-height: 550px;
  overflow: hidden;
}

.left-side {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: white;
}

.logo-section {
  text-align: center;
  max-width: 350px;
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.app-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: aliceblue;
}

.app-subtitle {
  font-size: 1rem;
  opacity: 0.9;
}

.right-side {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-wrapper {
  max-width: 350px;
  margin: 0 auto;
  width: 100%;
}

.login-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.forgot-link a {
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-link a:hover {
  text-decoration: underline;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .landscape-container {
    flex-direction: column;
    max-width: 500px;
  }
  
  .left-side {
    padding: 30px;
  }
  
  .right-side {
    padding: 30px;
  }
}

@media (max-width: 600px) {
  .logo {
    width: 80px;
    height: 80px;
  }
  
  .app-title {
    font-size: 1.8rem;
  }
  
  .login-title {
    font-size: 1.8rem;
  }
}
</style>