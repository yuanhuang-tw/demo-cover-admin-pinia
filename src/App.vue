<script setup>
// store
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();

userStore.fetchData();

// component
import InfoCard from '@/components/InfoCard.vue';
import ChartComponent from '@/components/ChartComponent.vue';
import SearchComponent from '@/components/SearchComponent.vue';
import GroupComponent from '@/components/GroupComponent.vue';
import SelectComponent from '@/components/SelectComponent.vue';
import TableComponent from '@/components/TableComponent.vue';
import PageComponent from '@/components/PageComponent.vue';
</script>

<template>
  <!-- info card -->
  <div class="row mb-4">
    <div class="col-3">
      <InfoCard>
        <h5 class="card-title">總報名筆數(包含取消報名)</h5>
        <p class="card-text fs-1 mb-0 lh-1 mt-3">{{ userStore.getAllData.length }}</p>
      </InfoCard>
    </div>
    <div class="col-3">
      <InfoCard>
        <h5 class="card-title">完成檔案上傳筆數</h5>
        <p class="card-text fs-1 mb-0 lh-1 mt-3">{{ userStore.completedCount }}</p>
      </InfoCard>
    </div>
    <div class="col-3">
      <InfoCard>
        <h5 class="card-title">取消報名筆數</h5>
        <p class="card-text fs-1 mb-0 lh-1 mt-3">{{ userStore.canceledCount }}</p>
      </InfoCard>
    </div>
  </div>

  <!-- chart -->
  <ChartComponent></ChartComponent>

  <!-- search -->
  <SearchComponent></SearchComponent>

  <!-- group -->
  <GroupComponent v-show="!userStore.searchString"></GroupComponent>

  <!-- select -->
  <SelectComponent></SelectComponent>

  <!-- table -->
  <TableComponent></TableComponent>

  <!-- page -->
  <PageComponent></PageComponent>
</template>
