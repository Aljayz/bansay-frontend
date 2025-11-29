<template>
  <q-page>
    <div class="row q-col-gutter-md q-mb-lg q-pa-md">
      <div class="col-12 col-md-4">
        <q-card class="bg-warning text-white">
          <q-card-section>
            <div class="text-h6">Pending Approvals</div>
            <div class="text-h3 text-weight-bold">{{ pendingCount }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div>
      <TopStudents />
    </div>
    <div>
      <TopLiabilities />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import TopStudents from './widgets/TopStudents.vue';
import TopLiabilities from './widgets/TopLiabilities.vue';

const pendingCount = ref(0);

onMounted(async () => {
  try {
    const { data } = await api.get('/admin/pending-registrations-count');
    pendingCount.value = data.count;
  } catch (err) {
    console.error('Error fetching admin stats:', err);
  }
});
</script>
