<template>
    <a-modal v-model:open="open" centered :title="props.title" :ok-button-props="{ style: { display: 'none' } }" :cancel-button-props="{ style: { display: 'none' } }">
        <a-qrcode :value="qrcodeText" />
      </a-modal>
</template>

<script setup>
const props = defineProps({
    title:String
})
</script>

<style scoped>


</style>