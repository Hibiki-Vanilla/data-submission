<template>
  <div class="actRow">
    <el-form ref="queryForm" :model="query" :inline="true">
      <div class="leftBox">
        <!-- <el-form-item :label="$t('editInfo.SubmitTime')" prop="time">
          <el-date-picker
            v-model="query.time"
            type="daterange"
            value-format="timestamp"
            range-separator="~"
            :start-placeholder="$t('editInfo.startDate')"
            :end-placeholder="$t('editInfo.endDate')"
            clearable
            :default-time="['00:00:00', '23:59:59']"
            @change="sumbit()"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item>
          <el-button
            type="text"
            :icon="
              dynamicValidateForm.domains.length > 0
                ? 'el-icon-finished'
                : 'el-icon-s-operation'
            "
            class="headButton"
            :class="{ headButtonAct: screenNowNum > 0 }"
            @click="filterOpen"
            >{{ $t("editInfo.filter") }}
            <span v-show="screenNowNum > 0"
              >({{ screenNowNum }})</span
            ></el-button
          >
          <el-button
            type="text"
            :icon="allCheck ? 'el-icon-s-tools' : 'el-icon-setting'"
            class="headButton"
            :class="{ headButtonAct: !allCheck }"
            @click="dialogVisible = true"
            >{{ $t("editInfo.fieldSetting") }}</el-button
          >
        </el-form-item>
      </div>

      <el-form-item>
        <div class="rightItem">
          <el-button
            v-show="$inAuthority('1761990651508580390', 0)"
            type="primary"
            :loading="exportLoading"
            @click="onExport"
            >{{ $t("editInfo.export") }}</el-button
          >
        </div>
      </el-form-item>
    </el-form>

    <!-- 字段管理权限 -->
    <el-dialog
      class="dialogBox"
      :title="$t('editInfo.fieldSetting')"
      :visible="dialogVisible"
      :before-close="handleClose"
    >
      <el-checkbox
        :label="$t('editInfo.selectAll')"
        v-model="allCheck"
        @change="checkAll"
      ></el-checkbox>
      <el-divider />
      <div class="con">
        <el-checkbox-group v-model="checkList" @change="selectItem">
          <el-checkbox
            v-for="(item, index) in fieldManageList"
            :key="index"
            :label="item.code"
            >{{ item.title }}</el-checkbox
          >
        </el-checkbox-group>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">{{
            $t("editInfo.cancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="fieldManageListSubmit"
            :loading="buttonLoading"
            >{{ $t("editInfo.confirm") }}</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- 筛选条件 -->
    <el-dialog
      class="dialogBox"
      :title="$t('editInfo.filter')"
      :visible="screenVisible"
      :before-close="screenHandleClose"
    >
      <el-button type="text" icon="el-icon-plus" @click="addDomain">{{
        $t("editInfo.addFilter")
      }}</el-button>
      <el-form
        class="screenForm"
        ref="dynamicValidateForm"
        :model="dynamicValidateForm"
      >
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
        >
          <el-row>
            <!-- 主要词条 -->
            <el-select
              v-model="domain.tableCode"
              class="screenOneSelect"
              :placeholder="$t('editInfo.pleaseSelect')"
              :popper-append-to-body='false'
              @change="(e) => (tableCodeChange(index), conditionChange(index))"
            >
              <el-option
                v-for="item in screenList"
                :key="item.code"
                :label="item.title"
                :value="item.code"
              >
              </el-option>
            </el-select>
            <!-- 条件 -->
            <el-select
              v-model="domain.condition"
              class="screenTwoSelect"
              :placeholder="$t('editInfo.pleaseSelect')"
              :popper-append-to-body='false'
              @change="conditionChange(index)"
            >
              <el-option
                v-for="(conditionItem, conditionIndex) in conditionListChange(
                  domain.tableCode
                )"
                :key="conditionIndex"
                :label="$t(conditionList[conditionItem].label)"
                :value="conditionItem"
              >
              </el-option>
            </el-select>
            <!-- 输入框控制 -->
            <el-input
              v-if="textBoxChange(domain, 'string')"
              v-model="domain.text"
              class="screenThreeSelect"
              :placeholder="$t('editInfo.pleaseFillIn')"
            ></el-input>

            <el-input-number
              v-if="textBoxChange(domain, 'number')"
              v-model="domain.text"
              class="screenThreeSelect"
              :placeholder="$t('editInfo.pleaseFillIn')"
            ></el-input-number>

            <el-select
              v-if="textBoxChange(domain, 'select')"
              v-model="domain.text"
              filterable
              multiple
              class="screenThreeSelect"
              :popper-append-to-body='false'
              :placeholder="$t('editInfo.pleaseSelect')"
            >
              <el-option
                v-for="item in optionListChange(domain)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <el-cascader
              v-if="textBoxChange(domain, 'cascader')"
              v-model="domain.text"
              :options="cascaderOptions"
              :popper-append-to-body='false'
              :props="{
                multiple: true,
                checkStrictly: true,
                lazy: true,
                lazyLoad: cascaderLazyLoad,
              }"
              clearable
              filterable
              class="screenThreeSelect"
            ></el-cascader>

            <el-date-picker
              v-if="textBoxChange(domain, 'date')"
              v-model="domain.text"
              type="datetime"
              value-format="timestamp"
              class="screenThreeSelect"
              :placeholder="$t('editInfo.pleaseSelect')"
            >
            </el-date-picker>

            <el-button
              type="text"
              icon="el-icon-delete-solid"
              @click.prevent="removeDomain(domain)"
              >{{ $t("editInfo.delete") }}</el-button
            >
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="screenHandleClose">{{
            $t("editInfo.cancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="screenListSubmit('dynamicValidateForm')"
            :loading="buttonLoading"
            >{{ $t("editInfo.confirm") }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { listStatus, isObjectEmpty } from "@/current/index";
import {
  getFormDataScreen,
  postFormFieldManageListForUser,
  getListProvince,
} from "@/api";
import { useStore } from "@/store";
export default {
  name: "SearchInput",
  props: {
    fieldManageList: {
      type: Array,
      default: () => [],
    },
    exportLoading: {
      type: Boolean,
      default: false,
    },
    onExport: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      searchOption: [],
      query: {
        creatorId: "",
        time: null,
      },

      dialogVisible: false,
      screenNowNum: 0,

      allCheck: true,
      checkList: [],
      buttonLoading: false,

      screenList: [],
      conditionList: [
        { id: 0, label: "fillIn.equal" },
        { id: 1, label: "fillIn.noequal" },
        { id: 2, label: "fillIn.contains" },
        { id: 3, label: "fillIn.notcontains" },
        { id: 4, label: "fillIn.notempty" },
        { id: 5, label: "fillIn.empty" },
        { id: 6, label: "fillIn.before" },
        { id: 7, label: "fillIn.after" },
        { id: 8, label: "fillIn.greaterequal" },
        { id: 9, label: "fillIn.lessequal" },
        { id: 10, label: "fillIn.greaterthan" },
        { id: 11, label: "fillIn.lessthan" },
      ],
      screenVisible: false,
      dynamicValidateForm: {
        domains: [],
      },

      tableSoloValue: [],
    };
  },
  watch: {
    screenVisible(value) {
      if (value) {
        this.cascaderOptions = useStore().countryList;
      }
    },
    dialogVisible(value) {
      if (value) {
        let list = [];
        this.fieldManageList.map((item) => {
          if (item.code === "creator_id") {
            item.title = this.$t("editInfo.submitter");
          } else if (item.code === "update_time") {
            item.title = this.$t("editInfo.updateTime");
          } else if (item.code === "create_time") {
            item.title = this.$t("editInfo.SubmitTime");
          } else if (item.code === "status") {
            item.title = this.$t("editInfo.status");
          }
          if (item.checked) {
            list.push(item.code);
          }
        });
        this.checkList = list;
        this.allCheck = list.length === this.fieldManageList.length;
      }
    },
  },
  methods: {
    async cascaderLazyLoad(node, resolve) {
      const res = await getListProvince({ countryId: node.value });
      let list = res?.data || [];
      // 通过调用resolve将子节点数据返回，通知组件数据加载完成
      resolve(list);
    },
    async getScreen() {
      const res = await getFormDataScreen(this.$route.params.id);
      let list = res?.data || [];
      list.map((item) => {
        if (item.code === "update_time") {
          item.title = this.$t("editInfo.updateTime");
        } else if (item.code === "status") {
          item.title = this.$t("editInfo.status");
        }
      });
      this.screenList = list;
    },
    filterOpen() {
      this.screenList.map((item) => {
        if (item.code === "update_time") {
          item.title = this.$t("editInfo.updateTime");
        } else if (item.code === "status") {
          item.title = this.$t("editInfo.status");
        }
      });
      this.screenVisible = true;
    },
    checkAll(value) {
      if (value) {
        this.checkList = this.fieldManageList.map((option) => option.code);
      } else {
        this.checkList = [];
      }
    },
    selectItem(value) {
      this.checkList = value;
      this.allCheck = value.length === this.fieldManageList.length;
    },
    async fieldManageListSubmit() {
      this.buttonLoading = true;
      const res = await postFormFieldManageListForUser({
        formId: this.$route.params.id,
        data: this.checkList,
      });
      if (res?.success) {
        this.$emit("field-manage-res", "none");
      }
      this.handleClose();
      this.buttonLoading = false;
    },
    handleClose(done) {
      this.dialogVisible = false;
    },
    sumbit() {
      this.$emit("on-submit", this.query);
    },
    resetting() {
      this.$refs.queryForm.resetFields();
      this.$emit("on-resetting", {});
    },

    // 筛选相关
    // 筛选添加Item
    addDomain() {
      this.dynamicValidateForm.domains.push({
        tableCode: null,
        condition: null,
        text: null,
        key: Date.now(),
      });
    },
    // 筛选删除Item
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    // 主要筛选对象变化
    conditionListChange(e) {
      const item = this.screenList.find((item) => item.code === e);
      let list = item?.condition || [];
      return list;
    },
    tableCodeChange(index) {
      this.dynamicValidateForm.domains[index].condition = null;
    },
    conditionChange(index) {
      this.dynamicValidateForm.domains[index].text = null;
    },
    textBoxChange(domain, type) {
      const item = this.screenList.find(
        (item) => item.code === domain.tableCode
      );
      let status = false;
      // 非空 空 判断
      if (domain.condition !== 4 && domain.condition !== 5) {
        // 字段判断
        if (item?.store === "countryProvince" && type === "cascader") {
          status = true;
        } else if (
          (item?.store === "product" ||
            item?.store === "country" ||
            item?.store === "select" ||
            item?.store === "multSelect" ||
            item?.store === "dataStatus") &&
          type === "select"
        ) {
          status = true;
        } else if (
          ((item?.valueType === "string" &&
            item?.store !== "select" &&
            item?.store !== "country" &&
            item?.store !== "product") ||
            item?.store === "customNumbers") &&
          type === "string"
        ) {
          status = true;
        } else if (item?.store === "number" && type === "number") {
          status = true;
        } else if (
          (item?.store === "date" || item?.store === "dateTime") &&
          type === "date"
        ) {
          status = true;
        }
      }
      return status;
    },
    optionListChange(domain) {
      const item = this.screenList.find(
        (item) => item.code === domain.tableCode
      );
      let list = [];
      if (item?.store === "country") {
        list = useStore().countryList;
      } else if (item?.store === "product") {
        let productList = useStore().productList || [];
        let newList = [];
        productList.map((item) => {
          newList.push(...item.children);
        });

        list = newList;
      } else if (
        item?.store === "select" ||
        item?.store === "multSelect" ||
        item?.store === "dataStatus"
      ) {
        list = item.optionVos;
      }
      return list;
    },

    screenListSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let tableSoloValue = [];
          let fieldStatus = true;
          for (
            let index = 0;
            index < this.dynamicValidateForm.domains.length;
            index++
          ) {
            const item = this.dynamicValidateForm.domains[index];
            const dep =
              this.screenList.find((dep) => dep.code === item.tableCode) || "";
            if (item.condition === 4 || item.condition === 5) {
              tableSoloValue.push({
                code: item.tableCode,
                condition: item.condition,
                value: item.text,
                store: dep.store,
              });
            } else if (
              Array.isArray(item.text) ? item.text.length : !isObjectEmpty(item)
            ) {
              if (Array.isArray(item.text)) {
                let dept = this.screenList.find(
                  (dept) => dept.code === item.tableCode
                );
                if (dept.store === "countryProvince") {
                  let valueArrList = item?.text.map((child) => {
                    return child[child.length - 1];
                  });
                  tableSoloValue.push({
                    code: item.tableCode,
                    condition: item.condition,
                    valueArr: valueArrList,
                    store: dep.store,
                  });
                } else {
                  tableSoloValue.push({
                    code: item.tableCode,
                    condition: item.condition,
                    valueArr: item.text,
                    store: dep.store,
                  });
                }
              } else {
                tableSoloValue.push({
                  code: item.tableCode,
                  condition: item.condition,
                  value: item.text,
                  store: dep.store,
                });
              }
            } else {
              this.$message.error(
                this.$t("editInfo.filterIncom", { num: index + 1 })
              );
              fieldStatus = false;
              break; // 使用 break 语句中断整个循环
            }
          }

          if (fieldStatus) {
            this.screenNowNum = this.dynamicValidateForm.domains.length;
            this.$emit("table-solo-value", tableSoloValue);
            this.screenVisible = false;
          }
        } else {
          return false;
        }
      });
    },
    screenHandleClose(done) {
      this.screenVisible = false;
    },
  },
  mounted() {
    this.searchOption = listStatus;
    this.getScreen();
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
    justify-content: space-between;
    width: 100%;
  }
  .screenForm {
    flex-direction: column;
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

  .lastRow {
    display: flex;
    flex-direction: row-reverse;
    flex: 1;
  }
  .submitButtonRow {
    display: flex;
    flex: 1;
  }

  .headButton {
    padding: 12px 20px;
    color: rgba(80, 80, 80, 1);
  }
  .headButtonAct {
    background: rgba(63, 133, 255, 0.1);
  }

  .rightItem {
    display: flex;
  }

  .dialogBox {
    :deep(.el-dialog) {
      width: 800px;
    }

    .screenOneSelect {
      margin-right: 14px;
    }
    .screenTwoSelect {
      width: 150px;
      margin-right: 14px;
    }
    .screenThreeSelect {
      width: 250px;
      margin-right: 14px;
    }
  }
}

@media (max-width: 1000px) {
  .actRow {
    .dialogBox {
      :deep(.el-dialog) {
        width: 90%;

        .con{
          height: 40vh;
          width: 100%;
          overflow-y: scroll;
        }

        .el-checkbox {
          margin-right: 0;
          overflow: hidden; /* 溢出内容隐藏 */
          width: 100%;
          display: flex;
          align-items: center;

          .el-checkbox__label {
            width: 90%;
            overflow: hidden; /* 溢出内容隐藏 */
            white-space: nowrap; /* 不换行 */
            text-overflow: ellipsis; /* 文本超出显示省略号 */
          }
        }
      }

      .screenOneSelect {
        width: 60%;
        margin-right: 0;
      }
      .screenTwoSelect {
        width: 40%;
        margin-right: 0;
      }
      .screenThreeSelect {
        width: 80%;
        margin-right: 14px;
        margin-top: 10px;
      }
      .delButton {
        margin-top: 10px;
      }
    }
  }

  :deep(.el-popper) {
    width: 90vw;
  }
  :deep(.el-select-dropdown__list){
    width: 90vw;
  }
}
</style>
