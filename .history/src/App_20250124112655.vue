<template>
  <div class="title">请选择商品并下单</div>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
  >
  </a-form>
</template>

<script setup>
const formRef = ref();
</script>

<style scoped></style>
