<script setup>
import { watch } from 'vue';

// store
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();

// 繪製 C3 圖表
const drawChart = (data) => {
  const columns = [['各組別報名筆數 (包含取消報名)']];

  for (let i = 1; i <= 10; i++) {
    columns[0].push(data.filter((item) => item.group == i).length);
  }

  const chart = c3.generate({
    data: {
      columns,
      type: 'bar'
    },

    axis: {
      x: {
        type: 'category',
        categories: [
          '1. 年輕活力 A',
          '2. 年輕活力 B',
          '3. 創作 A',
          '4. 創作 B',
          '5. 經典 A',
          '6. 經典 B',
          '7 .動感/嘻哈 A',
          '8. 動感/嘻哈 B',
          '9. 情歌 A',
          '10. 情歌 B'
        ]
      }
    }
  });
};

watch(
  () => userStore.getAllData,
  (newVal) => drawChart(newVal)
);
</script>

<template>
  <div id="chart" class="mb-4 mx-auto"></div>
</template>

<style scoped>
#chart {
  width: 95%;
}
</style>
