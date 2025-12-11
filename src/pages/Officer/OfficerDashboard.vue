<template>
  <q-page padding>
    <div v-if="liabilityStore.loading" class="text-center q-pa-md">
      <q-spinner color="primary" size="3em" />
      <div class="text-grey">Loading liabilities...</div>
    </div>

    <div v-else>
      <div class="text-h6 q-mb-md">
        Total Liabilities Fetched: {{ liabilityStore.liabilities.length }}
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useLiabilityStore } from 'src/stores/liability-store';

const liabilityStore = useLiabilityStore();

// Task 7: Fetch All Liabilities on Mount using Store
onMounted(async () => {
  await liabilityStore.fetchAllLiabilities();
});
</script>

<style scoped>
.dashboard-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
</style>
