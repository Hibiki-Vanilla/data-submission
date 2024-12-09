<template>
  <div class="actRow">
    <el-form
      ref="queryForm"
      :rules="rules"
      :model="query"
      :inline="true"
      onsubmit="return false;"
    >
      <el-form-item label="状态" prop="state">
        <el-select v-model="query.state" placeholder="请选择">
          <el-option
            v-for="item in searchOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建日期" prop="createTime">
        <el-date-picker
          v-model="query.createTime"
          type="daterange"
          value-format="timestamp"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="表单名称" prop="formName">
        <el-input v-model="query.formName" placeholder="请输入表单名称" />
      </el-form-item>
      <el-form-item class="lastRow"   label-width="40px">
          <el-button type="primary" @click="sumbit">搜索</el-button>
          <el-button  @click="resetting">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { listStatus } from "@/current/index";
export default {
  name: "SearchInput",
  data() {
    return {
      searchOption: [],
      query: {
        state: "",
        createTime: null,
        formName: "",
      },
      rules: {},
    };
  },
  methods:{
    sumbit(){
      this.$emit("on-submit", this.query);
    },
    resetting(){
      this.$refs.queryForm.resetFields();
      this.$emit("on-resetting", {});
    }
  },
  mounted() {
    this.searchOption = listStatus;
  },
};
</script>

<style lang="less" scoped>
.actRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .el-form {
    display: flex;
    width: 100%;
  }

  .leftTitle {
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    padding-right: 14px;
    white-space: nowrap;
  }
  .searchInput {
    margin-right: 16px;
  }

  .lastRow{
    display: flex;
    flex-direction: row-reverse;
    flex: 1;
  }
  .submitButtonRow {
    display: flex;
    flex: 1;
  }
}


@media (max-width: 1000px) {
  .actRow{
    display: none;
  }
}
</style>
