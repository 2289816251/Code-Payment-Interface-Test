<template>
  <a-drawer
    v-model:open="props.open"
    class="custom-class"
    root-class-name="root-class-name"
    title="历史订单记录"
    @close="onClose"
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
const onClose = ()=>{
    
}
</script>

<style scoped></style>
