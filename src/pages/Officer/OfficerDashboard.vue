<template>
    <q-page-container>
      <div v-if="showLiabilities">
        <q-table
          title="Liabilities"
          :rows="liabilityStore.liabilities"
          :columns="[
            { name: 'id', field: (row) => row.student.id, label: 'ID', sortable: false },
            {
              name: 'student',
              field: (row) => row.student.username,
              label: 'Student',
              sortable: true,
            },
            { name: 'type', field: 'type', label: 'Type', sortable: true },
            { name: 'amount', field: (row) => Number(row.amount), label: 'Amount', sortable: true },
            { name: 'status', field: 'status', label: 'Status', sortable: true },
            { name: 'dueDate', field: 'dueDate', label: 'Due Date', sortable: true },
          ]"
        />
      </div>
    </q-page-container>
</template>

<script setup lang="ts">
// import { nextTick, ref } from 'vue';
import { ref } from 'vue';
// import { useAuthStore } from 'src/stores/auth-store';
import { useLiabilityStore } from 'src/stores/liability-store';

const showLiabilities = ref(false);
const liabilityStore = useLiabilityStore();
// const authStore = useAuthStore();

// Fetches the liability data.
// async function viewLiabilities() {
//   await liabilityStore.fetchAllLiabilities();
//   leftDrawer.value = false;
//   showLiabilities.value = true;
//   await nextTick();
// }

// function logout() {
//   authStore.logout();
// }
</script>

<style scoped>
.dashboard-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
</style>
