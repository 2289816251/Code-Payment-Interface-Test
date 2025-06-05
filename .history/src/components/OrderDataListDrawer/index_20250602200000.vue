<template>
  <a-drawer
    v-model:open="props.open"
    class="custom-class"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    style="color: red"
    title="Basic Drawer"
    placement="right"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  orderdata: Array
});
console.log(props.orderdata)
</script>

<style scoped></style>
