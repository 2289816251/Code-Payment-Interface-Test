<template>
  <div class="title">请选择商品并下单</div>
  <a-form
    ref="formRef"
    :model="formState"
  >
  </a-form>
</template>

<script setup>
import { ref, reactive } from 'vue';

const formRef = ref();
const formState = reactive({

})
</script>

<style scoped></style>
