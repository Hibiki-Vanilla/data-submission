<!-- eslint-disable vue/no-mutating-props -->
<template>
  <section>
    <el-select
      v-model="country"
      filterable
      clearable
      :disabled="disabled"
      @change="countryChange"
    >
      <el-option
        v-for="item in countryList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>

    <el-select
      v-model="province"
      filterable
      clearable
      :disabled="disabled"
      @change="sumbitChange"
    >
      <el-option :label="'None'" :value="'0'"> </el-option>
      <el-option
        v-for="item in provinceList"
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
    let province = null;
    if (value) {
      country = value[0] || null;
      province = value[1] || null;
    }
    if (value) {
      this.countryChange(value[0], true);
    }
    return {
      country,
      province,

      countryList: [],
      provinceList: [],
    };
  },
  mounted() {
    const store = useStore();
    this.countryList = store.countryList;
  },
  methods: {
    async countryChange(id, status) {
      const res = await getListProvince({ countryId: id });
      if (id && res?.success) {
        this.provinceList = res?.data || [];
      } else {
        this.provinceList = [];
      }
      if (!status) {
        this.province = null;
      }
      this.sumbitChange();
    },
    sumbitChange() {
      this.emitValue(
        this.country && this.province ? [this.country, this.province] : null
      );
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
