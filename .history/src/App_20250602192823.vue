<template>
  <div class="title">
    <div class="title">
      请选择商品并下单
    </div>
    <div class="historicalOrder">
      <HistoryOutlined />
    </div>
  </div>
  <a-form ref="formRef" :model="formState">
    <a-row>
      <a-col :span="24">
        <a-form-item label="商品：" name="commodity">
          <a-select
            v-model:value="formState.name"
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
    <a-row v-if="formState.name != '' && formState.money != 0">
      <a-col :span="9">
        <a-form-item label="价格：" name="price">
          <div class="price">{{ formState.money }}</div>
        </a-form-item>
      </a-col>
      <a-col :span="15">
        <a-tooltip>
          <template #title> 此功能仅作展示，不会影响最终结果 </template>
          <a-form-item label="数量：" name="number">
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
          </a-form-item>
        </a-tooltip>
      </a-col>
    </a-row>
  </a-form>
  <div
    class="paymentMethods"
    v-if="formState.name != '' && formState.money != 0"
  >
    <div
      class="item"
      @click="homeStore.switchPaymentMethods(item)"
      :class="item.state ? 'active' : ''"
      v-for="(item, index) in homeStore.paymentMethods"
      :key="index"
    >
      <img :src="item.image" alt="加载失败！" />
      <span>{{ item.title }}</span>
    </div>
  </div>
  <div class="paymentBtn" v-if="formState.name != '' && formState.money != 0">
    <a-button
      size="large"
      type="primary"
      :icon="h(PayCircleOutlined)"
      @click="homeStore.paymentViaAPI(formState)"
      >去支付</a-button
    >
  </div>
  <!-- 扫码支付弹窗 -->
  <OrderPaymentModal
    v-if="homeStore.payModelIsShow"
    :open="homeStore.payModelIsShow"
    :orderdata="homeStore.ordersData"
    :paymentInfo="homeStore.paymentInfo"
    :orderStatus="homeStore.orderStatus"
  />
</template>

<script setup>
import { ref, reactive, watch, onMounted, h } from "vue";
import { PayCircleOutlined, HistoryOutlined } from "@ant-design/icons-vue";
import OrderPaymentModal from "@/components/OrderPaymentModal/index.vue";
import { useHomeStore } from "@/stores/home";
const homeStore = useHomeStore();
// 引入随机生成商品hooks
import { generateRandomProducts } from "@/hooks/useRandomlyGenerateItems";
let shopInfo = generateRandomProducts(5);

const formRef = ref();
const formState = reactive({
  name: "",
  money: 0,
  number: 1,
  param: 'Star-2025'
});

// 减数量
const shopNumberDel = function () {
  if (formState.number <= 1) return;
  formState.number--;
};

// 加数量
const shopNumberAdd = function () {
  if (formState.number >= 99) return;
  formState.number++;
};

onMounted(() => {
  // 监控商品变化
  watch(
    () => formState.name,
    (newData, oldData) => {
      // 计算出当前选中的商品
      let result = shopInfo.filter((data, i) => {
        return data.name == formState.name;
      });
      formState.money = result[0].price;
    },
    {
      deep: true,
    }
  );
  homeStore.init()
});
</script>

<style scoped>
.title {
  margin-bottom: 16px;
  font-size: 32px;
}
.ant-form {
  width: 256px;
  .price {
    color: rgb(255, 0, 0);
    font-size: 18px;
    font-weight: 600;
  }
  :deep(.ant-row) {
    .ant-input-number-group-addon {
      cursor: pointer;
    }
  }
}
.paymentMethods {
  width: 256px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  height: 46px;
  .item {
    /* width: 100%; */
    height: 100%;
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    img {
      width: 24px;
      height: 24px;
    }
    span {
      margin-left: 8px;
    }
    &.active {
      border: 2px solid rgb(43, 162, 241);
      margin: -2px;
      /* padding: calc(8px - 4px) calc(16px - 4px); */
    }
  }
}
.paymentBtn {
  width: 256px;
  button {
    width: 100%;
  }
}
</style>
