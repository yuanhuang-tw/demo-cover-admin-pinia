<script setup>
// store
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();

const groups = ['ALL', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
</script>

<template>
  <div class="row mb-4">
    <div class="btn-group">
      <a
        v-for="item in groups"
        :key="item"
        href=""
        class="btn btn-outline-primary"
        :class="{ active: userStore.activeGroup === item }"
        @click.prevent="userStore.chooseGroup(item)"
        >{{ item }}</a
      >
    </div>
  </div>
</template>
