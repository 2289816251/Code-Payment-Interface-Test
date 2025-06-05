<template>
    <a-modal v-model:open="open" centered :ok-button-props="{ style: { display: 'none' } }" :cancel-button-props="{ style: { display: 'none' } }">
        <a-qrcode :value="qrcodeText" />
      </a-modal>
</template>

<script setup>
const props = defineProps({
    
})
</script>

<style scoped>


</style>