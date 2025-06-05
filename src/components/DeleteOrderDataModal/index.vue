<template>
  <a-modal
    :title="`危险操作！确认删除以下${props.orderdata.length}个订单？`"
    v-model:open="props.open"
    okText="确认"
    cancelText="取消"
    centered
    @cancel="emit('closeModel')"
    @ok="deleteTableData"
    :confirmLoading="isLoading"
    :zIndex="99999999"
  >
    <a-table
      bordered
      :columns="columns"
      :data-source="props.orderdata ? props.orderdata : []"
      :scroll="{ x: 600, y: 400 }"
      :expand-column-width="100"
      size="small"
      :pagination="false"
    >
    </a-table>
  </a-modal>
</template>

<script setup>
import { reactive, ref } from 'vue'
const props = defineProps({
  open: Boolean,
  orderdata: Array,
});
// 自定义事件
const emit = defineEmits(["closeModel", "ok"]);
// 表格列配置项
let columns = reactive([
    {
        title: '商品名',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true, // 单元格自动省略
        align:'center', // 居中
        fixed: 'left', // 列是否固定
        width: 140
    },
    {
        title: '数量',
        dataIndex: 'number',
        key: 'number',
        align:'center',
        width: 80
    },
    {
        title: '支付金额',
        dataIndex: 'money',
        key: 'money',
        align:'center',
        width: 100
    },
    {
        title: '备注',
        dataIndex: 'param',
        key: 'param',
        align:'center',
        width: 150
    },
    {
        title: '订单号',
        dataIndex: 'out_trade_no',
        key: 'out_trade_no',
        align:'center',
        width: 300
    }
]);

const isLoading = ref(false)

let timer = null

// 删除表格数据
const deleteTableData = ()=>{
  isLoading.value = true
  emit('ok',props.orderdata)
  let i = 0
  timer = setInterval(() => {
    i++
    if(i >= 5){
      isLoading.value = false
      clearInterval(timer)
      return
    }
  }, 1000);
}

</script>

<style scoped></style>
