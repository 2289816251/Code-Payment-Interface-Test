<template>
  <a-modal
    v-model:open="open"
    centered
    :ok-button-props="{ style: { display: 'none' } }"
    :cancel-button-props="{ style: { display: 'none' } }"
  >
    <div class="title">
      <img :src="1" alt="加载失败！" />
      <span>扫码支付</span>
    </div>
    <a-qrcode :value="qrcodeText" />
  </a-modal>
</template>

<script setup>
import { ref } from "vue";
import { useHomeStore } from "@/stores/home";
const homeStore = useHomeStore();

let open = ref(true);
let qrcodeText = ref("https://qr.alipay.com/fkx16204cm4pn0vv3q29y04");
const props = defineProps({
  data: Object,
});

console.log(props.data)
// paymentMethods

// 根据传入的支付方式返回对应数据
const paymentMethodReturnData = ()=>{

}
</script>

<style scoped></style>
