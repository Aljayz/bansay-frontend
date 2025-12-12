<template>
  <q-page class="q-pa-lg">
    <liabilities-section
      :loading="liabilityStore.loading"
      :liabilities="liabilityStore.myLiabilities"
    />
  </q-page>
</template>
<script setup lang="ts">
import LiabilitiesSection from 'src/components/LiabilitiesSection.vue';
import { useLiabilityStore } from 'src/stores/liability-store';

const liabilityStore = useLiabilityStore();
// Placeholder script
</script>
