<template>
  <el-dialog
    title="设置"
    :visible="windowStatus"
    :before-close="handleClose"
    :close-on-click-modal="false"
    width="560px"
  >
    <div v-if="dialogForm" class="dialogCon">
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="dialogForm"
        label-position="right"
        label-width="150px"
      >
        <el-form-item prop="fillIn" label="谁可以填写">
          <template #label>
            <span class="custom-label"
              >谁可以填写
              <el-tooltip
                class="item"
                effect="dark"
                content="设置可以填写表单的账号。
内部账号：即优维尔公司钉钉账号。
外部账号：公司外其他人员，账号需单独创建。
所有获取链接的人：无论内部或外部账号，获取表单填写链接即可填写。"
                placement="top"
              >
                <span class="toolTipButton">?</span>
              </el-tooltip>
            </span>
          </template>
          <el-select
            v-model="dialogForm.fillIn"
            size="medium"
            style="width: 100%"
            placeholder="请选择"
            @change="fillInChange"
          >
            <el-option
              v-for="item in fillInOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-show="dialogForm.fillIn === 1 || dialogForm.fillIn === 3"
          prop="fillInUserIds"
          label="添加填写者"
          :rules="fieldRules"
        >
          <el-cascader
            v-model="dialogForm.fillInUserIds"
            :show-all-levels="false"
            style="width: 100%"
            placeholder="请选择"
            :options="dialogForm.fillIn === 1 ? lookUpUserIdsOptions : cascaderOptions"
            :props="{ multiple: true }"
            collapse-tags
            filterable
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item prop="lookUpUserIds" label="谁可以查看数据">
          <template #label>
            <span class="custom-label"
              >谁可以查看数据
              <el-tooltip
                class="item"
                effect="dark"
                content="指定的账号可以查看、导出表单收集后的汇总数据"
                placement="top"
              >
                <span class="toolTipButton">?</span>
              </el-tooltip>
            </span>
          </template>
          <el-cascader
            v-model="dialogForm.lookUpUserIds"
            :show-all-levels="false"
            style="width: 100%"
            placeholder="请选择"
            :options="[
              ...lookUpUserIdsOptions,
              {
                label: '外部账号',
                name: '外部账号',
                value: 'none',
                children: [...cascaderOptions],
              },
            ]"
            :props="{ multiple: true }"
            collapse-tags
            filterable
            clearable
          >
          </el-cascader>
        </el-form-item>

        <el-form-item prop="collaboratorsUserIds" label="添加协作管理员">
          <template #label>
            <span class="custom-label"
              >添加协作管理员
              <el-tooltip
                class="item"
                effect="dark"
                content="协作管理员拥有表单的所有管理权限"
                placement="top"
              >
                <span class="toolTipButton">?</span>
              </el-tooltip>
            </span>
          </template>
          <el-cascader
            v-model="dialogForm.collaboratorsUserIds"
            :show-all-levels="false"
            style="width: 100%"
            placeholder="请选择"
            :options="lookUpUserIdsOptions"
            :props="{ multiple: true }"
            collapse-tags
            filterable
            clearable
          >
          </el-cascader>
        </el-form-item>

        <el-form-item prop="time" label="设置采集周期">
          <el-date-picker
            v-model="dialogForm.time"
            type="daterange"
            style="width: 100%"
            :picker-options="pickerOptions"
            value-format="timestamp"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="submitTimes" label="限制提交次数">
          <el-select v-model="dialogForm.submitTimes" size="medium" style="width: 100%">
            <el-option
              v-for="item in submitTimeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="submitUpdate" label="提交后可修改">
          <el-switch v-model="dialogForm.submitUpdate"> </el-switch>
        </el-form-item>
        <el-form-item prop="numberUpdate" label="自动编号">
          <el-switch v-model="dialogForm.numberUpdate"> </el-switch>
        </el-form-item>
        <el-form-item
          v-show="dialogForm.numberUpdate === true"
          prop="numberName"
          label="编号名称"
          :rules="numberNameRules"
        >
          <el-input
            v-model="dialogForm.numberName"
            style="width: 100%"
            placeholder="请输入"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="dialogForm.numberUpdate === true"
          prop="numberPrefix"
          label="编号前缀"
        >
          <el-input
            v-model="dialogForm.numberPrefix"
            style="width: 100%"
            placeholder="请输入"
            maxlength="5"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="dialogForm.numberUpdate === true && dialogForm.numberPrefix"
        >
          示例 {{ dialogForm.numberPrefix }}20240101001
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { fillInList, submitTimesList } from "@/current";
import { getInnerDeptTree, getInnerTree } from "@/api";
export default {
  name: "EidtWindow",
  props: {
    windowStatus: {
      type: Boolean,
      default: false,
    },
    windowData: {
      type: Object,
      default: () => ({}),
    },
    cascaderOptions: {
      type: Array,
      default: () => [],
    },
    lookUpUserIdsOptions: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      fillInOption: [],

      pickerOptions: {
        disabledDate(time) {
          // 获取当前日期
          const today = new Date();
          // 将时间戳转换为日期对象
          const date = new Date(time);

          // 禁用选择当前天之前的日期
          return date.getTime() < today.setHours(0, 0, 0, 0);
        },
      },

      submitTimeOption: [],
      dialogForm: {
        fillIn: null,
        fillInUserIds: null,
        lookUpUserIds: null,
        collaboratorsUserIds: null,

        time: null,
        submitTimes: 0,
        submitUpdate: false,

        numberUpdate: false,
        numberName: "",
        numberPrefix: "",
      },
      rules: {
        fillIn: [{ required: true, message: "填写人类型为必填项" }],
        // fillInUserIds: [{ required: true, message: "填写人为必选项" }],
        lookUpUserIds: [{ required: true, message: "查看人为必填项" }],
      },
    };
  },

  watch: {
    windowStatus(value) {
      if (value) {
        this.dialogForm = { ...this.windowData };
      }
    },
  },
  computed: {
    fieldRules() {
      return this.dialogForm.fillIn === 1 || this.dialogForm.fillIn === 3
        ? [{ required: true, message: "填写人为必选项" }]
        : [];
    },
    numberNameRules() {
      return this.dialogForm.numberUpdate
        ? [{ required: true, message: "编号名称为必选项" }]
        : [];
    },
  },
  mounted() {
    this.fillInOption = fillInList;
    this.submitTimeOption = submitTimesList;
  },
  methods: {
    fillInChange() {
      this.dialogForm.fillInUserIds = null;
    },
    handleClose(done) {
      // this.$refs.dialogForm.resetFields();
      this.$emit("close-window", false);
    },
    submitForm() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.$emit("on-submit", this.dialogForm);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.dialogCon {
  width: 100%;
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
</style>
<style>
.el-tooltip__popper {
  white-space: pre-wrap;
}
</style>
