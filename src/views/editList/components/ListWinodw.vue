<template>
  <el-dialog
    :title="listStatus ? list[listStatus].title : ''"
    :visible="listVisible"
    class="listWindow"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div>{{ list[listStatus].text }}</div>

    <div v-if="listStatus === '5'" class="linkCon">{{ listData.formCode }}</div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button :type="list[listStatus].type" @click="submitForm">{{
          list[listStatus].buttonText
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "EidtWindow",
  props: {
    listVisible: {
      type: Boolean,
      default: false,
    },
    listStatus: {
      type: String,
      default: null,
    },
    listData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      list: [
        {
          title: "编辑",
          value: "0",
          type: "primary",
          buttonText: "确定",
          colorName: "noneColor",
        },
        {
          title: "发布表单",
          value: "1",
          type: "primary",
          buttonText: "确定",
          text: "确定发布表单？",
        },
        {
          title: "数据",
          value: "2",
          type: "primary",
          buttonText: "确定",
          colorName: "noneColor",
        },
        {
          title: "删除表单",
          value: "3",
          type: "danger",
          buttonText: "删除",
          text: "确定删除表单？",
        },
        {
          title: "停止收集",
          value: "4",
          type: "danger",
          buttonText: "停止",
          text: "停止后表单将不能收集数据，确定停止收集数据？",
        },
        {
          title: "链接",
          value: "5",
          type: "primary",
          buttonText: "复制链接",
          text: "表单链接",
        },
      ],

      rules: {
        name: [
          { required: true, message: "名称为必填项" },
          { max: 50, message: "最大长度50字符" },
        ],
      },
    };
  },
  methods: {
    handleClose(done) {
      this.$emit("close-window", false);
    },
    submitForm() {
      this.$emit("sumbit-window", true);
    },
  },
};
</script>

<style lang="less" scoped>
.linkCon {
  padding-top: 18px;
}

.listWindow {
  :deep(.el-dialog) {
    width: 30%;
  }
}
@media (max-width: 1000px) {
  .listWindow {
    :deep(.el-dialog) {
      width: 90%;
    }
  }
}
</style>
