<template>
  <div class="title">请选择商品并下单</div>
  <a-form ref="formRef" :model="formState">
    <a-row>
      <a-col :span="24">
        <a-form-item label="商品：" name="commodity">
          <a-select
            v-model:value="formState.commodity"
            placeholder="please select your zone"
          >
            <a-select-option
              :value="data.name"
              v-for="(data, index) in shopInfo"
              :key="index"
              >{{ data.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row v-if="formState.commodity != '' && formState.price != 0">
      <a-col :span="9">
        <a-form-item label="价格：" name="price">
          <div class="price">{{ formState.price }}</div>
        </a-form-item>
      </a-col>
      <a-col :span="15">
        <a-form-item label="数量：" name="number">
          <a-tooltip>
            <template #title> 11 </template>
            <a-input-number
              id="inputNumber"
              class="inputNumber"
              v-model:value="formState.number"
              :min="1"
              :max="99"
            >
              <template #addonBefore>
                <span @click="shopNumberDel"> - </span>
              </template>
              <template #addonAfter>
                <span @click="shopNumberAdd"> + </span>
              </template>
            </a-input-number>
          </a-tooltip>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
// 引入随机生成商品hooks
import { generateRandomProducts } from "@/hooks/useRandomlyGenerateItems";

let shopInfo = generateRandomProducts(5);

const formRef = ref();
const formState = reactive({
  commodity: "",
  price: 0,
  number: 1,
});

const shopNumberDel = function () {
  if (formState.number <= 1) return;
  formState.number--;
};

const shopNumberAdd = function () {
  if (formState.number >= 99) return;
  formState.number++;
};

onMounted(() => {
  // 监控商品变化
  watch(
    () => formState.commodity,
    (newData, oldData) => {
      // 计算出当前选中的商品
      let result = shopInfo.filter((data, i) => {
        return data.name == formState.commodity;
      });
      formState.price = result[0].price;
    },
    {
      deep: true,
    }
  );
});
</script>

<style scoped>
.title {
  margin-bottom: 16px;
  font-size: 32px;
}
.ant-form {
  width: 256px;
  :deep(.ant-row) {
    .ant-input-number-group-addon {
      cursor: pointer;
    }
  }
}
</style>
