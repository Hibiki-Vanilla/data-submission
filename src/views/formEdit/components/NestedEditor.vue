<template>
  <draggable
    ref="draggable"
    :list="childComponentList"
    v-bind="dragOptions"
    class="dragArea formItemWrap"
    @change="handleDragChange"
  >
    <div
      v-for="item in childComponentList"
      :key="item.id"
      :class="{
        draggableItem: true,
        w100: showNestedEditor(item),
        formItem: true,
      }"
      :style="
        item.componentValue.baseValue.uiOptions.width
          ? {
              width: item.componentValue.baseValue.uiOptions.width,
              flexBasis: item.componentValue.baseValue.uiOptions.width,
            }
          : {}
      "
    >
      <ViewComponentWrap
        :form-data="formData"
        :editor-item="item"
        :drag-options="dragOptions"
        :show-nested-editor="showNestedEditor"
        :form-props="formProps"
        @onOperate="handleItemOperate"
      >
      </ViewComponentWrap>
    </div>
    <template v-slot:footer>
      <slot></slot>
    </template>
  </draggable>
</template>

<script>
import Draggable from "vuedraggable";
import * as arrayMethods from "@/utils/array";
import { generateEditorItem } from "./common/editorData";

// 避免循环依赖导致undefined
const ViewComponentWrap = () => import("./ViewComponentWrap");

import { useStore } from "@/store";
const store = useStore();

export default {
  name: "NestedEditor",
  components: {
    Draggable,
    ViewComponentWrap,
  },
  props: {
    dragOptions: {
      type: Object,
      default: () => ({}),
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    childComponentList: {
      type: Array,
      default: () => [],
    },
    formProps: {
      type: null,
      default: null,
    },
  },
  watch: {
    childComponentList() {
      this.computedComponentToolBarStatus();
    },
  },
  created() {},
  methods: {
    showNestedEditor(editorItem) {
      return editorItem.childList && !editorItem.componentPack.viewSchema.format;
    },
    handleDragChange(...args) {
      // console.log(args[0].added.element);
      // console.log(store.countryList);
    },
    // 计算各个组件状态栏按钮状态
    computedComponentToolBarStatus() {
      this.childComponentList.forEach((component, componentIndex) => {
        if (component.componentPack.viewSchema.storeName === "country") {
          Object.assign(component.componentPack.viewSchema, {
            "ui:enumOptions": store.countryList,
          });
        }

        if (component.componentPack.viewSchema.storeName === "product") {
          Object.assign(component.componentPack.viewSchema["ui:options"], {
            options: store.productList,
          });
        }

        Object.assign(component.toolBar, {
          moveUpDisabled: componentIndex === 0, // 是否可上移动
          moveDownDisabled: componentIndex === this.childComponentList.length - 1, // 是否可下移
          removeDisabled: component.additional && component.additional.unRemove, // 是否可移除
        });
      });
    },
    // 操作单个组件
    handleItemOperate({ item, command }) {
      const strategyMap = {
        moveUp(target, arrayItem) {
          return arrayMethods.moveUp(target, arrayItem);
        },
        moveDown(target, arrayItem) {
          return arrayMethods.moveDown(target, arrayItem);
        },
        copy(target, arrayItem) {
          // 不copy数据
          // eslint-disable-next-line no-unused-vars
          const { componentValue, ...emptyPack } = arrayItem;

          return target.splice(
            target.indexOf(arrayItem) + 1,
            0,
            generateEditorItem(emptyPack)
          );
        },
        remove(target, arrayItem) {
          return arrayMethods.remove(target, arrayItem);
        },
      };

      const curStrategy = strategyMap[command];

      if (curStrategy) {
        curStrategy.apply(this, [this.childComponentList, item]);
      } else {
        this.$message.error(`系统错误 - 未知的操作：[${command}]`);
      }
    },
  },
};
</script>

<style>
.ghostItem {
  opacity: 0.6;
  background-color: rgba(43, 153, 57, 0.4) !important;
  box-shadow: 0 0 1px 0 #2b9939;
}
.ghostItem.draggableToolItem {
  margin-top: 0;
  width: 100%;
  max-width: 100%;
  margin-bottom: 10px;
  height: 130px;
  line-height: 130px;
}
</style>

<style lang="less" scoped>
@import "@/assets/variable.css";
.draggableToolItem {
  width: auto;
  max-width: none;
  padding: 0 20px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.w100 {
  width: 100%;
}
.formFooter_item-editor {
  width: auto;
  max-width: none;
}

.dragArea {
  width: 100%;
  box-sizing: border-box;
  font-size: 0;
  background-color: #f5f5f5;
  height: 100%;
  padding: 15px;
  overflow: auto;
  .dragArea {
    &:empty {
      padding: 20px;
      &:after {
        display: block;
        text-align: center;
        font-size: 12px;
        content: "拖入子组件";
      }
    }
  }

  .fieldGroupWrap_box {
    display: none !important;
  }
  .emptyBox {
    min-height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .viewEmpty_IconBox {
    color: #61a5ff;
    font-size: 50px;
    text-align: center;
  }
  .el-image {
    vertical-align: top;
  }
}

.layoutColumn {
  .w100 {
    width: 100% !important;
  }

  .formItemWrap {
    .el-form-item {
      width: 100% !important;
      flex-basis: 100% !important;
    }
  }

  .formItem {
    display: inline-block;
    vertical-align: top;
  }
  .draggableToolItem {
    display: inline-block;
    vertical-align: top;
    border: none;
  }
  &.layoutColumn-1 {
    .formItem {
      width: 100%;
    }
    .draggableToolItem {
      width: 100%;
    }
  }
  &.layoutColumn-2 {
    .formItem {
      width: 50%;
    }
    .draggableToolItem {
      width: 49.6%;
    }
  }
  &.layoutColumn-3 {
    .formItem {
      width: 33.333%;
    }
    .draggableToolItem {
      width: 33%;
    }
  }
}
</style>
