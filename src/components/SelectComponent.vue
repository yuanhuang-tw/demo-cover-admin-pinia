<script setup>
import { computed } from 'vue';

// store
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();

const totalPageNumber = computed(() =>
  Math.ceil(userStore.sortedData.length / userStore.ITEMS_PER_PAGE)
);

const page = computed({
  get: () => userStore.activePage,
  set: (val) => userStore.changeActivePage(val)
});

const previousPage = () => userStore.changeActivePage(--page.value);

const nextPage = () => userStore.changeActivePage(++page.value);

const firstPage = () => userStore.changeActivePage(1);

const lastPage = () => userStore.changeActivePage(totalPageNumber.value);
</script>

<template>
  <div class="d-flex justify-content-end gap-2 mb-5">
    <button class="btn btn-primary" @click="firstPage" :disabled="page === 1">
      <i class="fa fa-angle-double-left" aria-hidden="true"></i> 第一頁
    </button>

    <button class="btn btn-primary" @click="previousPage" :disabled="page === 1">
      <i class="fa fa-angle-left" aria-hidden="true"></i> 上一頁
    </button>

    <select class="form-select w-25" name="page" v-model="page">
      <option :value="n" v-for="n in totalPageNumber" :key="n">Page {{ n }}</option>
    </select>

    <button class="btn btn-primary" @click="nextPage" :disabled="page === totalPageNumber">
      下一頁 <i class="fa fa-angle-right" aria-hidden="true"></i>
    </button>

    <button class="btn btn-primary" @click="lastPage" :disabled="page === totalPageNumber">
      最末頁 <i class="fa fa-angle-double-right" aria-hidden="true"></i>
    </button>
  </div>
</template>
