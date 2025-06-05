<template>
  <a-modal
    v-model:open="open"
    centered
    :ok-button-props="{ style: { display: 'none' } }"
    :cancel-button-props="{ style: { display: 'none' } }"
  >
    <div class="title">
      <img :src="props.paymentInfo.image" alt="加载失败！" />
      <span>{{ props.paymentInfo.title }}扫码支付</span>
    </div>
    <a-qrcode :value="props.orderdata.qrcode" />
  </a-modal>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useHomeStore } from "@/stores/home";
const homeStore = useHomeStore();

let open = ref(true);
const props = defineProps({
  orderdata: Object,
  paymentInfo: Object,
});

console.log(props.orderdata);
// paymentMethods
</script>

<style scoped>
.ant-modal {
  .ant-modal-body {
    .title {
      img {
        width: 48px;
        height: auto;
      }
      span{
        font-size: 20px;
      }
    }
  }
}
</style>
