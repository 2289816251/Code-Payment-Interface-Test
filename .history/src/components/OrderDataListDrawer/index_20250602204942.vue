<template>
  <a-drawer
    v-model:open="props.open"
    class="custom-class"
    root-class-name="root-class-name"
    title="历史订单记录"
    :closable="false"
    @close="onClose"
    placement="right"
  >
    <a-table :data-source="props.orderdata">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span>
            <!-- <smile-outlined /> -->
            Name
          </span>
        </template>
      </template>

      <!-- <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a>
            {{ record.name }}
          </a>
        </template>
        <template v-else-if="column.key === 'tags'">
          <span>
            <a-tag
              v-for="tag in record.tags"
              :key="tag"
              :color="
                tag === 'loser'
                  ? 'volcano'
                  : tag.length > 5
                  ? 'geekblue'
                  : 'green'
              "
            >
              {{ tag.toUpperCase() }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a>Invite 一 {{ record.name }}</a>
            <a-divider type="vertical" />
            <a>Delete</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link">
              More actions
              <down-outlined />
            </a>
          </span>
        </template>
      </template> -->
    </a-table>
  </a-drawer>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  orderdata: Array,
});

// 给数据添加key
props.orderdata.forEach((e,index)=>{
    e.key = e.id
})

console.log(props.orderdata)

const onClose = () => {};
</script>

<style scoped></style>
