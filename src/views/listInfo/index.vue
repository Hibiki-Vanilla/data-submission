<template>
  <section v-loading="loading">
    <TopRow />
    <div class="main">
      <SearchInput
        @on-submit="searchSubmit"
        @on-resetting="onResetting"
        :field-manage-list="fieldManageList"
        @field-manage-res="fieldManageRes"
        @table-solo-value="tableSoloValue"
        :export-loading="exportLoading"
        :onExport="onExport"
      />
      <div class="tableBox">
        <el-table :data="datas" style="width: 100%" size="medium">
          <el-table-column
            v-for="(item, index) in tableHeadVos"
            :key="index"
            :prop="item.code"
            min-width="180"
          >
            <template v-slot:header>
              <el-tooltip
                class="item"
                effect="dark"
                :content="tableColumnLabel(item)"
                placement="top-start"
                :disabled="false"
              >
                <div>
                  {{ tableColumnLabel(item) }}
                </div>
              </el-tooltip>
            </template>
            <template v-slot="scope">
              <div
                v-if="
                  item.store !== 'upload' &&
                  item.store !== 'date' &&
                  item.store !== 'dataStatus'
                "
              >
                {{ textBuild(scope.row, item.code) }}
              </div>
              <!-- 属性 -->
              <div v-if="item.store === 'dataStatus'">
                <el-tag v-if="scope.row.status === 1">已提交</el-tag>
                <el-tag v-else type="info">未提交</el-tag>
              </div>

              <div v-if="item.store === 'upload'">
                <a
                  v-if="item.valueType === 'string'"
                  class="linkItem"
                  target="_blank"
                  :href="scope.row[item.code]"
                  >{{ uploadNameChange(scope.row[item.code]) }}</a
                >
                <div v-else>
                  <a
                    v-for="(depItem, depIndex) of scope.row[item.code] || []"
                    :key="depIndex"
                    class="linkItem"
                    @click="imageClick(scope.row[item.code], depIndex)"
                  >
                    {{ uploadNameChange(depItem) }}
                  </a>
                </div>
              </div>
              <div v-if="item.store === 'date'">
                {{ timeChange(scope.row[item.code]) }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-if="tableHeadVos.length && $inAuthority('1761990651508580386', 0)"
            label="操作"
            min-width="130"
            fixed="right"
          >
            <template v-slot="scope">
              <el-button
                type="text"
                style="margin-right: 14px"
                @click="rowView(scope.row)"
                >查看</el-button
              >
              <el-dropdown>
                <el-button type="text"
                  >更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>

                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button
                      v-if="scope.row.allOperationFlag"
                      type="text"
                      @click="rowEdit(scope.row)"
                      >编辑</el-button
                    >
                  </el-dropdown-item>

                  <el-dropdown-item>
                    <el-button
                      v-if="scope.row.allOperationFlag"
                      type="text"
                      @click="rowCopy(scope.row)"
                      >复制</el-button
                    >
                  </el-dropdown-item>

                  <el-dropdown-item>
                    <el-button
                      v-if="scope.row.allOperationFlag"
                      type="text"
                      style="color: #f60101"
                      @click="delTableItem(scope.row)"
                      >删除</el-button
                    >
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>

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
    </div>
    <ImageDialog
      :visible="dialogVisible"
      :con-list="conList"
      :con-list-index="conListIndex"
      @close-visible="(dialogVisible = false), (conList = [])"
    />
  </section>
</template>

<script>
import {
  postDrsformDataList,
  postDrsformDataScreen,
  getFormFieldManageListForUser,
  delFormDataDel,
  // postFormDataExport,
} from "@/api";
import TopRow from "./components/TopRow.vue";
import SearchInput from "./components/SearchInput";
import dayjs from "dayjs";
import axios from "axios";
import { decryptByDES } from "@/utils/aes";
import ImageDialog from "@/components/ImageDialog";

export default {
  name: "ListInfo",
  components: {
    TopRow,
    SearchInput,
    ImageDialog,
  },
  data() {
    return {
      loading: false,
      query: {},
      conditionVos: [],
      rangeQuery: {},
      size: 10,
      current: 1,
      total: 0,

      tableHeadVos: [],
      fieldManageList: [],
      datas: [],

      windowValue: null,
      listVisible: false,
      listStatus: "0",
      listData: null,

      exportLoading: false,

      dialogVisible: false,
      conList: [],
      conListIndex: 0,
    };
  },
  mounted() {
    this.getList();
    this.getFieldManageList();
  },
  methods: {
    tableColumnLabel(item) {
      if (item.code === "creator_id") {
        return "提交用户";
      } else if (item.code === "update_time") {
        return "更新时间";
      } else if (item.code === "create_time") {
        return "提交时间";
      } else if (item.code === "status") {
        return "状态";
      }
      return item.title || "";
    },
    async getList() {
      if (!this.$inAuthority("1761990651508580384", 0)) {
        return;
      }
      this.loading = true;
      const res = await postDrsformDataList({
        id: this.$route.params.id,
        data: {
          createBy: this.query.createBy,
          createStartTime: this.query.createStartTime,
          createEndTime: this.query.createEndTime,
          conditionVos: this.conditionVos,
          current: this.current,
          size: this.size,
        },
      });
      if (res?.success) {
        this.tableHeadVos = res?.data?.tableHeadVos || [];
        this.datas = res.data.records || [];
        this.total = res.data.total || 0;
      }
      this.loading = false;
    },
    async getFieldManageList() {
      const res = await getFormFieldManageListForUser(this.$route.params.id);
      let list = res?.data || [];
      list.map((item) => {
        if (item.code === "creator_id") {
          item.title = "提交用户";
        } else if (item.code === "update_time") {
          item.title = "更新时间";
        } else if (item.code === "create_time") {
          item.title = "提交时间";
        } else if (item.code === "status") {
          item.title = "状态";
        }
      });
      this.fieldManageList = list;
    },
    async getScreen() {
      const res = await postDrsformDataScreen(this.$route.params.id);
      if (res?.success) {
        console.log(res.data);
      }
    },
    textBuild(item, id) {
      if (id === "create_time" || id === "update_time") {
        return item[id]
          ? dayjs.unix(item[id] / 1000).format("YYYY-MM-DD HH:mm:ss")
          : "";
      } else {
        return item[id];
      }
    },
    currentChange(current) {
      this.current = current;
      this.getList();
    },
    fieldManageRes() {
      this.getFieldManageList();
      this.getList();
    },
    uploadNameChange(value) {
      let lastSegment = "";
      if (value) {
        const segments = value.split("/");
        lastSegment = segments.pop();
      }
      return lastSegment;
    },
    timeChange(value) {
      let text = "";
      if (value) {
        const list = JSON.parse(value);
        if (list.length) {
          const textList = [];
          list.map((item) => {
            textList.push(
              dayjs.unix(item / 1000).format("YYYY-MM-DD HH:mm:ss")
            );
          });

          text = textList.join(" ~ ");
        } else {
          text = dayjs.unix(value / 1000).format("YYYY-MM-DD HH:mm:ss");
        }
      }
      return text;
    },
    rowView(value) {
      this.$router.push(`/details/${this.$route.params.id}/${value.id}`);
    },
    rowEdit(value) {
      this.$router.push(`/detailsUpdate/${this.$route.params.id}/${value.id}`);
    },
    rowCopy(value){
      this.$router.push(`/fillIn/${this.$route.params.id}/${value.id}`);
    },
    // 删除
    async delTableItem(value) {
      this.$confirm(`此操作将删除该数据, 是否继续?`, {
        type: "warning",
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        customClass: "mobileConfirm", // 添加自定义类名
        showClose: false,
      })
        .then(async () => {
          this.loading = true;
          const res = await delFormDataDel(value.id);
          if (res?.success) {
            this.$message.success("删除成功");
            this.getList();
          }
          this.loading = false;
        })
        .catch((_) => {});
    },
    searchSubmit(data) {
      let obj = {
        createBy: data.creatorId,
        createStartTime: null,
        createEndTime: null,
      };
      if (data.time) {
        obj.createStartTime = data.time[0];
        obj.createEndTime = data.time[1];
      }

      this.current = 1;
      this.query = obj;
      this.getList();
    },
    onResetting(data) {
      this.query = data;
      this.rangeQuery = data;
      this.current = 1;
      this.getList();
    },
    tableSoloValue(value) {
      this.conditionVos = value;
      this.getList();
    },
    // 导出
    async onExport() {
      this.exportLoading = true;
      let c_token = localStorage.getItem("dst") || "";
      const res = await axios({
        method: "post",
        url: `/u/drs/formData/export/${this.$route.params.id}`,
        responseType: "arraybuffer", //转化后台传过来的文件流
        headers: {
          Authorization: `Bearer ${decryptByDES(c_token, "dst")}`,
        },
        data: {
          createBy: this.query.createBy,
          createStartTime: this.query.createStartTime,
          createEndTime: this.query.createEndTime,
          conditionVos: this.conditionVos,
        },
      });

      if (res && res.status === 200) {
        const fileName = decodeURI(
          res.headers["content-disposition"].split(";")[1].split("filename=")[1]
        );
        const url = window.URL.createObjectURL(
          new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );

        const link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      this.exportLoading = false;
    },
    // 图片查看
    imageClick(list, index) {
      this.dialogVisible = true;
      this.conList = list || [];
      this.conListIndex = index;
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  padding: 24px 24px 60px;
  .tableBox {
    box-sizing: border-box;
    width: 100%;
    padding: 16px 10px;
    background: #fff;
    :deep(.el-table) {
      th.el-table__cell {
        color: rgba(0, 0, 0, 0.85);
        background-color: rgba(243, 243, 243, 1);
        font-size: 14px;
      }
      tbody tr .el-table__cell {
        .cell {
          max-height: 180px;
          overflow-y: scroll;
          &::-webkit-scrollbar-track {
            background-color: transparent; /* 轨道颜色 */
          }
        }
      }
    }
  }
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

.linkItem {
  cursor: pointer;
  display: block;
  padding: 5px;
  color: rgba(42, 130, 228, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
