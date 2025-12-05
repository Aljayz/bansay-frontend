<template>
<<<<<<< HEAD
  <q-layout>
    <!-- Use the AppHeader component -->
    <AppHeader
      :user-role="userRole"
      :user-display-name="userDisplayName"
      :user-email="currentUserEmail"
      :user-avatar="userAvatarUrl"
      :app-name="appName"
      :show-menu-button="true"
      @toggle-left-drawer="toggleLeftDrawer"
      @profile-clicked="handleProfile"
      @settings-clicked="handleSettings"
      @logout-clicked="handleLogout"
      @logout-confirmed="confirmLogout"
    />
=======
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Bansay App</q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-scroll-area class="fit">
        <dev class="q-pa-md"></dev>
        <q-card class="dashboard-card q-mb-md" clickable v-ripple></q-card>
        <div class="col-12 col-md-4">
          <q-card class="dashboard-card">
            <q-card-section>
              <div class="text-h6">User Management</div>
              <div class="text-caption text-grey-7">Manage user accounts and permissions.</div>
            </q-card-section>
            <q-card-actions align="left">
              <q-btn
                :to="{ name: 'user-management' }"
                color="red-8"
                label="Manage Users"
                flat
                @click="leftDrawerOpen = false"
              />
            </q-card-actions>
          </q-card>
        </div>
        <q-card class="dashboard-card q-mb-md" clickable v-ripple></q-card>
        <div class="col-12 col-md-4"></div>

        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">System Settings</div>
            <div class="text-caption text-grey-7">Configure system preferences and settings.</div>
          </q-card-section>
          <q-card-actions align="left">
            <q-btn color="red-8" label="Settings" flat @click="leftDrawerOpen = false" />
          </q-card-actions>
        </q-card>
      </q-scroll-area>
    </q-drawer>
>>>>>>> 3d38e8f32056ac709df954665e05ce936ec73e06

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import AppHeader from 'src/components/AppHeader.vue';

const leftDrawerOpen = ref(false);
const authStore = useAuthStore();

// User data computed properties
const userRole = computed(() => {
  return authStore.currentUser?.role || 'User';
});

const userDisplayName = computed(() => {
  const name = authStore.currentUser?.username || 'User';
  return name?.split(' ')[0] || 'User';
});

const currentUserEmail = computed(() => {
  return authStore.currentUser?.email || 'user@example.com';
});

const userAvatarUrl = computed(() => {
  return 'https://cdn.quasar.dev/img/avatar.png';
});

// App config
const appName = 'Bansay';

// Event handlers
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const handleProfile = () => {
  console.log('Navigate to profile');
  // Or use router: router.push('/profile');
};

const handleSettings = () => {
  console.log('Navigate to settings');
  // Or use router: router.push('/settings');
};

const handleLogout = () => {
  console.log('Logout initiated - showing confirmation dialog');
};

const confirmLogout = () => {
  try {
    authStore.logout();
    // Redirect to login page or handle post-logout
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>