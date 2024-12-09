<template>
  <div class="container">
    <div
      :class="{
        contentWrap: true,
        closeToolbar: closeToolbar,
      }"
    >
      <!-- 左侧 -->
      <div class="toolBarWrap">
        <div class="toolsBar">
          <EditorToolBar
            :drag-group="dragOptions.group"
            :config-tools="configTools"
            @onFilter="$message.error('该组件已被禁用')"
          >
          </EditorToolBar>
        </div>
        <span class="leftCaret" @click="closeToolbar = !closeToolbar">
          <i class="el-icon-caret-right"></i>
        </span>
      </div>
      <!-- 中间 -->
      <div class="contentBox">
        <el-form
          style="height: 100%"
          :model="rootFormData"
          v-bind="formProps"
          class="genFromComponent"
          :class="{
            layoutColumn: !formProps.inline,
            [`layoutColumn-${formProps.layoutColumn}`]: !formProps.inline,
            formInlineFooter: formProps.inlineFooter,
            formInline: formProps.inline,
            // [`genFromComponent_${schema.id}Form`]: !!schema.id,
          }"
        >
          <NestedEditor
            :child-component-list="componentList"
            :drag-options="dragOptions"
            :form-data="rootFormData"
            :form-props="formProps"
          >
            <el-form-item
              v-if="componentList.length > 0 && formFooter.show"
              :style="{
                display:
                  formProps.inline && formProps.inlineFooter ? 'inline-block' : 'block',
              }"
              class="formFooter_item w100 formFooter_item-editor"
            >
              <el-button @click="$emit('onCancel')">{{ formFooter.cancelBtn }}</el-button>
              <el-button type="primary" @click="$emit('onSubmit')">
                {{ formFooter.okBtn }}
              </el-button>
            </el-form-item>
          </NestedEditor>
        </el-form>
        <div v-if="componentList.length === 0" class="tipBox">
          <p>拖拽左侧栏的组件进行添加</p>
        </div>
      </div>
      <!-- 右边 -->
      <div class="rightForm">
        <el-tabs v-model="activeName">
          <el-tab-pane v-if="curEditorItem" label="组件配置" name="compConfig">
            <VueJsonFrom
              v-model="curEditorItem.componentValue"
              class="configForm"
              :schema="curEditorItem.componentPack.propsSchema"
              :form-props="{
                labelPosition: 'right',
                labelWidth: '110px',
              }"
              :form-footer="{
                show: false,
              }"
            >
            </VueJsonFrom>
          </el-tab-pane>
          <el-tab-pane label="表单配置" name="formConfig">
            <VueJsonFrom
              v-model="formConfig"
              class="configForm"
              :schema="FormConfSchema"
              :form-props="{
                labelPosition: 'right',
                labelWidth: '120px',
              }"
              :form-footer="{
                show: false,
              }"
            >
            </VueJsonFrom>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import VueJsonFrom from "@lljj/vue-json-schema-form";
import componentWithDialog from "./component-with-dialog";
import ExportSchemaView from "./ExportSchemaView.vue";

import EditorToolBar from "./EditorToolBar.vue";
import NestedEditor from "./NestedEditor";
import FormConfSchema from "./viewComponents/FormConf";

import { componentList2JsonSchema, formatFormLabelWidth } from "./common/editorData";
import { deepFreeze } from "./common/utils";
// 配置
import configTools from "./config/tools";
// deepFreeze(configTools);

// import { postSchemaTableAdd, getListCountry, getListProduct } from "@/api";
// store
import { useStore } from "@/store";
const { setCountryList, setProductList } = useStore();
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Editor",
  components: {
    // EditorHeader,
    VueJsonFrom,
    EditorToolBar,
    NestedEditor,
  },
  props: {
    topTitle: {
      type: String,
      default: "",
    },
    componentList: {
      type: Array,
      default: () => [],
    },
  },
  provide() {
    return {
      genFormProvide: {
        fallbackLabel: true,
      },
    };
  },
  data() {
    return {
      closeToolbar: false,
      loading: false,
      configTools,
      rootFormData: {},
      curEditorItem: null, // 选中的formItem
      // componentList: [],
      FormConfSchema,
      formConfig: {},
      activeName: "formConfig",
      returnID: "",
    };
  },
  computed: {
    formProps() {
      if (!this.formConfig.formProps) return {};
      return {
        ...this.formConfig.formProps,
        labelWidth: formatFormLabelWidth(this.formConfig.formProps.labelWidth),
      };
    },
    formFooter() {
      return this.formConfig.formFooter || {};
    },
    dragOptions() {
      return {
        animation: 300,
        group: "listComponentsGroup",
        disabled: false,
        ghostClass: "ghostItem",
        filter: ".disabled",
        draggable: ".draggableItem",
        tag: "div",
        swapThreshold: 0.3,
        // forceFallback: true
        // fallbackTolerance: 0
      };
    },
  },
  mounted() {
    // this.getCountry();
    // this.getProduct();
    window.document.body.classList.add("page-decorate-design");
  },
  unmounted() {
    window.document.body.classList.remove("page-decorate-design");
  },
  created() {
    this.$on("onSetCurEditorItem", ({ editorItem }) => {
      this.activeName = editorItem ? "compConfig" : "formConfig";
      this.curEditorItem = editorItem;
    });
  },
  methods: {
    // async getCountry() {
    //   const res = await getListCountry();
    //   if (res?.success) {
    //     const list = res.data;
    //     setCountryList(list);
    //   }
    // },
    // async getProduct() {
    //   const res = await getListProduct();
    //   if (res?.success) {
    //     const list = res.data;
    //     setProductList(list);
    //   }
    // },
    getExportCode() {
      const { formFooter, formProps } = this;
      const defaultConfig = {
        formFooter: {
          show: true,
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
        formFooter: filter(formFooter, defaultConfig.formFooter),
        formProps: filter(formProps, defaultConfig.formProps),
      };
    },
    // handleExportSchema() {
    //   componentWithDialog({
    //     VueComponent: ExportSchemaView,
    //     dialogProps: {
    //       title: "导出Schema",
    //       width: "1000px",
    //     },
    //     componentProps: {
    //       genCode: this.getExportCode(),
    //     },
    //     componentListeners: {
    //       toDemo: () => {
    //         this.handleToDemo();
    //       },
    //     },
    //   });
    // },
    // async onSchemaTableAdd() {
    //   const { formFooter, formProps } = this;
    //   const defaultConfig = {
    //     formFooter: {
    //       show: true,
    //       okBtn: "保存",
    //       cancelBtn: "取消",
    //     },
    //     formProps: {
    //       inline: false,
    //       inlineFooter: false,
    //       layoutColumn: 1,
    //       labelPosition: "top",
    //     },
    //   };

    //   // 不做深度
    //   const filter = (obj, defaultObj) =>
    //     Object.keys(obj).reduce((pre, cur) => {
    //       if (!(obj[cur] === defaultObj[cur])) {
    //         pre[cur] = obj[cur];
    //       }
    //       return pre;
    //     }, {});
    //   const data = {
    //     schema: componentList2JsonSchema(this.componentList),
    //     uiSchema: {},
    //     formFooter: filter(formFooter, defaultConfig.formFooter),
    //     formProps: filter(formProps, defaultConfig.formProps),
    //   };
    //   const res = await postSchemaTableAdd({
    //     tableStructure: JSON.stringify(data),
    //   });
    //   if (res?.success) {
    //     this.$message(res.msg);
    //     this.returnID = res.data;
    //   }
    // },
    onRouterItemClick(value) {
      this.$router.push(value);
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/assets/variable.css";

@site-top-height: 80px;
@tool-bar-width: 260px;
@right-form-width: 380px;
@drag-area-width: auto;

body.page-decorate-design {
  overflow: hidden;
}
.flip-list-move {
  transition: transform 0.3s;
}
.no-move {
  transition: transform 0s;
}

.header {
  position: relative;
  margin: 0 auto;
  padding: 0 2%;
  height: 80px;
  background: var(--color-white);
  display: flex;
  align-items: center;
  box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.3);
  z-index: 3;
}

// /*预览模式 同步样式重置*/
.container {
  position: relative;
  box-sizing: border-box;
  height: calc(100vh - 80px);
  transition: 0.2s ease;
}

.hasTools {
  padding-left: @tool-bar-width;

  .el-icon-caret-right {
    transform: rotate(180deg);
  }
}
// /*tools*/
.toolBarWrap,
.rightForm {
  position: absolute;
  top: 0;
  bottom: 0;
  background: var(--color-white);
  box-shadow: 0 0 0 1px rgba(171 171 171, 0.3);
  z-index: 2;
}

.rightForm,
.toolsBar {
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}

.toolBarWrap {
  padding-top: 10px;
  width: @tool-bar-width;
  left: 0;
  overflow: visible;
}
.toolsBar {
  height: 100%;
}
.leftCaret {
  cursor: pointer;
  position: absolute;
  display: flex;
  width: 18px;
  height: 38px;
  align-items: center;
  justify-content: center;
  top: 2px;
  right: 0;
  background: #ffffff;
  box-shadow: 0 0 4px 0 var(--color-black);
  border-radius: 2px 0 0 2px;
  .el-icon-caret-right {
    transition: all 0.3s ease;
    transform: rotate(180deg);
  }
  &:hover {
    box-shadow: 0 0 4px 0 var(--color-black);
    opacity: 1;
  }
}
.rightForm {
  box-sizing: border-box;
  padding: 10px;
  right: 0;
  width: @right-form-width;
}
.configForm {
  padding: 0 20px;
  & > h3 {
    font-size: 15px;
    font-weight: bold;
  }
}

/*content area*/
.contentWrap {
  position: relative;
  overflow: auto;
  height: 100%;
  padding-left: @tool-bar-width;
  padding-right: @right-form-width;
  &::-webkit-scrollbar {
    width: 6px;
    height: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: var(--background-color-base);
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--color-text-placeholder);
  }
}
.closeToolbar {
  padding-left: 0;
  .toolBarWrap {
    left: -@tool-bar-width;
    .leftCaret {
      right: -18px;
    }

    .el-icon-caret-right {
      transform: rotate(0);
    }
  }
}
.contentBox {
  position: relative;
  padding: 0;
  height: 100%;
}
.tipBox {
  pointer-events: none;
  top: 20px;
  position: absolute;
  left: 0;
  width: 100%;
  text-align: center;
  margin: 30vh 0;
  p {
    margin: 20px 0;
    font-size: 16px;
  }
}
</style>
