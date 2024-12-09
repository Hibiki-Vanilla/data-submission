<template>
  <section class="infoList">
    <div v-for="(item, index) in tableData" :key="index" class="tableItem">
      <div class="tableItemInfo">
        <div class="name">{{ item.formName }}</div>
        <div class="createTime">
          {{ $t("editList.createdTime") }}：{{ timeChange(item.createTime) }}
        </div>
      </div>
      <div class="tableItemActRow">
        <el-tooltip
          effect="dark"
          :manual="item.state === 1"
          :content="$t('editFill.noTime')"
          placement="top-start"
        >
          <el-button
            v-show="$inAuthority('1761990651508580389', 0)"
            type="text"
            :disabled="item.state !== 1"
            @click="onEdit(item)"
            >{{ $t("editList.fill") }}</el-button
          >
        </el-tooltip>
        <el-button
          v-show="$inAuthority('1761990651508580388', 0)"
          type="text"
          @click="onList(item)"
          >{{ $t("editList.record") }}</el-button
        >
      </div>
    </div>
    <div v-if="tableData.length === 0" class="noData">
      {{ $t("editInfo.noData") }}
    </div>
  </section>
</template>

<script>
import dayjs from "dayjs";
export default {
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {
    timeChange(time) {
      return dayjs.unix(time / 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    onEdit(item) {
      this.$router.push(`/fillIn/${item.id}`);
    },
    onList(item) {
      this.$router.push(`/fillInList/${item.id}`);
    },
  },
};
</script>

<style lang="less" scoped>
.infoList {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .tableItem {
    display: flex;
    flex-direction: column;
    height: 172px;
    width: 24%;
    color: rgba(80, 80, 80, 1);
    background-color: rgba(255, 255, 255, 1);
    border-radius: 10px;
    margin-right: 1%;
    margin-bottom: 24px;
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
        padding-bottom: 18px;
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

@media (max-width: 920px) {
  .infoList {
    .tableItem {
      display: flex;
      flex-direction: column;
      height: auto;
      width: 100%;
      border-radius: 5px;
      margin-right: 0;
      margin-bottom: 12px;
      .tableItemInfo {
        flex: 1;
        box-sizing: border-box;
        padding: 16px 16px 10px;
        .name {
          color: rgba(80, 80, 80, 1);
          font-size: 16px;
          font-weight: bold;
          padding-bottom: 8px;
        }

        .createTime {
          font-size: 12px;
          padding: 10px 0;
        }
      }
      .tableItemActRow {
        height: auto;
        padding: 0px 18px;
        font-size: 14px;
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
}
</style>
