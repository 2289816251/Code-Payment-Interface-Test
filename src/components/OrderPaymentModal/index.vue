<template>
  <a-modal
    v-model:open="props.open"
    centered
    :ok-button-props="{ style: { display: 'none' } }"
    :cancel-button-props="{ style: { display: 'none' } }"
    @cancel="emit('closeModel')"
  >
    <div class="title">
      <img :src="props.paymentInfo.image" alt="加载失败！" />
      <span>{{ props.paymentInfo.title }}扫码支付</span>
    </div>
    <!-- 订单状态0 -->
    <template v-if="props.orderStatus == 0">
      <div class="content">
        <p class="price">￥{{ props.orderdata.money }}</p>
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
      </div>
    </template>
    <!-- 支付成功 -->
    <template v-else-if="props.orderStatus == 1">
      <div class="paymentSuccessful">
        <CloseCircleFilled />
        <p>订单已支付</p>
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
            <span class="right">{{ props.orderdata.creation_time }}</span>
          </div>
        </div>
      </div>
    </template>
    <!-- 订单已关闭 -->
    <template v-else-if="props.orderStatus == 2">
      <div class="orderClosed">
        <div class="title">
          <span>商品名称：{{ props.orderdata.name }}</span>
          <div class="orderNumber">
            <span class="order"
              >订单号：{{ props.orderdata.out_trade_no }}</span
            >
            <span class="copy" @click="copyOrderNumber">复制</span>
          </div>
        </div>
        <CloseCircleFilled />
        <p>订单已关闭</p>
        <p>如有疑问请联系<span>客服</span></p>
      </div>
    </template>
    <!-- 支付超时 -->
    <template v-else-if="props.orderStatus == 3">
      <div class="paymentFailed">
        <div class="title">
          <span>商品名称：{{ props.orderdata.name }}</span>
          <div class="orderNumber">
            <span class="order"
              >订单号：{{ props.orderdata.out_trade_no }}</span
            >
            <span class="copy" @click="copyOrderNumber">复制</span>
          </div>
        </div>
        <FrownFilled />
        <p>支付已超时</p>
        <p>如需购买，请重新下单</p>
      </div>
    </template>
    <template v-if="props.orderStatus == 0">
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
          <span class="right">{{ props.orderdata.creation_time }}</span>
        </div>
      </div>
      <a-divider />
      <div class="bottom">
        <ScanOutlined
          :style="{
            color: returnPayTypeColor(props.paymentInfo.type),
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
import { ref, onMounted, onUnmounted, reactive } from "vue";
import { returnPayTypeColor } from "@/hooks/useTool";
import {
  ScanOutlined,
  FrownFilled,
  CloseCircleFilled,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useHomeStore } from "@/stores/home";
const homeStore = useHomeStore();

// 自定义事件
const emit = defineEmits(["closeModel"]);

let countdown = reactive(["05", "00"]);

let timer = ref(null);

const props = defineProps({
  open: Boolean,
  orderdata: Object,
  paymentInfo: Object,
  orderStatus: Number,
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

  return {
    stop: () => {
      clearInterval(intervalId);
    },
  };
};

// 复制订单号
const copyOrderNumber = () => {
  // 使用Clipboard API进行复制
  navigator.clipboard
    .writeText(props.orderdata.out_trade_no)
    .then(() => {
      message.success("复制订单号成功");
    })
    .catch((err) => {
      console.log(err);
      message.error("复制订单号失败");
    });
};

onMounted(() => {
  // 支付倒计时
  timer = startCountdown(
    300, // 倒计时时间（秒）
    (timeStr) => {
      Object.assign(countdown, timeStr.split(":"));
    },
    () => {
      //   console.log("倒计时结束！");
    }
  );
  homeStore.queryOrderStatus();
});
onUnmounted(() => {
  timer.stop();
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
    .paymentSuccessful {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      :deep(svg) {
        font-size: 88px;
        color: #14ce23;
        margin: 10px;
      }
      p {
        font-size: 18px;
        margin-top: 8px;
        margin: 0px;
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
    }
    .orderClosed {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .title {
        display: flex;
        flex-direction: column;
        span {
          font-size: 14px;
        }
        .orderNumber {
          color: #999;
          .copy {
            margin-left: 8px;
            color: blue;
            cursor: pointer;
          }
        }
      }
      :deep(svg) {
        font-size: 88px;
        color: #f50000;
        margin: 10px;
      }
      p {
        font-size: 18px;
        margin-top: 8px;
        margin: 0px;
        span {
          margin-left: 4px;
          color: blue;
          cursor: pointer;
        }
      }
    }
    .paymentFailed {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .title {
        display: flex;
        flex-direction: column;
        span {
          font-size: 14px;
        }
        .orderNumber {
          color: #999;
          .copy {
            margin-left: 8px;
            color: blue;
            cursor: pointer;
          }
        }
      }
      :deep(svg) {
        font-size: 88px;
        color: #f5d000;
        margin: 10px;
      }
      p {
        font-size: 18px;
        margin-top: 8px;
        margin: 0px;
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
