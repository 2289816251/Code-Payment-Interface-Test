<template>
  <div class="title">请选择商品并下单</div>
  <a-form ref="formRef" :model="formState">
    <a-form-item label="商品：" name="commodity">
      <a-select
        v-model:value="formState.commodity"
        placeholder="please select your zone"
      >
        <a-select-option :value v-for="(value,index) in shopInfo" :key="index">{{ value }}</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { ref, reactive } from "vue";
// 引入随机生成商品hooks
import { generateRandomProducts } from '@/hooks/useRandomlyGenerateItems' 

let shopInfo = generateRandomProducts(5)

const formRef = ref();
const formState = reactive({
  commodity:'',
  price:0
});
</script>

<style scoped>
.title{
  margin-bottom: 16px;
  font-size: 32px;
}
</style>
