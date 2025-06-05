<template>
  <a-modal
    v-model:open="open"
    centered
    :ok-button-props="{ style: { display: 'none' } }"
    :cancel-button-props="{ style: { display: 'none' } }"
  >
    <div class="title">
      <img :src="1" alt="加载失败！" />
      <span>{{ paymentInfo.title ? paymentInfo.title : '' }}扫码支付</span>
    </div>
    <a-qrcode :value="props.data.qrcode" />
  </a-modal>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useHomeStore } from "@/stores/home";
const homeStore = useHomeStore();

let open = ref(true);
let paymentInfo = ref({})
const props = defineProps({
  data: Object,
});

console.log(props.data)
// paymentMethods

// 根据传入的支付方式返回对应数据
const paymentMethodReturnData = ()=>{
    let data = homeStore.paymentMethods.filter((item,index)=>{
        return item.type == props.data.type
    })[0]
    return data
}
</script>

<style scoped></style>
