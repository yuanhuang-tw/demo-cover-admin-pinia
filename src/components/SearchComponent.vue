<script setup>
import { computed } from 'vue';

// store
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();

const searchString = computed({
  get() {
    return userStore.searchString;
  },

  set(val) {
    userStore.searchString = val;

    if (val) {
      userStore.chooseGroup('ALL');
    } else {
      userStore.chooseGroup(userStore.tempGroup, userStore.tempOrderByDesc, userStore.tempPage);
    }
  }
});

const reset = () => (searchString.value = '');
</script>

<template>
  <div class="form-floating mb-4 position-relative">
    <input
      type="text"
      class="form-control"
      id="search"
      placeholder="搜尋暱稱"
      v-model.trim="searchString"
    />
    <label for="search">搜尋暱稱</label>
    <span :class="{ 'search-cancel-icon': !!searchString }" @click="reset"></span>
  </div>
</template>

<style scoped>
.search-cancel-icon {
  color: #b3b3b3;
}

.search-cancel-icon:hover {
  color: #9f9f9f;
}

.search-cancel-icon::after {
  display: inline-block;
  font-family: FontAwesome;
  font-size: 1.4rem;
  content: '\f057';
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  cursor: pointer;
}
</style>
