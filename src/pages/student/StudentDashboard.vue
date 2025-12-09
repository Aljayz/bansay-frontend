<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawer = !leftDrawer" />
        <q-toolbar-title>Student Dashboard</q-toolbar-title>
        <q-btn flat round icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawer" show-if-above bordered class="bg-grey-1">
      <div class="q-pa-md">
        <q-list padding>
          <q-item
            clickable
            :active="selectedSection === 'Overview'"
            @click="selectedSection = 'Overview'"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>Overview</q-item-section>
          </q-item>

          <q-item
            clickable
            :active="selectedSection === 'My Liabilities'"
            @click="selectedSection = 'My Liabilities'"
          >
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>My Liabilities</q-item-section>
          </q-item>

          <q-item
            clickable
            :active="selectedSection === 'Submit Appeal'"
            @click="selectedSection = 'Submit Appeal'"
          >
            <q-item-section avatar>
              <q-icon name="report_problem" />
            </q-item-section>
            <q-item-section>File Appeal</q-item-section>
          </q-item>

          <q-item
            clickable
            :active="selectedSection === 'My Record'"
            @click="selectedSection = 'My Record'"
          >
            <q-item-section avatar>
              <q-icon name="history" />
            </q-item-section>
            <q-item-section>My Record</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <OverviewSection
          v-if="selectedSection === 'Overview'"
          :student-summary="studentSummary"
          :recent-liabilities="recentLiabilities"
          :upcoming-due="upcomingDue"
        />
        <LiabilitiesSection v-if="selectedSection === 'My Liabilities'" />
        <AppealSection v-if="selectedSection === 'Submit Appeal'" />
        <RecordSection v-if="selectedSection === 'My Record'" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useLiabilityStore } from 'src/stores/liability-store';

// Components
import OverviewSection from 'src/components/OverviewSection.vue';
import LiabilitiesSection from 'src/components/LiabilitiesSection.vue';
import AppealSection from 'src/components/AppealSection.vue';
import RecordSection from 'src/components/MyRecordSection.vue';

// State
const leftDrawer = ref(false);
const selectedSection = ref('Overview');
const authStore = useAuthStore();
const liabilityStore = useLiabilityStore();

function logout() {
  authStore.logout();
}

onMounted(async () => {
  await liabilityStore.fetchMyLiabilities();
});

const studentSummary = computed(() => ({
  totalBalance: `₱ ${liabilityStore.totalOutstandingBalance.toLocaleString()}`,
  unpaidLiabilities: liabilityStore.unpaidLiabilities.length,
  pendingAppeals: 0,
  pendingPayment: '₱ 0'
}));

const recentLiabilities = computed(() => {
  return liabilityStore.myLiabilities.slice(0, 5).map(l => `${l.type} - ₱${l.amount.toLocaleString()}`);
});

const upcomingDue = computed(() => {
  return liabilityStore.unpaidLiabilities
    .slice(0, 5)
    .map(l => `${l.dueDate} - ${l.type}`);
});
</script>
