<template>
  <section class="table">
    <div v-for="(item, index) in tableData" :key="index" class="tableItem">
      <div class="tableItemInfo">
        <div class="name">{{ item.formName }}</div>
        <div class="state">
          <el-tag
            :type="searchOption.length ? searchOption[item.state].type : 'none'"
            >{{ searchOption.length && searchOption[item.state].label }}</el-tag
          >
          <div v-if="item.state !== 0" class="stateText">
            {{ item.quantity || 0 }} 份
          </div>
        </div>

        <div class="createBy">创建人：{{ item.createBy }}</div>
        <div class="createTime">
          创建时间：{{ timeChange(item.createTime) }}
        </div>
      </div>

      <div class="tableItemActRow">
        <el-button
          v-for="(valueNum, valueIndex) in buttonList"
          v-show="
            actButtonShow(item.allOperationFlag, valueNum.value) &&
            $inAuthority(valueNum.stateId, 0)
          "
          :key="valueIndex"
          type="text"
          :disabled="buttonDisabled(valueNum, item)"
          @click="itemClick(valueNum.value, item)"
          :class="valueNum.colorName"
          >{{ valueNum.title }}</el-button
        >
      </div>
    </div>
    <div v-if="tableData.length === 0" class="noData">暂无数据</div>
  </section>
</template>

<script>
import dayjs from "dayjs";
import { listStatus } from "@/current";

export default {
  name: "BaseList",
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchOption: [],
      buttonList: [
        {
          title: "编辑",
          value: "0",
          colorName: "noneColor",
          stateId: "1761990651508580379",
        },
        {
          title: "发布",
          value: "1",
          colorName: "noneColor",
          stateId: "1761990651508580381",
        },
        {
          title: "数据",
          value: "2",
          colorName: "noneColor",
          stateId: "1761990651508580384",
        },
        {
          title: "删除",
          value: "3",
          colorName: "dangerColor",
          stateId: "1761990651508580380",
        },
        {
          title: "停止",
          value: "4",
          colorName: "dangerColor",
          stateId: "1761990651508580382",
        },
        {
          title: "链接",
          value: "5",
          colorName: "noneColor",
          stateId: "1761990651508580383",
        },
      ],
    };
  },
  mounted() {
    this.searchOption = listStatus;
  },
  methods: {
    timeChange(time) {
      return dayjs.unix(time / 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    itemClick(value, item) {
      const userAgent = /mobile|iphone|ipad|android/.test(
        navigator.userAgent.toLowerCase()
      );

      if (userAgent && value === '0') {
        this.$message.error("请在电脑端编辑");
        return;
      } else {
        this.$emit("on-window", { value, item });
      }
    },
    actButtonShow(state, value) {
      if (
        !state &&
        (value === "0" || value === "1" || value === "3" || value === "4")
      ) {
        return false;
      }
      return true;
    },
    buttonDisabled(data, item) {
      // if (data.value === "0" && item.state === 1) {
      //   return true;
      // } else
      if (data.value === "1" && item.state === 1) {
        return true;
      } else if (data.value === "3" && item.state === 1) {
        return true;
      } else if (data.value === "4" && item.state !== 1) {
        return true;
      } else if (data.value === "5" && item.state !== 1) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="less" scoped>
.table {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding-top: 32px;

  .tableItem {
    display: flex;
    flex-direction: column;
    width: 24%;
    color: rgba(80, 80, 80, 1);
    background-color: rgba(255, 255, 255, 1);
    border-radius: 10px;
    margin-bottom: 24px;
    margin-right: 1%;
    &:nth-child(4n) {
      margin-right: 0%;
    }

    .tableItemInfo {
      flex: 1;
      box-sizing: border-box;
      padding: 25px 16px 8px;
      .name {
        color: rgba(80, 80, 80, 1);
        font-size: 16px;
        font-weight: bold;
      }
      .state {
        display: flex;
        align-items: center;
        padding: 10px 0;
        .stateText {
          padding-left: 14px;
          color: rgba(80, 80, 80, 1);
          font-size: 14px;
        }
      }
      .createBy {
        color: rgba(80, 80, 80, 1);
        font-size: 14px;
      }
      .createTime {
        font-size: 14px;
        padding: 10px 0;
      }
    }
    .tableItemActRow {
      border-top: 1px solid rgba(221, 221, 221, 1);
      height: 44px;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 0 18px;
      font-size: 14px;

      .noneColor {
        color: rgba(80, 80, 80, 1);
        &:hover {
          color: #66b1ff;
        }
      }
      .dangerColor {
        color: rgba(80, 80, 80, 1);
        &:hover {
          color: #f56c6c;
        }
      }
    }
  }

  @media (max-width: 1600px) {
    .tableItem {
      width: 32%;
      margin-right: 1%;
      &:nth-child(4n) {
        margin-right: 1%;
      }
    }
  }

  @media (max-width: 1200px) {
    .tableItem {
      width: 49%;
      margin-right: 1%;
    }
  }
}

.noData {
  width: 100%;
  padding: 40px;
  text-align: center;
  color: rgba(80, 80, 80, 1);
  font-size: 28px;
  font-weight: bold;
}

@media (max-width: 1000px) {
  .table {
    display: flex;
    flex-wrap: wrap;
    padding-top: 0;
    .tableItem {
      width: 100%;
      margin-right: 0%;
    }
  }

  .noData {
    width: 100%;
    padding: 40px;
    text-align: center;
    color: rgba(80, 80, 80, 1);
    font-size: 28px;
    font-weight: bold;
  }
}
</style>
