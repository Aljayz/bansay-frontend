<template>
  <q-page padding>
    <OverviewSection
      :student-summary="studentSummary"
      :recent-liabilities="recentLiabilities"
      :upcoming-due="upcomingDue"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useLiabilityStore } from 'src/stores/liability-store';

// Components
import OverviewSection from 'src/components/OverviewSection.vue';

// State
const liabilityStore = useLiabilityStore();

onMounted(async () => {
  await liabilityStore.fetchMyLiabilities();
});

const studentSummary = computed(() => ({
  totalBalance: `₱ ${liabilityStore.totalOutstandingBalance.toLocaleString()}`,
  unpaidLiabilities: liabilityStore.unpaidLiabilities.length,
  pendingAppeals: 0,
  pendingPayment: '₱ 0',
}));

const recentLiabilities = computed(() => {
  return liabilityStore.myLiabilities
    .slice(0, 5)
    .map((l) => `${l.type} - ₱${l.amount.toLocaleString()}`);
});

const upcomingDue = computed(() => {
  return liabilityStore.unpaidLiabilities.slice(0, 5).map((l) => `${l.dueDate} - ${l.type}`);
});
</script>
