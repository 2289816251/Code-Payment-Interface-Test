<template>
  <div class="title">请选择商品并下单</div>
  <a-form ref="formRef" :model="formState">
    <a-form-item label="商品：" name="commodity">
      <a-select
        v-model:value="formState.commodity"
        placeholder="please select your zone"
      >
        <a-select-option
          :value="data.name"
          v-for="(data, index) in shopInfo"
          :key="index"
          >{{ data.name }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item label="价格：" name="price" :span="4">
      <div class="price">{{ formState.price }}</div>
    </a-form-item>
    <a-form-item label="数量：" name="number">
      <a-input-number
        id="inputNumber"
        class="inputNumber"
        v-model:value="formState.number"
        :min="1"
        :max="99"
      >
        <template #addonBefore>
          <span @click="shopNumberDel"> - </span>
        </template>
        <template #addonAfter>
          <span @click="shopNumberAdd"> + </span>
        </template>
      </a-input-number>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { ref, reactive } from "vue";
// 引入随机生成商品hooks
import { generateRandomProducts } from "@/hooks/useRandomlyGenerateItems";

let shopInfo = generateRandomProducts(5);

const formRef = ref();
const formState = reactive({
  commodity: "",
  price: 0,
  number:1
});
</script>

<style scoped>
.title {
  margin-bottom: 16px;
  font-size: 32px;
}
</style>
