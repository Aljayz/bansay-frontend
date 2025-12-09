<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4">Liabilities</div>
      <q-btn
        color="primary"
        icon="add"
        label="Add Liability"
        to="/officer/create-liability"
        no-caps
        unelevated
      />
    </div>

    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 col-md-3">
        <q-input
          v-model="searchText"
          dense
          outlined
          label="Search Student ID or Name"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-sm-6 col-md-2">
        <q-select
          v-model="typeFilter"
          :options="['All', 'Tuition', 'Miscellaneous', 'Lab Fee', 'Other']"
          dense
          outlined
          label="Type"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-2">
        <q-select
          v-model="statusFilter"
          :options="['All', 'Paid', 'Unpaid', 'Cancelled']"
          dense
          outlined
          label="Status"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-input
          v-model="dateFilter"
          dense
          outlined
          label="Due Date"
          type="date"
          stack-label
          clearable
        />
      </div>

      <div class="col-12 col-sm-6 col-md-2 flex flex-center">
        <q-btn
          label="Reset Filters"
          color="grey-7"
          flat
          no-caps
          icon="restart_alt"
          @click="resetFilters"
          class="full-width"
        />
      </div>
    </div>

    <q-card>
      <q-table
        title="All Student Liabilities"
        :rows="filteredLiabilities"
        :columns="columns"
        row-key="id"
        :loading="liabilityStore.loading"
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              {{ props.row.student?.username || 'N/A' }}
            </q-td>

            <q-td key="student" :props="props">
              <div>{{ props.row.student?.firstName }} {{ props.row.student?.lastName }}</div>
            </q-td>

            <q-td key="type" :props="props">
              <q-badge color="blue-grey" :label="props.row.type" />
            </q-td>

            <q-td key="amount" :props="props">
              {{ formatCurrency(props.row.amount) }}
            </q-td>

            <q-td key="status" :props="props">
              <q-chip
                :color="getStatusColor(props.row.status)"
                text-color="white"
                dense
                size="sm"
              >
                {{ props.row.status }}
              </q-chip>
            </q-td>

            <q-td key="dueDate" :props="props">
              {{ props.row.dueDate }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useLiabilityStore } from 'src/stores/liability-store';
import type { QTableColumn } from 'quasar';
import type { Liability } from 'src/services/sdk';

// State
const liabilityStore = useLiabilityStore();

// Filter State
const searchText = ref('');
const typeFilter = ref('All');
const statusFilter = ref('All');
const dateFilter = ref('');

// Columns
const columns: QTableColumn[] = [
  { name: 'id', label: 'Student ID', field: (row: Liability) => row.student?.username, align: 'left', sortable: true },
  { name: 'student', label: 'Name', field: (row: Liability) => row.student?.lastName, align: 'left', sortable: true },
  { name: 'type', label: 'Type', field: 'type', align: 'left', sortable: true },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'dueDate', label: 'Due Date', field: 'dueDate', align: 'left', sortable: true },
];

// Computed Filter Logic
const filteredLiabilities = computed(() => {
  return liabilityStore.liabilities.filter((row: Liability) => {
    // Search Text (ID or Name)
    const term = searchText.value.toLowerCase().trim();
    const matchesSearch =
      !term ||
      row.student?.username.toLowerCase().includes(term) ||
      row.student?.firstName?.toLowerCase().includes(term) ||
      row.student?.lastName?.toLowerCase().includes(term);

    // Type Filter
    const matchesType = typeFilter.value === 'All' || row.type === typeFilter.value;

    // Status Filter
    const matchesStatus = statusFilter.value === 'All' || row.status === statusFilter.value;

    // Date Filter
    const matchesDate = !dateFilter.value || row.dueDate === dateFilter.value;

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });
});

function resetFilters() {
  searchText.value = '';
  typeFilter.value = 'All';
  statusFilter.value = 'All';
  dateFilter.value = '';
}

function formatCurrency(value: number | undefined) {
  if (value === undefined) return '₱0.00';
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Paid': return 'positive';
    case 'Unpaid': return 'negative';
    case 'Cancelled': return 'grey';
    default: return 'grey';
  }
}

onMounted(async () => {
  await liabilityStore.fetchAllLiabilities();
});
</script>
