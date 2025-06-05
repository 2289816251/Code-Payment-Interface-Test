<template>
  <a-modal
    v-model:open="props.open"
    centered
    :ok-button-props="{ style: { display: 'none' } }"
    :cancel-button-props="{ style: { display: 'none' } }"
  >
    <div class="title">
      <img :src="props.paymentInfo.image" alt="加载失败！" />
      <span>{{ props.paymentInfo.title }}扫码支付</span>
    </div>
    <div class="content">
      <!-- 订单状态1 -->
      <template v-if="homeStore.orderStatus == 1">
        <p class="price">￥{{ props.orderdata.actualPaymentAmount }}</p>
        <span>请注意付款金额，多付或少付都不行</span>
        <a-qrcode
          :size="224"
          :value="props.orderdata.qrcode"
          :icon="props.paymentInfo.image"
        />
        <p>
          二维码有效时间<span>{{ countdown[0] }}</span
          >分<span>{{ countdown[1] }}</span
          >秒，超时无效
        </p>
      </template>
    </div>
    <template v-if="homeStore.orderStatus == 1">
      <a-divider />
      <div class="shopInfo">
        <div class="list">
          <span class="left">商品名称：</span>
          <span class="right">{{ props.orderdata.name }}</span>
        </div>
        <div class="list">
          <span class="left">订单编号：</span>
          <span class="right">{{ props.orderdata.out_trade_no }}</span>
        </div>
        <div class="list">
          <span class="left">创建时间：</span>
          <span class="right">{{ props.orderdata.orderCreationTime }}</span>
        </div>
      </div>
      <a-divider />
      <div class="bottom">
        <ScanOutlined
          :style="{
            color: props.paymentInfo.type == 'alipay' ? '#027AFF' : '#1AAD19',
          }"
        />
        <div class="text">
          <span>请使用{{ props.paymentInfo.title }}扫一扫</span>
          <span>扫描二维码完成支付</span>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { ScanOutlined } from "@ant-design/icons-vue";
import { useHomeStore } from "@/stores/home";
const homeStore = useHomeStore();

let countdown = reactive(["02", "00"]);
const props = defineProps({
  open: Boolean,
  orderdata: Object,
  paymentInfo: Object,
});
// 倒计时
const startCountdown = (duration, onTick, onComplete) => {
  let remaining = duration;
  const intervalId = setInterval(() => {
    const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
    const seconds = String(remaining % 60).padStart(2, "0");
    onTick(`${minutes}:${seconds}`);

    remaining--;

    if (remaining < 0) {
      clearInterval(intervalId);
      if (onComplete) onComplete();
    }
  }, 1000);
};

onMounted(() => {
  // 支付倒计时
  startCountdown(
    300, // 倒计时时间（秒）
    (timeStr) => {
      Object.assign(countdown, timeStr.split(":"));
    },
    () => {
      //   console.log("倒计时结束！");
    }
  );
  // homeStore.queryOrderStatus()
});
</script>

<style scoped>
.ant-modal {
  .ant-modal-body {
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 42px;
        height: auto;
        margin-right: 8px;
      }
      span {
        font-size: 20px;
      }
    }
    .content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      p {
        margin: 0;

        &.price {
          font-size: 48px;
        }
      }
      span {
        color: red;
        margin: 4px 0;
      }
    }
    .shopInfo {
      display: flex;
      flex-direction: column;
      .list {
        display: flex;
        justify-content: space-between;
        &:not(:last-child) {
          margin-bottom: 4px;
        }
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      justify-content: center;
      :deep(svg) {
        font-size: 56px;
      }
      .text {
        margin-left: 22px;
        display: flex;
        flex-direction: column;
        font-size: 16px;
      }
    }
  }
}
</style>
