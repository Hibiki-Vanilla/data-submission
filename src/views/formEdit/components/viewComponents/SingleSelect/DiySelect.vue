<!-- eslint-disable vue/no-mutating-props -->
<template>
  <section>
    <el-select
      v-model="selectValue"
      filterable
      clearable
      :disabled="disabled"
      @change="sumbitChange"
    >
      <el-option
        v-for="item in optionsList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </section>
</template>

<script>
import { decryptByDES } from "@/utils/aes";
import { useStore } from "@/store";
import { getListProvince } from "@/api";
export default {
  name: "CountryProvinceWidget",
  props: {
    value: {
      type: [String, Array],
      default: null,
    },
    placeholder: {
      type: String,
      default: "",
    },

    disabled: {
      type: Boolean,
      default: false,
    },
    slots: {
      type: null,
      default: null,
    },
    enumOptions: {
      type: [Array],
      default: () => [],
    },
    options: {
      type: [Array],
      default: () => [],
    },
    status: {
      type: String,
      default: "",
    },
  },
  data() {
    // // 设置默认
    const value = this.value;
    let selectValue = value;
    let optionsList = this.status === "add" ? this.options : this.enumOptions;
    return {
      selectValue,
      optionsList,
    };
  },
  watch: {
    enumOptions(value) {
      if (this.status !== "add") {
        this.optionsList = value;
      }
    },
  },
  methods: {
    sumbitChange() {
      this.emitValue(this.selectValue);
    },
    emitValue(value) {
      this.$emit("input", value);
    },
  },
};
</script>
