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
            :min-width="windowWidth > 992 ? '180' : '150'"
          >
            <template v-slot:header>
              <el-tooltip
                class="item"
                effect="dark"
                :content="tableColumnLabel(item)"
                placement="top-start"
                :disabled="false"
              >
                <div >
                  {{ tableColumnLabel(item) }}
                </div>
              </el-tooltip>
            </template>
            <template v-slot="scope">
              <div v-if="item.store === 'product'">
                {{ productBuild(scope.row, item.code) }}
              </div>
              <div
                v-if="
                  item.store !== 'upload' &&
                  item.store !== 'date' &&
                  item.store !== 'product' &&
                  item.store !== 'dataStatus'
                "
              >
                {{ textBuild(scope.row, item.code) }}
              </div>
              <!-- 属性 -->
              <div v-if="item.store === 'dataStatus'">
                <el-tag v-if="scope.row.status === 1">{{
                  $t("editFill.submitted")
                }}</el-tag>
                <el-tag v-else type="info">{{
                  $t("editFill.notsubmitted")
                }}</el-tag>
              </div>

              <div v-if="item.store === 'upload'">
                <a
                  v-if="item.valueType === 'string'"
                  class="linkItem"
                  :href="scope.row[item.code]"
                  target="_blank"
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
            v-if="tableHeadVos.length"
            :label="$t('editInfo.action')"
            min-width="130"
            fixed="right"
          >
            <template v-slot="scope">
              <el-button
                v-show="$inAuthority('1761990651508580391', 0)"
                type="text"
                style="margin-right: 14px"
                @click="rowView(scope.row)"
                >{{ $t("editInfo.detail") }}</el-button
              >

              <el-dropdown>
                <el-button type="text"
                  >{{ $t("editInfo.more") }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>

                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button
                      v-show="
                        scope.row.updateOperationFlag &&
                        $inAuthority('1761990651508580392', 0)
                      "
                      type="text"
                      :disabled="scope.row.submitUpdate === 0"
                      @click="rowEdit(scope.row)"
                      >{{ $t("editInfo.edit") }}</el-button
                    >
                  </el-dropdown-item>

                  <el-dropdown-item>
                    <el-button
                      v-if="scope.row.updateOperationFlag"
                      type="text"
                      @click="rowCopy(scope.row)"
                      >{{ $t("editInfo.copy") }}</el-button
                    >
                  </el-dropdown-item>

                  <el-dropdown-item>
                    <el-button
                      v-show="
                        scope.row.delOperationFlag &&
                        $inAuthority('1761990651508580392', 0)
                      "
                      type="text"
                      :style="scope.row.status !== 1 && 'color: #f60101'"
                      :disabled="scope.row.status === 1"
                      @click="delTableItem(scope.row)"
                      >{{ $t("editInfo.delete") }}</el-button
                    >
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="bottomRow">
        <div>
          {{ $t("editInfo.total", { num: total }) }}
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
  postFormDataFillingList,
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
  name: "FillInList",
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

      windowWidth: 0,

      dialogVisible: false,
      conList: [],
      conListIndex: 0,
    };
  },
  computed: {
    lang() {
      return this.$i18n.locale;
    },
  },
  mounted() {
    this.getList();
    this.getFieldManageList();
    this.windowWidth = window.innerWidth;
    window.addEventListener("resize", this.handleWindowResize);
  },
  beforeUnMount() {
    // 移除事件监听
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {
    handleWindowResize() {
      // 更新窗口宽度
      this.windowWidth = window.innerWidth;
    },
    tableColumnLabel(item) {
      if (item.code === "creator_id") {
        return this.$t("editInfo.submitter");
      } else if (item.code === "update_time") {
        return this.$t("editInfo.updateTime");
      } else if (item.code === "create_time") {
        return this.$t("editInfo.SubmitTime");
      }

      return item.title || "";
    },
    async getList() {
      if (!this.$inAuthority("1761990651508580388", 0)) {
        return;
      }
      this.loading = true;
      const res = await postFormDataFillingList({
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
          item.title = this.$t("editInfo.submitter");
        } else if (item.code === "update_time") {
          item.title = this.$t("editInfo.updateTime");
        } else if (item.code === "create_time") {
          item.title = this.$t("editInfo.SubmitTime");
        }
      });
      this.fieldManageList = res?.data || [];
    },
    productBuild(item, id) {
      let str = item[id];
      let lastElement = "";
      if (str) {
        let arr = str.split(",");
        lastElement = arr.pop();
      }

      return lastElement;
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
      this.$router.push(`/fillDetails/${this.$route.params.id}/${value.id}`);
    },
    rowEdit(value) {
      this.$router.push(`/fillInUpdate/${this.$route.params.id}/${value.id}`);
    },
    rowCopy(value){
      this.$router.push(`/fillIn/${this.$route.params.id}/${value.id}`);
    },
    // 删除
    async delTableItem(value) {
      this.$confirm(this.$t("editInfo.deleteTip"), {
        type: "warning",
        confirmButtonText: this.$t("editInfo.delete"),
        cancelButtonText: this.$t("editInfo.cancel"),
        customClass: "mobileConfirm", // 添加自定义类名
        showClose: false,
      })
        .then(async () => {
          this.loading = true;
          const res = await delFormDataDel(value.id);
          if (res?.success) {
            this.$message.success(this.$t("editInfo.deleteSuccess"));
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
        url: `/u/drs/formData/fillingExport/${this.$route.params.id}`,
        responseType: "arraybuffer", //转化后台传过来的文件流
        headers: {
          Authorization: `Bearer ${decryptByDES(c_token, "dst")}`,
        },
        data: {
          createBy: this.query.creatorId,
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

  [dir="rtl"] {
    :deep(.el-table__fixed-right) {
      right: unset;
      left: 0;
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

@media (max-width: 992px) {
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
      }
    }
  }

  .bottomRow {
    padding-top: 48px;
    display: flex;
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
    display: block;
    padding: 5px;
    color: rgba(42, 130, 228, 1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
