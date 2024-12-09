<template>
  <section v-loading="loading">
    <PageTop :title="$t('menu.submission')" :tip="$t('editList.showInput')" />
    <main class="main">
      <div class="searchRow">
        <el-form
          ref="queryForm"
          :rules="rules"
          :model="query"
          :inline="true"
          onsubmit="return false;"
        >
          <el-form-item :label="$t('editList.formTitle')" prop="formName">
            <el-input
              v-model="query.formName"
              clearable
              suffix-icon="el-icon-search"
              :placeholder="$t('editList.titleTip')"
              @change="sumbit()"
            />
          </el-form-item>
        </el-form>
      </div>
      <InfoList :table-data="tableData" />

      <div class="bottomRow">
        <div>
          {{$t('editInfo.total',{num:total})}}
        </div>
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
import InfoList from "./components/InfoList";

import { postFormFillingList } from "@/api";

export default {
  name: "FillInPage",
  components: {
    PageTop,
    InfoList,
  },
  data() {
    return {
      loading: false,
      query: {
        formName: "",
      },
      keywordsQuery: {},
      rules: {},

      size: 8,
      current: 1,
      total: 0,

      tableData: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      if(!this.$inAuthority("1761990651508580387", 0)){
        return
      }
      this.loading = true;
      const res = await postFormFillingList({
        keywordsQuery: this.keywordsQuery,
        size: this.size,
        current: this.current,
      });
      if (res?.success) {
        this.tableData = res.data.records || [];
        this.total = res.data.total || 0;
      }
      this.loading = false;
    },
    sumbit() {
      this.keywordsQuery = this.query?.formName.trim()
        ? {
            [this.query.formName.trim()]: ["formName"],
          }
        : {};

      this.current = 1;
      this.getList();
    },
    currentChange(current) {
      this.current = current;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  padding: 24px 24px 60px;
}
.searchRow {
  width: 100%;
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

@media (max-width: 992px) {
  .searchRow {
    .el-form-item {
      width: 100%;
      :deep(.el-form-item__label){
        display: none;
      }
      :deep(.el-form-item__content){
        width: 100%;
      }
    }
  }
}
</style>
