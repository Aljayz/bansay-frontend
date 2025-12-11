<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3" v-for="card in summaryCards" :key="card.id">
        <q-card class="q-pa-md dashboard-card" :class="card.color">
          <div class="text-h6 text-white">{{ card.title }}</div>
          <div class="text-h5 text-bold text-white q-mt-sm">{{ card.value }}</div>
        </q-card>
      </div>
    </div>

    <q-table
      title="My Liabilities"
      :rows="liabilities"
      :columns="columns"
      :loading="loading"
      row-key="id"
      flat
      bordered
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="type" :props="props">
            {{ props.row.type }}
          </q-td>

          <q-td key="issuer" :props="props">
            {{ props.row.issuer?.username || 'System' }}
          </q-td>

          <q-td key="amount" :props="props">
            {{ formatCurrency(props.row.amount) }}
          </q-td>

          <q-td key="status" :props="props">
            <q-badge
              :color="getStatusColor(props.row.status)"
              :label="props.row.status"
              class="text-uppercase"
            />
          </q-td>

          <q-td key="dueDate" :props="props">
            {{ props.row.dueDate }}
          </q-td>

          <q-td key="createdAt" :props="props">
            {{ props.row.createdAt }}
          </q-td>

          <q-td key="action" :props="props">
            <div class="row justify-center">
              <q-btn
                v-if="props.row.status !== 'Paid'"
                flat
                color="primary"
                label="File Appeal"
                disable
              >
                <q-tooltip>Appeal feature coming soon</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QTableColumn } from 'quasar';
import type { Liability } from 'src/services/sdk';

// Props from Parent
const props = defineProps<{
  liabilities: Liability[];
  loading: boolean;
}>();

// Column Definitions
const columns: QTableColumn[] = [
  { name: 'type', label: 'Type', field: 'type', align: 'left', sortable: true },
  { name: 'issuer', label: 'Issuer', field: (row: Liability) => row.issuer?.username || 'System', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'dueDate', label: 'Due Date', field: 'dueDate', align: 'left', sortable: true },
  { name: 'createdAt', label: 'Date Issued', field: 'createdAt', align: 'left', sortable: true },
  { name: 'action', label: 'Action', field: 'action', align: 'center' },
];

// Computed Summary Cards
const summaryCards = computed(() => {
  const totalCount = props.liabilities.length;
  const unpaidCount = props.liabilities.filter(l => l.status !== 'Paid').length;
  const totalOutstanding = props.liabilities
    .filter(l => l.status !== 'Paid')
    .reduce((sum, l) => sum + Number(l.amount), 0);
  const paidTotal = props.liabilities
    .filter(l => l.status === 'Paid')
    .reduce((sum, l) => sum + Number(l.amount), 0);

  return [
    { id: 1, title: 'Total Liabilities', value: totalCount.toString(), color: 'bg-blue-7' },
    { id: 2, title: 'Unpaid Count', value: unpaidCount.toString(), color: 'bg-indigo-7' },
    { id: 3, title: 'Outstanding Balance', value: formatCurrency(totalOutstanding), color: 'bg-grey-7' },
    { id: 4, title: 'Paid Total', value: formatCurrency(paidTotal), color: 'bg-blue-grey-7' },
  ];
});

// Helpers
function formatCurrency(value: number | string | undefined) {
  if (value === undefined) return '₱0.00';
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(value));
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Paid': return 'positive';
    case 'Unpaid': return 'warning';
    case 'Cancelled': return 'grey';
    default: return 'grey';
  }
}
</script>

<style scoped>
.dashboard-card {
  border-radius: 14px;
  transition: 0.2s ease;
}
.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
</style>
