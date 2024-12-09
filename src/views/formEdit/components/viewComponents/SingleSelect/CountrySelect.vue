<!-- eslint-disable vue/no-mutating-props -->
<template>
  <section>
    <el-select
      v-model="country"
      filterable
      clearable
      :disabled="disabled"
      @change="sumbitChange"
    >
      <el-option
        v-for="item in countryList"
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
  },
  data() {
    // // 设置默认
    const value = this.value;
    let country = null;
    if (value) {
      country = value;
    }
    return {
      country,
      countryList: [],
    };
  },
  mounted() {
    const store = useStore();
    this.countryList = store.countryList;
  },
  methods: {
    sumbitChange() {
      this.emitValue(this.country, this.province);
    },
    emitValue(value) {
      this.$emit("input", value);
    },
  },
};
</script>

<style lang="less" scoped>
.el-select + .el-select {
  margin-left: 20px;
}
@media (max-width: 1000px) {
  .el-select + .el-select {
    margin-top: 20px;
    margin-left: 0;
  }
}
</style>
