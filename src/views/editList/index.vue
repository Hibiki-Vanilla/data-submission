<template>
  <section v-loading="loading">
    <PageTop title="表单管理" tip="数据提报表单的创建、数据查看" />
    <main class="main">
      <SearchInput @on-submit="searchSubmit" @on-resetting="onResetting" />
      <el-button v-if="userInspect" class="addButton" type="primary" icon="el-icon-plus" @click="newList"
        >新建表单</el-button
      >
      <BaseList :table-data="tableData" @on-window="onWindow" />
      <ListWinodw
        :list-visible="listVisible"
        :list-status="listStatus"
        :list-data="listData"
        @close-window="closeWindow"
        @sumbit-window="sumbitWindow"
      />
      <div class="bottomRow">
        <div>共 {{ total }} 条</div>
        <el-pagination
          v-if="total"
          background
          layout="prev, pager, next"
          :current-page="current"
          @current-change="currentChange"
          :page-size="size"
          :total="total"
        >
        </el-pagination>
      </div>
    </main>
  </section>
</template>

<script>
import PageTop from "@/components/PageTop";
import SearchInput from "./components/SearchInput";
import BaseList from "./components/BaseList";
import ListWinodw from "./components/ListWinodw";
import dayjs from "dayjs";
import { postDrsFormList, putDrsFormRelease, delDrsFormDel, putDrsFormStop } from "@/api";
export default {
  name: "EidtList",
  components: {
    PageTop,
    SearchInput,
    BaseList,
    ListWinodw,
  },
  data() {
    return {
      loading: false,
      query: {},
      keywordsQuery: {},
      rangeQuery: {},
      size: 8,
      current: 1,
      total: 0,

      tableData: [],

      windowValue: null,
      listVisible: false,
      listStatus: "0",
      listData: null,
    };
  },
  computed: {
    userInspect() {
      const status = localStorage.getItem("dsu") === "1";
      return status;
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    newList() {
      this.$router.push("/formEdit");
    },
    currentChange(current) {
      this.current = current;
      this.getList();
    },
    async getList() {
      if (!this.$inAuthority("1761990651508580377", 0)) {
        return;
      }
      this.loading = true;
      const res = await postDrsFormList({
        query: this.query,
        keywordsQuery: this.keywordsQuery,
        rangeQuery: this.rangeQuery,
        size: this.size,
        current: this.current,
      });
      if (res?.success) {
        this.tableData = res.data.records || [];
        this.total = res.data.total || 0;
      }
      this.loading = false;
    },
    onWindow(data) {
      if (data.value === "0") {
        // 编辑
        this.$router.push(`/infoEdit/${data.item.id}`);
      } else if (data.value === "2") {
        this.$router.push(`/listInfo/${data.item.id}`);
      } else if (
        data.value === "1" ||
        data.value === "3" ||
        data.value === "4" ||
        data.value === "5"
      ) {
        this.windowValue = data.value;
        this.listData = data.item;
        this.listStatus = data.value;
        this.listVisible = true;
      }
    },
    searchSubmit(data) {
      this.query = {
        state: data.state,
      };

      this.keywordsQuery = data?.formName.trim()
        ? {
            [data.formName.trim()]: ["formName"],
          }
        : {};

      if (data.createTime && data.createTime.length) {
        this.rangeQuery = {
          createTime: {
            rangeMode: 4,
            start: data.createTime[0],
            end: data.createTime[1],
          },
        };
      }

      this.getList();
    },
    onResetting(data) {
      this.query = data;
      this.keywordsQuery = {};
      this.rangeQuery = data;
      this.current = 1;
      this.getList();
    },
    closeWindow() {
      this.listVisible = false;
    },
    async sumbitWindow() {
      if (this.windowValue === "1") {
        const res = await putDrsFormRelease(this.listData.id);
        if (res?.success) {
          this.listVisible = false;
          this.$message.success("发布成功");
          this.getList();
        } else {
          this.$message.error("发布失败");
        }
      } else if (this.windowValue === "3") {
        const res = await delDrsFormDel(this.listData.id);
        if (res?.success) {
          this.listVisible = false;
          this.$message.success("删除成功");
          this.getList();
        } else {
          this.$message.error("删除失败");
        }
      } else if (this.windowValue === "4") {
        const res = await putDrsFormStop(this.listData.id);
        if (res?.success) {
          this.listVisible = false;
          this.$message.success("停止成功");
          this.getList();
        } else {
          this.$message.error("停止失败");
        }
      } else if (this.windowValue === "5") {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(this.listData.formCode).then(() => {
            this.$message.success("复制成功");
          });
        } else {
          const textField = document.createElement("textarea");
          textField.innerText = this.listData.formCode;
          document.body.appendChild(textField);
          textField.select();
          document.execCommand("copy");
          textField.remove();
          this.$message.success("复制成功");
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  padding: 24px 24px 60px;
}
.bottomRow {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  :deep(.btn-prev) {
    background-color: #fff;
  }
  :deep(.btn-next) {
    background-color: #fff;
  }
  :deep(.el-pager) {
    .number {
      background-color: #fff;
    }
  }
}

@media (max-width:1000px) {
  .addButton{
    display: none;
  }
}
</style>
