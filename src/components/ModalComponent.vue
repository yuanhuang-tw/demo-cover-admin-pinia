<script setup>
import { ref, watch } from 'vue';

const API_URL = import.meta.env.VITE_API_URL;

const props = defineProps({ userNo: String });

const detailData = ref('');

watch(
  () => props.userNo,
  (newVal) => {
    if (newVal) {
      fetch(`${API_URL}/detail-db.php?u=${newVal}`)
        .then((res) => res.json())
        .then((data) => (detailData.value = data[0]))
        .catch((err) => console.log(err));
    }
  }
);
</script>

<template>
  <div
    class="modal fade"
    id="detailModal"
    tabindex="-1"
    aria-labelledby="detailModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="detailModalLabel"></h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <table class="table table-bordered">
            <tbody>
              <tr>
                <th scope="row" width="220">ID</th>
                <td>{{ detailData.no }}</td>
              </tr>
              <tr>
                <th scope="row">Name</th>
                <td>{{ detailData.name }}</td>
              </tr>
              <tr>
                <th scope="row">Nickname</th>
                <td>{{ detailData.nickname }}</td>
              </tr>
              <tr>
                <th scope="row">Group</th>
                <td>{{ detailData.group }}</td>
              </tr>
              <tr>
                <th scope="row">Singer / Song</th>
                <td>
                  <span v-html="detailData.singer"></span> /
                  <span v-html="detailData.song"></span>
                </td>
              </tr>
              <tr>
                <th scope="row">Gender</th>
                <td>{{ detailData.gender }}</td>
              </tr>
              <tr>
                <th scope="row">Birth</th>
                <td>{{ detailData.birth }}</td>
              </tr>
              <tr>
                <th scope="row">Phone</th>
                <td>{{ detailData.phone }}</td>
              </tr>
              <tr>
                <th scope="row">Email</th>
                <td>{{ detailData.email }}</td>
              </tr>
              <tr>
                <th scope="row">Nationality</th>
                <td>{{ detailData.nationality }}</td>
              </tr>
              <tr>
                <th scope="row">City</th>
                <td>{{ detailData.city }}</td>
              </tr>
              <tr>
                <th scope="row">Occupation</th>
                <td>{{ detailData.occupation }}</td>
              </tr>
              <tr>
                <th scope="row">Know</th>
                <td>{{ detailData.know }}</td>
              </tr>
              <tr>
                <th scope="row">照片</th>
                <td>
                  <template v-if="detailData.img_upload === 'y'">
                    <i class="fa fa-check-circle text-success" aria-hidden="true"></i> OK
                  </template>
                </td>
              </tr>
              <tr>
                <th scope="row">音檔</th>
                <td>
                  <template v-if="detailData.audio_upload === 'y'">
                    <i class="fa fa-check-circle text-info" aria-hidden="true"></i> OK
                  </template>
                </td>
              </tr>
              <tr>
                <th scope="row">取消報名</th>
                <td>
                  <template v-if="detailData.cancel_sign_up === 'y'">
                    <i class="fa fa-check-circle text-danger" aria-hidden="true"></i> 已取消報名
                  </template>
                </td>
              </tr>
              <tr>
                <th scope="row">Guardian Name</th>
                <td>{{ detailData.guardian_name }}</td>
              </tr>
              <tr>
                <th scope="row">Guardian Phone</th>
                <td>{{ detailData.guardian_phone }}</td>
              </tr>
              <tr>
                <th scope="row">Date</th>
                <td>{{ detailData.insertDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
