<template>
  <section class="box">
    <div class="leftBox">
      <i class="el-icon-back" @click="backRouterChange"></i>
      <el-input
        v-if="inputStatus"
        v-model="title"
        placeholder="请输入标题"
        max="100"
        @blur="titleBulr"
      />
      <div v-else class="title" @click="inputStatusChange">{{ topTitle }}</div>
    </div>

    <div class="rightBox">
      <div class="preview itemButton" @click="handlePreview">
        <i class="el-icon-s-platform"></i>
        预览
      </div>
      <div
        class="save itemButton"
        @click="pushNowValue(0)"
        v-if="editInitData ? editInitData.state !== 1 : true"
      >
        <img src="@/assets/global/save.svg" class="" alt="" />
        保存
      </div>
      <div class="setting itemButton" @click="windowChange">
        <img src="@/assets/global/setting.svg" class="" alt="" />
        设置
      </div>

      <div class="release itemButton" @click="pushNowValue(1)">
        <img src="@/assets/global/release.svg" class="" alt="" />
        发布
      </div>
    </div>
  </section>
</template>

<script>
import { componentList2JsonSchema, formatFormLabelWidth } from "./common/editorData";
import componentWithDialog from "./component-with-dialog";
import VueJsonFrom from "@lljj/vue-json-schema-form";

export default {
  name: "TopRow",
  props: {
    topTitle: {
      type: String,
      default: "",
    },
    componentList: {
      type: Array,
      default: () => [],
    },
    windowChange: {
      type: Function,
      default: () => {},
    },
    pushNowValue: {
      type: Function,
      default: () => {},
    },
    editInitData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    topTitle(value) {
      this.title = value === "未命名表单" ? "" : value;
    },
  },
  data() {
    return {
      inputStatus: false,
      title: "",
    };
  },
  methods: {
    // 返回前判断
    backRouterChange() {
      // 新增时判断是否有内容
      if (!this.editInitData) {
        if (this.componentList.length) {
          this.$confirm(`是否保存表单？`, {
            distinguishCancelAndClose: true,
            confirmButtonText: "保存",
            cancelButtonText: "不保存",
            customClass: "mobileConfirm", // 添加自定义类名
            showClose: false,
          })
            .then(() => {
              this.pushNowValue(0);
            })
            .catch((_) => {
              this.$router.push("/management");
            });
        } else {
          this.$router.push("/management");
        }
      } else {
        this.$router.push("/management");
      }
    },
    inputStatusChange() {
      this.inputStatus = true;
    },
    titleBulr() {
      this.inputStatus = false;
      this.$emit("on-submit", this.title);
    },
    getExportCode() {
      const { formFooter, formProps } = this;
      console.log(formFooter, formProps);
      const defaultConfig = {
        formFooter: {
          show: false,
          okBtn: "保存",
          cancelBtn: "取消",
        },
        formProps: {
          inline: false,
          inlineFooter: false,
          layoutColumn: 1,
          labelPosition: "top",
        },
      };

      // 不做深度
      const filter = (obj, defaultObj) =>
        Object.keys(obj).reduce((pre, cur) => {
          if (!(obj[cur] === defaultObj[cur])) {
            pre[cur] = obj[cur];
          }
          return pre;
        }, {});

      return {
        schema: componentList2JsonSchema(this.componentList),
        uiSchema: {},
        formFooter: defaultConfig.formFooter,
        // formProps: filter(formProps, defaultConfig.formProps)
      };
    },
    // 预览
    handlePreview() {
      const props = this.getExportCode();
      const instance = componentWithDialog({
        VueComponent: VueJsonFrom,
        dialogProps: {
          title: "预览展示",
          width: "1000px",
        },
        componentProps: {
          value: {},
          ...props,
        },
        componentListeners: {
          toDemo: () => {
            this.handleToDemo();
          },
          "on-cancel": () => {
            instance.close();
          },
          "on-submit": (data) => {
            // eslint-disable-next-line no-alert
            alert(JSON.stringify(data, null, 2));
          },
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-left: 12px;
  padding-right: 30px;
  width: 100%;
  height: 48px;
  margin-bottom: 4px;
  background-color: #fff;

  .leftBox {
    display: flex;
    align-items: center;

    .el-icon-back {
      cursor: pointer;
      font-size: 28px;
      margin-right: 16px;
    }

    .title {
      cursor: pointer;
      color: rgba(80, 80, 80, 1);
      font-size: 18px;
      font-weight: bold;
      min-width: 200px;
      width: 200px;
      height: 28px;
      line-height: 28px;
      white-space: nowrap; /* 不换行 */
      overflow: hidden; /* 溢出内容隐藏 */
      text-overflow: ellipsis; /* 文本超出显示省略号 */
    }
  }

  .rightBox {
    display: flex;
    align-items: center;

    .itemButton {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-left: 20px;
      color: rgba(80, 80, 80, 1);
      font-size: 14px;
      .el-icon-s-platform {
        color: rgba(153, 153, 153, 1);
        font-size: 24px;
        margin-right: 4px;
      }
      img {
        height: 24px;
        width: 24px;
        margin-right: 4px;
      }
    }
  }
}
</style>
