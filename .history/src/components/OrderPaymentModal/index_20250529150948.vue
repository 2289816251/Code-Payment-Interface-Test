<template>
    <a-modal v-model:open="open" centered :ok-button-props="{ style: { display: 'none' } }" :cancel-button-props="{ style: { display: 'none' } }">
        <a-qrcode :value="qrcodeText" />
      </a-modal>
</template>

<script setup>
let open = ref(true)
let qrcodeText = ref('https://qr.alipay.com/fkx16204cm4pn0vv3q29y04')
const props = defineProps({
    
})
</script>

<style scoped>


</style>