<template>
  <q-page class="bg-grey-2 flex flex-center">
    <div class="container landscape-container">
      <!-- Left side: Logo and App Info -->
      <div class="left-side">
        <div class="logo-section">
          <img :src="logo" alt="Bansay Logo" class="logo" />
          <h1 class="app-title">Bansay App</h1>
          <p class="app-subtitle">Join our community today</p>
        </div>
      </div>

      <!-- Right side: Registration Form -->
      <div class="right-side">
        <q-form @submit.prevent="handleRegister" ref="registerForm" class="form-wrapper">
          <h1 class="register-title">Create Account</h1>
          
          <div class="q-gutter-y-lg">
            <div class="row q-gutter-md">
              <div class="col">
                <q-input
                  filled
                  v-model="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  color="indigo"
                  bg-color="indigo-2"
                  dense
                  clearable
                  :rules="[val => !!val || 'First name is required']"
                  lazy-rules
                >
                  <template v-slot:append>
                    <q-icon name="mdi-account" color="indigo" />
                  </template>
                </q-input>
              </div>
              <div class="col">
                <q-input
                  filled
                  v-model="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                  color="indigo"
                  bg-color="indigo-2"
                  dense
                  clearable
                  :rules="[val => !!val || 'Last name is required']"
                  lazy-rules
                >
                  <template v-slot:append>
                    <q-icon name="mdi-account" color="indigo" />
                  </template>
                </q-input>
              </div>
            </div>
            
            <q-input
              filled
              v-model="username"
              label="Username"
              placeholder="Enter username"
              color="indigo"
              bg-color="indigo-2"
              dense
              clearable
              :rules="[val => !!val || 'Username is required']"
              lazy-rules
            >
              <template v-slot:append>
                <q-icon name="mdi-account-circle" color="indigo" />
              </template>
            </q-input>
            
            <q-input
              filled
              v-model="email"
              label="Email"
              placeholder="Enter email"
              type="email"
              color="indigo"
              bg-color="indigo-2"
              dense
              clearable
              :rules="[
                val => !!val || 'Email is required',
                val => /.+@.+\..+/.test(val) || 'Please enter a valid email'
              ]"
              lazy-rules
            >
              <template v-slot:append>
                <q-icon name="mdi-email" color="indigo" />
              </template>
            </q-input>
            
            <q-input
              filled
              v-model="password"
              label="Password"
              placeholder="Enter password"
              type="password"
              color="indigo"
              bg-color="indigo-2"
              dense
              clearable
              :rules="[
                val => !!val || 'Password is required',
                val => val.length >= 6 || 'Password must be at least 6 characters'
              ]"
              lazy-rules
            >
              <template v-slot:append>
                <q-icon name="mdi-lock" color="indigo" />
              </template>
            </q-input>
          
            <q-input
              filled
              v-model="confirmPassword"
              label="Retype Password"
              placeholder="Confirm password"
              type="password"
              color="indigo"
              bg-color="indigo-2"
              dense
              clearable
              :rules="[
                val => !!val || 'Please confirm your password',
                val => val === password || 'Passwords do not match'
              ]"
              lazy-rules
            >
              <template v-slot:append>
                <q-icon name="mdi-lock-check" color="indigo" />
              </template>
            </q-input>
            
            <q-select
              filled
              v-model="selectedRole"
              label="Select Role"
              :options="roles"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              color="indigo"
              bg-color="indigo-2"
              dense
              :rules="[val => !!val || 'Please select a role']"
              lazy-rules
              style="height: 56px;"
            >
              <template v-slot:append>
                <q-icon name="mdi-account-switch" color="indigo"/>
              </template>
            </q-select>
          </div>

          <div class="q-mt-lg">
            <q-btn 
              type="submit" 
              color="indigo" 
              label="Register" 
              class="full-width"
              :loading="isLoading"
              size="lg"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Registering...
              </template>
            </q-btn>
          </div>

          <div class="q-mt-lg text-center">
            <p class="text-body2">
              Already have an account?
              <router-link to="/login" class="text-indigo q-ml-xs">Login</router-link>
            </p>
          </div>

          <div class="q-mt-lg text-center">
            <p class="text-caption text-grey-7">Or register with</p>
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

<script lang="ts" setup>
import { ref } from 'vue';
import '../../assets/styles/auth.css';
import { useRouter } from 'vue-router';
import { QBtn, QForm } from 'quasar';
import logo from '../../assets/logo.png';
import { UserRegisterDtoRoleEnum } from 'src/services/sdk';
import { useAuthStore } from 'src/stores/auth-store';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const firstName = ref('');
const lastName = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const selectedRole = ref<UserRegisterDtoRoleEnum | null>(null);
const registerForm = ref<QForm | null>(null);
const isLoading = ref(false);

const roles = [
  { label: 'Student', value: UserRegisterDtoRoleEnum.Student },
  { label: 'Officer', value: UserRegisterDtoRoleEnum.Officer },
  { label: 'Admin', value: UserRegisterDtoRoleEnum.Admin },
];

async function handleRegister() {
  // Validate form before proceeding
  const valid = await registerForm.value?.validate();
  if (valid !== true) {
    // Form validation failed
    $q.notify({
      type: 'negative',
      message: 'Please fill in all required fields correctly',
      position: 'top',
      timeout: 3000,
    });
    return;
  }

  isLoading.value = true;

  try {
    await authStore.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      role: selectedRole.value as unknown as UserRegisterDtoRoleEnum,
      username: username.value,
    });

    $q.notify({
      type: 'positive',
      message: 'Registration successful! Your account is pending approval.',
      position: 'top',
      timeout: 5000,
      icon: 'check_circle',
    });

    // Clear form
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    username.value = '';
    password.value = '';
    confirmPassword.value = '';
    selectedRole.value = null;
    
    // Reset form validation state
    registerForm.value?.resetValidation();

    setTimeout(() => {
      void router.push('/login');
    }, 2000);
  } catch (error: unknown) {
    let errorMessage = 'Registration failed. Please try again.';
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top',
      timeout: 5000,
      icon: 'error',
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.landscape-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 500px;
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
  max-width: 400px;
}

.logo {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.app-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: aliceblue;
}

.app-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.right-side {
  flex: 1.2;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-wrapper {
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.register-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
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
  .row {
    flex-direction: column;
  }
  
  .col {
    width: 100%;
  }
}
</style>