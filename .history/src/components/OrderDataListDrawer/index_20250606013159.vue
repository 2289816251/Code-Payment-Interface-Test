<template>
  <a-drawer
    v-model:open="props.open"
    class="custom-class"
    root-class-name="root-class-name"
    title="历史订单记录"
    :closable="false"
    placement="right"
    width="70%"
    @close="emit('closeModel')"
  >
    <div class="titleBtn">
      <a-button @click="refreshTableData" type="primary" :loading="isSelectState.refreshLoading">
        <template #icon><RedoOutlined /></template>
        刷新
      </a-button>
      <a-button @click="deleteTableData" type="primary" :loading="isSelectState.deleteLoading" :disabled="isSelectState.selectedRowKeys.length <= 0" danger>
        <template #icon><DeleteOutlined /></template>
        删除
      </a-button>
      <span>
        <template v-if="isSelectState.selectedRowKeys.length >= 1">
          {{ `已选中 ${isSelectState.selectedRowKeys.length} 条订单` }}
        </template>
      </span>
    </div>
    <a-table
     bordered
     :columns="columns"
     :data-source="data"
     :scroll="{ x: 1000, y: 634}"
     :expand-column-width="100"
     :row-selection="{ checkStrictly:true, selectedRowKeys: isSelectState.selectedRowKeys, onChange: onSelectChange }"
     :pagination="pagination"
     @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <!-- 修改type -->
        <template v-if="column.key === 'type'">
          {{ isType(record.type) }}
        </template>
        <!-- 修改状态 -->
        <template v-if="column.key === 'status'">
          <a-tag :color="isStatus(record.status).color">{{ isStatus(record.status).text }}</a-tag>
        </template>
      </template>
    </a-table>
  </a-drawer>
</template>

<script setup>
import { reactive, onMounted, ref, onUpdated } from "vue";
import { DeleteOutlined, RedoOutlined } from '@ant-design/icons-vue';

// props数据
const props = defineProps({
  open: Boolean,
  orderdata: Array,
});

// 自定义事件
const emit = defineEmits(['deleteTableData', 'refreshTableData', 'closeModel'])

// 表格列配置项
let columns = reactive([
    {
        title: '商品名',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true, // 单元格自动省略
        align:'center', // 居中
        fixed: 'left', // 列是否固定
        width: 150
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
        title: '支付方式',
        dataIndex: 'type',
        key: 'type',
        align:'center',
        width: 100
    },
    {
        title: '订单号',
        dataIndex: 'out_trade_no',
        key: 'out_trade_no',
        align:'center',
        width: 300
    },
    {
        title: '订单创建时间',
        dataIndex: 'time',
        key: 'time',
        align:'center',
        width: 150
    },
    {
        title: '来源',
        dataIndex: 'device',
        key: 'device',
        align:'center',
        width: 80
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align:'center',
        fixed: 'right', // 列是否固定
        width: 180
    },
]);

// 表格数据
let data = reactive([]);

// 分页配置
const pagination = ref({
  position: ['bottomRight'],
  current: 1,      // 当前页码
  pageSize: 8,    // 每页条数
  total: 99,       // 数据总数（需从后端获取）
  showSizeChanger: true, // 显示分页大小切换器
  pageSizeOptions: ['8', '16', '32'], // 可选分页大小
  showTotal: total => `共 ${total} 条数据`, // 显示总数
});

// 表格是否选中状态
const isSelectState = reactive({
  // 被选中行的key值
  selectedRowKeys: [],
  // 删除按钮状态
  deleteLoading: false,
  // 刷新按钮状态
  refreshLoading: false,
});

// 选择按钮状态改变 保存数据
const onSelectChange = (selectedRowKeys) => {
  isSelectState.selectedRowKeys = selectedRowKeys
};

// 表格变化事件（分页/排序/筛选）
const handleTableChange = (pag, filters, sorter) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
};

// 删除按钮
const deleteTableData = ()=>{
    emit('deleteTableData',isSelectState.selectedRowKeys)
}

// 刷新按钮
const refreshTableData = ()=>{
  isSelectState.refreshLoading = true
  emit('refreshTableData')
  let i = 0
  let timer = setInterval(() => {
    i++
    if(i >= 5){
      isSelectState.refreshLoading = false
      clearInterval(timer)
      return
    }
  }, 1000);
}

// 初始化
const init = () => {
  // 清楚data数据
  data.length = 0
  // 给数据添加key
  props.orderdata.forEach((e, index) => {
    data.push(e)
    data[index].key = e.id
  });
  // 设置订单总数
  pagination.value.total = data.length
};

// 判断type
const isType = (type)=>{
    if(type == 'wxpay') return '微信'
    if(type == 'alipay') return '支付宝'
    return type
}
// 判断状态
const isStatus = (status)=>{
    if(status == '1'){
        return {
            text:'待支付',
            color:'default'
        }
    }else if(status == '2'){
        return {
            text:'已支付',
            color:'success'
        }
    }else if(status == '3'){
        return {
            text:'订单已关闭',
            color:'error'
        }
    }else if(status == '4'){
        return {
            text:'支付超时',
            color:'warning'
        }
    }else{
        return {
            text:'未知',
            color:'default'
        }
    }
}

// 组件挂载
onMounted(()=>{
    // 初始化
    init()
})
// 组件更新
onUpdated(()=>{
  // 重新初始化
  init()
})
</script>

<style scoped>
.titleBtn{
    margin-bottom: 20px;
    button:not(:last-child){
        margin-right:10px;
    }
}
</style>
