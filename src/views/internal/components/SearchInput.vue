<template>
  <div class="actRow">
    <!-- left -->
    <div class="leftItem">
      <div class="leftTitle">姓名</div>
      <el-input
        v-model="searchValue"
        :placeholder="searchTip"
        class="searchInput"
        clearable
      ></el-input>
      <el-button type="primary" @click="$emit('search-list', searchValue)">搜索</el-button>
      <el-button @click="(searchValue = '',$emit('clean-list', 'clean'))">重置</el-button>
    </div>

    <!-- right -->
    <div class="rightItem">
      <el-button
        v-show="$inAuthority('1761990651508580368',0)"
        icon="el-icon-refresh-right"
        @click="$emit('refresh-list', 'refresh')"
        >刷新列表</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchInput",
  data() {
    return {
      searchValue: "",
      searchTip: "请输入姓名/工号",
    };
  },
};
</script>

<style lang="less" scoped>
.actRow {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .leftItem {
    display: flex;
    align-items: center;

    .leftTitle {
      color: rgba(80, 80, 80, 1);
      font-size: 14px;
      padding-right: 14px;
      white-space: nowrap;
    }
    .searchInput {
      margin-right: 16px;
    }
  }
}
</style>
