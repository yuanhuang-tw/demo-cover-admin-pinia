<script setup>
import { ref, onMounted } from 'vue';

const API_URL = import.meta.env.VITE_API_URL;

// store
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();

// component
import ModalComponent from '@/components/ModalComponent.vue';
import CustomButton from '@/components/CustomButton.vue';

const highlight = (string) => {
  return string.replace(userStore.regexp, (match) => {
    if (match !== '') {
      return `<span style="background-color: #eee9b9; font-weight: bold;">${match}</span>`;
    }

    return match;
  });
};

// modal
const userNo = ref('');

const showDetail = (no) => (userNo.value = no);

// msg
const msg = ref(null);

const showMsg = (nickname, type) => {
  const p = document.createElement('p');

  p.classList.add('py-3', 'px-2', 'text-center', 'fs-5', 'fade-msg');

  if (type === 'img') {
    p.classList.add('bg-success', 'text-white');
    p.innerHTML = `<i class="fa fa-check-circle" aria-hidden="true"></i> ${nickname} 照片狀態已修改`;
  }

  if (type === 'audio') {
    p.classList.add('bg-info', 'text-dark');
    p.innerHTML = `<i class="fa fa-check-circle" aria-hidden="true"></i> ${nickname} 音檔狀態已修改`;
  }

  if (type === 'cancel') {
    p.classList.add('bg-danger', 'text-white');
    p.innerHTML = `<i class="fa fa-check-circle" aria-hidden="true"></i> ${nickname} 已取消報名`;
  }

  if (type === 'nickname') {
    p.classList.add('bg-secondary-subtle', 'text-dark');
    p.innerHTML = `<i class="fa fa-check-circle" aria-hidden="true"></i> ${nickname} 已更改暱稱`;
  }

  msg.value.appendChild(p);

  setTimeout(() => p.remove(), 3000);
};

// edit
let keyName;

const edit = (item, e) => {
  const ta = e.currentTarget;

  if (ta.parentElement.parentElement.firstElementChild.innerHTML.includes('text-dange')) {
    return;
  }

  ta.classList.remove('edit');

  const tempHtml = ta.innerHTML;

  ta.innerHTML = '<input type="text" name="nickname">';

  const input = ta.querySelector('input');

  input.value = item.nickname;
  input.focus();

  const copyHtml = () => {
    if (keyName !== 'Enter') {
      ta.innerHTML = tempHtml;
    }

    ta.classList.add('edit');

    keyName = '';
  };

  input.addEventListener('blur', () => copyHtml());

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.blur();
    }

    const newInput = input.value.trim();

    if (e.key === 'Enter' && newInput) {
      keyName = 'Enter';
      input.blur();

      const formData = new FormData();
      formData.append('user_no', item.no);
      formData.append('nickname', newInput);

      fetch(`${API_URL}/status-db.php`, { method: 'POST', body: formData })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'ok') {
            userStore.updateNickname(item, newInput);
            showMsg(newInput, 'nickname');
          }
        })
        .catch((err) => console.log(err));
    }
  });
};

onMounted(() => {
  const myModalEl = document.getElementById('detailModal');
  myModalEl.addEventListener('hidden.bs.modal', () => (userNo.value = ''));
});
</script>

<template>
  <p class="text-center mb-1">
    本組別共有 <b>{{ userStore.sortedData.length }}</b> 筆資料
  </p>

  <table class="table table-bordered table-hover">
    <thead>
      <tr class="text-center">
        <th class="sort-th" @click="userStore.sortColumn('no')">
          ID
          <i
            class="fa"
            :class="userStore.orderByDesc ? 'fa-caret-down' : 'fa-caret-up'"
            aria-hidden="true"
          ></i>
        </th>
        <th>姓名</th>
        <th>暱稱</th>
        <th>組別</th>
        <th>歌手</th>
        <th>歌名</th>
        <th>Email</th>
        <th>照片</th>
        <th>音檔</th>
        <th width="120"></th>
        <th width="120"></th>
        <th width="120"></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in userStore.paginationData"
        :key="item.no"
        :class="{ 'fw-light': item.cancel_sign_up === 'y' }"
      >
        <td>
          <a
            href=""
            class="text-decoration-none d-block"
            data-bs-toggle="modal"
            data-bs-target="#detailModal"
            @click="showDetail(item.no)"
            >{{ item.no }}</a
          >
          <i
            class="fa fa-times-circle text-danger"
            aria-hidden="true"
            v-if="item.cancel_sign_up === 'y'"
          ></i>
        </td>
        <td>{{ item.name }}</td>
        <td>
          <div
            v-html="highlight(item.nickname)"
            @dblclick="edit(item, $event)"
            class="position-relative"
            :class="{ edit: item.cancel_sign_up !== 'y' }"
          ></div>
        </td>
        <td>{{ item.group }}</td>
        <td v-html="item.singer"></td>
        <td v-html="item.song"></td>
        <td>{{ item.email }}</td>
        <td
          class="text-center text-success"
          :class="{ 'text-opacity-50': item.cancel_sign_up === 'y' }"
        >
          <template v-if="item.img_upload === 'y'">
            <i class="fa fa-check-circle" aria-hidden="true"></i>
          </template>
        </td>
        <td
          class="text-center text-info"
          :class="{ 'text-opacity-50': item.cancel_sign_up === 'y' }"
        >
          <template v-if="item.audio_upload === 'y'">
            <i class="fa fa-check-circle" aria-hidden="true"></i>
          </template>
        </td>
        <td>
          <CustomButton :no="item.no" btn-type="img" @show-msg="showMsg"></CustomButton>
        </td>
        <td>
          <CustomButton :no="item.no" btn-type="audio" @show-msg="showMsg"></CustomButton>
        </td>
        <td>
          <CustomButton :no="item.no" btn-type="cancel" @show-msg="showMsg"></CustomButton>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Modal -->
  <ModalComponent :user-no="userNo"></ModalComponent>

  <!-- msg -->
  <div class="msg-container w-25" ref="msg"></div>
</template>

<style>
.sort-th {
  cursor: pointer;
}

.msg-container {
  position: fixed;
  bottom: 1rem;
  z-index: 3;
}

.msg-container p {
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
}

.msg-container .fade-msg {
  animation: fade-in-out 4s;
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  16% {
    opacity: 1;
    transform: translateX(0);
  }
  67% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(0);
  }
}

.edit::after {
  display: inline-block;
  content: '\f040';
  font-family: FontAwesome;
  opacity: 0;
  position: absolute;
  top: 2px;
  right: 2px;
  transition: opacity 0.3s ease-in-out;
}

.edit:hover::after {
  opacity: 1;
}
</style>
