<template>
  <section class="allList">
    <!-- left -->
    <div class="leftItem" :class="{ infoLeftItem: modeStatus !== 'all' }">
      <el-tree
        :data="deptTree"
        node-key="id"
        :default-expanded-keys="['1']"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
        ref="deptTree"
      >
        <template v-slot="{ data }">
          <span class="custom-tree-node" :class="{ nowSpanColor: nowTreeId === data.id }">
            <span>{{ data?.deptName }}</span>
          </span>
        </template>
      </el-tree>
    </div>

    <!-- right -->
    <div class="rightItem" :class="{ allRightItem: modeStatus !== 'all' }">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="jobNumber" label="工号" width="120"> </el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column v-if="modeStatus !== 'all'" prop="email" label="部门">
          <template v-slot="scope">
            {{ buildDeptNameList(scope.row.deptNameList) }}
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色">
          <template v-slot:header
            >角色
            <el-tooltip
              class="item"
              effect="dark"
              content="普通账号：可创建表单，查看表单数据；管理员账号：全部菜单权限和外部账号管。"
              placement="top"
            >
              <span class="toolTipButton">?</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          v-if="$inAuthority('1761990651508580393', 0)"
          label="操作"
          width="100"
        >
          <template v-slot="scope">
            <el-button type="text" @click="editRole(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- total -->
      <div class="bottomRow">
        <div>共 {{ total }} 条</div>
        <el-pagination
          v-if="total"
          background
          layout="prev, pager, next"
          :current-page="current"
          @current-change="currentChange"
          :page-size="10"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <RoleEidtWindow
      :role-visible="roleVisible"
      :role-value="roleValue"
      :role-list="roleList"
      @get-user-page="getUserPage"
      @close-window="closeWindow"
    />
  </section>
</template>

<script>
// import EidtWindow from "./EidtWindow.vue";
import RoleEidtWindow from "./RoleEidtWindow.vue";

export default {
  name: "AllList",
  components: {
    RoleEidtWindow,
  },
  props: {
    deptTree: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    roleList: {
      type: Array,
      default: () => [],
    },
    getUserPage: {
      type: Function,
      default: () => {},
    },
    current: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    modeStatus: {
      type: String,
      default: "all",
    },
  },
  data() {
    return {
      dialogVisible: false,
      dialogStatus: null,
      dialogData: null,
      nowTreeId: null,
      roleVisible: false,
      roleValue: null,
    };
  },
  watch: {
    deptTree(val) {
      this.$refs.deptTree.filter(null);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.deptTree.filter(null);
    });
  },
  methods: {
    handleNodeClick(data) {
      this.nowTreeId = data.id;
      this.$emit("tree-change", data);
    },
    currentChange(current) {
      this.$emit("current-change", current);
    },
    editRole(data) {
      this.roleValue = data;
      this.roleVisible = true;
    },

    closeWindow() {
      this.roleValue = null;
      this.roleVisible = false;
    },
    buildDeptNameList(list) {
      let text = list.length ? list.join(", ") : "";
      return text;
    },
    filterNode(value, data) {
      let status = false;
      if (data) {
        status = !data?.isHide;
      }
      return status;
    },
  },
};
</script>

<style lang="less" scoped>
.allList {
  display: flex;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding-top: 32px;

  .leftItem {
    width: 344px;
    min-height: 685px;
    background-color: #ffffff;
    box-sizing: border-box;
    padding: 24px;

    .newOneDepButton {
      margin-bottom: 45px;
    }
    :deep(.custom-tree-node) {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5px;
    }
    .nowSpanColor {
      color: #409eff;
    }
    :deep(.moreButton) {
      opacity: 0;
    }
  }

  .infoLeftItem {
    width: 0;
    padding: 0;
    overflow: hidden;
  }

  .rightItem {
    margin-left: 20px;
    padding: 12px;
    width: 500px;
    flex: 1;
    box-sizing: border-box;
    background-color: #ffffff;

    :deep(.el-table) {
      th.el-table__cell {
        color: rgba(0, 0, 0, 0.85);
        background-color: rgba(243, 243, 243, 1);
        font-size: 14px;
      }
    }

    .toolTipButton {
      display: inline-block;
      border-radius: 100%;
      height: 16px;
      width: 16px;
      font-size: 12px;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      text-align: center;
      line-height: 16px;
    }
  }
  .allRightItem {
    margin-left: 0;
  }
  .bottomRow {
    padding-top: 48px;
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
}
</style>
