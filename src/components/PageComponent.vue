<script setup>
import { computed } from 'vue';

// store
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();

const HOW_MANY_ITEMS_SHOW = 10;

const totalPageNumber = computed(() =>
  Math.ceil(userStore.sortedData.length / userStore.ITEMS_PER_PAGE)
);

const showPage = computed(() => {
  if (totalPageNumber.value > HOW_MANY_ITEMS_SHOW) {
    return HOW_MANY_ITEMS_SHOW;
  } else {
    return totalPageNumber.value;
  }
});

const page = computed({
  get: () => userStore.activePage,
  set: (val) => userStore.changeActivePage(val)
});

const offset = computed(() => {
  if (page.value + 4 <= HOW_MANY_ITEMS_SHOW) {
    return 0;
  } else {
    if (page.value + 4 <= totalPageNumber.value) {
      return page.value + 4 - HOW_MANY_ITEMS_SHOW;
    } else {
      return totalPageNumber.value - HOW_MANY_ITEMS_SHOW;
    }
  }
});

const previousPage = () => {
  userStore.changeActivePage(page.value < 2 ? 1 : --page.value);
};

const nextPage = () =>
  userStore.changeActivePage(
    page.value > totalPageNumber.value - 1 ? totalPageNumber.value : ++page.value
  );

const firstPage = () => userStore.changeActivePage(1);

const lastPage = () => userStore.changeActivePage(totalPageNumber.value);
</script>

<template>
  <nav class="mt-5 mb-4">
    <ul class="pagination justify-content-center">
      <li class="page-item" @click.prevent="firstPage">
        <a class="page-link" href="">第一頁</a>
      </li>
      <li class="page-item" @click.prevent="previousPage">
        <a class="page-link" href=""><span>&laquo;</span></a>
      </li>
      <li
        class="page-item"
        :class="{ active: page - offset === n }"
        v-for="n in showPage"
        :key="n"
        @click.prevent="page = n + offset"
      >
        <a class="page-link" href="">{{ n + offset }}</a>
      </li>
      <li class="page-item">
        <a class="page-link" href="" @click.prevent="nextPage"><span>&raquo;</span></a>
      </li>
      <li class="page-item">
        <a class="page-link" href="" @click.prevent="lastPage">最末頁</a>
      </li>
    </ul>
  </nav>
</template>
