<template>
  <div class="title">请选择商品并下单</div>
  <a-form ref="formRef" :model="formState">
    <a-form-item label="Activity zone" name="region">
      <a-select
        v-model:value="formState.region"
        placeholder="please select your zone"
      >
        <a-select-option value="shanghai">Zone one</a-select-option>
        <a-select-option value="beijing">Zone two</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { ref, reactive } from "vue";

const formRef = ref();
const formState = reactive({});
</script>

<style scoped></style>
