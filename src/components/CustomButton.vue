<script setup>
import { computed } from 'vue';

const API_URL = import.meta.env.VITE_API_URL;

// store
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();

// props
const props = defineProps({ no: String, btnType: String });

// emit
const emit = defineEmits(['showMsg']);

const target = userStore.paginationData.find((item) => item.no === props.no);

const disable = computed(() => target.cancel_sign_up === 'y');

const btnClass = computed(() => ({
  'btn-success': props.btnType === 'img',
  'btn-info': props.btnType === 'audio',
  'btn-danger': props.btnType === 'cancel'
}));

const uploadOkBtn = () => {
  let status;

  if (props.btnType === 'img') {
    status = target.img_upload === 'y' ? '' : 'y';
  }

  if (props.btnType === 'audio') {
    status = target.audio_upload === 'y' ? '' : 'y';
  }

  if (props.btnType === 'cancel') {
    if (confirm('確定要取消報名嗎？') === false) {
      return;
    }

    status = 'y';
  }

  const formData = new FormData();
  formData.append('user_no', props.no);

  if (props.btnType === 'img') {
    formData.append('img_status', status);
  }

  if (props.btnType === 'audio') {
    formData.append('audio_status', status);
  }

  if (props.btnType === 'cancel') {
    formData.append('cancel_status', status);
  }

  fetch(`${API_URL}/status-db.php`, { method: 'POST', body: formData })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 'ok') {
        userStore.updateStatus(status, props.btnType, target);
        emit('showMsg', target.nickname, props.btnType);
      }
    })
    .catch((err) => console.log(err));
};
</script>

<template>
  <button
    type="button"
    class="btn w-100"
    :class="btnClass"
    :disabled="disable"
    @click="uploadOkBtn()"
  >
    <template v-if="props.btnType === 'img'">照片</template>
    <template v-if="props.btnType === 'audio'">音檔</template>
    <template v-if="props.btnType === 'cancel'">取消</template>
  </button>
</template>
