import { defineStore } from 'pinia';

import { ref, computed } from 'vue';

const API_URL = import.meta.env.VITE_API_URL;

const escapeSpecialCharacters = (searchString) => {
  return searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const useUserStore = defineStore('user', () => {
  const allData = ref([]);
  const searchString = ref('');
  const regexp = ref('');
  const activeGroup = ref('ALL');
  const tempGroup = ref('ALL');
  const orderByDesc = ref(true);
  const tempOrderByDesc = ref(true);
  const column = ref('');
  const activePage = ref(1);
  const tempPage = ref(1);
  const ITEMS_PER_PAGE = 20;

  const getAllData = computed(() => [...allData.value]);

  // 計算 照片、音檔 完成上傳人數
  const completedCount = computed(() => {
    return getAllData.value.reduce((acc, cur) => {
      if (cur.img_upload === 'y' && cur.audio_upload === 'y') {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
  });

  // 取消報名人數
  const canceledCount = computed(() => {
    return getAllData.value.reduce((acc, cur) => {
      if (cur.cancel_sign_up === 'y') {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
  });

  // 搜尋資料
  const searchedData = computed(() => {
    regexp.value = new RegExp(escapeSpecialCharacters(searchString.value), 'gi');
    return getAllData.value.filter((item) => item.nickname.match(regexp.value));
  });

  // 組別資料
  const groupedData = computed(() => {
    if (activeGroup.value === 'ALL') {
      return searchedData.value;
    } else {
      return searchedData.value.filter((item) => item.group === activeGroup.value);
    }
  });

  // 排序資料
  const sortedData = computed(() => {
    if (orderByDesc.value) {
      groupedData.value.sort((a, b) => b[column.value] - a[column.value]);
    } else {
      groupedData.value.sort((a, b) => a[column.value] - b[column.value]);
    }

    return groupedData.value;
  });

  // 分頁資料
  const paginationData = computed(() => {
    return sortedData.value.slice(
      (activePage.value - 1) * ITEMS_PER_PAGE,
      activePage.value * ITEMS_PER_PAGE
    );
  });

  // 取得資料
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/data.php`);
      allData.value = await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  // 選擇組別
  const chooseGroup = (group, orderBy = true, page = 1) => {
    activeGroup.value = group;
    orderByDesc.value = orderBy;
    activePage.value = page;

    if (!searchString.value) {
      tempGroup.value = group;
      tempOrderByDesc.value = orderBy;
      tempPage.value = page;
    }
  };

  // 排序欄位
  const sortColumn = (col) => {
    orderByDesc.value = !orderByDesc.value;
    column.value = col;
    activePage.value = 1;

    if (!searchString.value) {
      tempOrderByDesc.value = orderByDesc.value;
    }
  };

  // 選擇分頁
  const changeActivePage = (page) => {
    activePage.value = page;

    if (!searchString.value) {
      tempPage.value = page;
    }
  };

  // 音檔、照片、取消 狀態修改
  const updateStatus = (status, type, target) => {
    if (type !== 'cancel') {
      target[`${type}_upload`] = status;
    } else {
      target.cancel_sign_up = status;
    }
  };

  // 更新暱稱
  const updateNickname = (target, n) => {
    target.nickname = n;
  };

  return {
    allData,
    searchString,
    regexp,
    activeGroup,
    tempGroup,
    orderByDesc,
    tempOrderByDesc,
    column,
    activePage,
    tempPage,
    ITEMS_PER_PAGE,

    getAllData,
    completedCount,
    canceledCount,
    searchedData,
    groupedData,
    sortedData,
    paginationData,

    fetchData,
    chooseGroup,
    sortColumn,
    changeActivePage,
    updateStatus,
    updateNickname
  };
});
