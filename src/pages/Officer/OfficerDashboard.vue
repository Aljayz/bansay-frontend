<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-green-8 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawer = !leftDrawer" />
        <q-toolbar-title>Officer Dashboard</q-toolbar-title>
        <q-btn flat round icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawer" show-if-above bordered class="bg-grey-1">
      <q-scroll-area class="fit">
        <div class="q-pa-md">
          <q-card class="dashboard-card q-mb-md">
          </q-card>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page padding>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { api } from 'src/boot/axios';
import type { Liability } from 'src/services/sdk';

export default defineComponent({
  name: 'OfficerDashboard',
  setup() {
    const leftDrawer = ref(false);
    const authStore = useAuthStore();
    function logout() { authStore.logout(); }
    function selectCard(name: string) { alert(`You clicked ${name}!`); }

    const loading = ref(false);
    const rows = ref<Liability[]>([]);

    const fetchAllLiabilities = async () => {
      loading.value = true;
      try {
        const { data } = await api.get('/liability');
        rows.value = data as unknown as Liability[];
      } catch (error) {
        console.error('Failed to fetch officer dashboard data:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchAllLiabilities);

    return {
      leftDrawer, selectCard, logout,
      loading, rows
    };
  },
});
</script>

<style scoped>
.dashboard-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
</style>
