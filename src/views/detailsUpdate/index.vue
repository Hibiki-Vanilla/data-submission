<template>
  <section v-loading="loading" class="page">
    <TopRow :route-value="$route.params.topId" />
    <div class="mainCon">
    <div v-if="conStatus === 1" class="con">
      <div v-show="customNumbers" class="conNumber">
        {{ numberName }}：{{ customNumbers }}
      </div>
      <div class="conTitle">{{ formName }}</div>
      <VueJsonFrom
        v-model="formData"
        :ui-schema="uiSchema"
        :schema="schema"
        :form-footer="formFooter"
        :form-props="jsonFromValue ? jsonFromValue.formProps : {}"
        @on-form-mounted="formMounted"
        @on-submit="handlerSubmit"
      ></VueJsonFrom>
    </div>
    <div v-if="conStatus === 2" class="con">
      <img
        v-if="listCode === 1"
        class="successLogo"
        src="@/assets/global/success.svg"
        alt=""
      />
      <div class="tipText">
        {{ tipTextChange(listCode) }}
      </div>
    </div>
    <div style="padding-top: 120px"></div>
  </div>
    <!-- bottom -->

    <div class="bottomRow">
      <el-button v-if="conStatus === 1" type="primary" @click="handlerSubmit">
        提交
      </el-button>
      <el-button v-else type="primary" @click="returnChange()"> 返回列表 </el-button>
    </div>
  </section>
</template>

<script>
import { getFormDataEditInit, putFormDataEdit, getListProvince } from "@/api";
import TopRow from "./components/TopRow.vue";
import VueJsonFrom from "@lljj/vue-json-schema-form";
import dayjs from "dayjs";
import { useStore } from "@/store";
export default {
  name: "FillInUpdate",
  components: {
    TopRow,
    VueJsonFrom,
  },
  data() {
    return {
      loading: false,
      conStatus: 1,
      listCode: 0,

      jsonFromValue: null,
      numberName: "",
      customNumbers: "",
      formName: "",
      submitTimes: 0,
      createBy: "",
      updateTime: "",

      formRef: null,
      formData: {},
      formFooter: { show: false },
      schema: {},
      uiSchema: {},
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    timeChange(time) {
      return dayjs.unix(time / 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    formMounted(ref) {
      this.formRef = ref;
    },
    tipTextChange(code) {
      let text = "";
      if (code === 50002) {
        text = "参数有误";
      } else if (code === 50003) {
        text = "表单不在有效期内，不可填写";
      } else if (code === 50010) {
        text = "提交失败，表单已停止采集";
      } else if (code === 50011) {
        text = "提交失败，表单不存在";
      } else if (code === 50012) {
        text = "提交失败，表单仅可填写一次";
      } else if (code === 50013) {
        text = "提交失败，表单每日仅可填写一次";
      } else if (code === 1) {
        text = "提交成功";
      }

      return text;
    },
    returnChange() {
      this.$router.push(`/listInfo/${this.$route.params.topId}`);
    },
    fillAgainChange() {
      this.conStatus = 1;
    },
    async getInfo() {
      this.loading = true;
      const res = await getFormDataEditInit(this.$route.params.id);
      if (res?.success) {
        this.conStatus = 1;
        this.numberName = res.data.numberName || "";
        this.customNumbers = res.data.customNumbers || "";
        this.formName = res.data.formName;
        this.createBy = res.data.createBy;
        this.updateTime = res.data.updateTime;
        this.submitTimes = res.data.submitTimes;

        const formStructure = JSON.parse(res.data.formStructure);
        for (let key in formStructure.schema.properties) {
          if (formStructure.schema.properties[key].storeName === "product") {
            formStructure.schema.properties[key]["ui:options"] = useStore().productList;
          }
          formStructure.schema.properties[key]["err:required"] = "必填项不能为空";
          if (
            formStructure.schema.properties[key].storeName === "select" &&
            formStructure.schema.properties[key]["ui:widget"] !== "RadioWidget"
          ) {
            // 自定义Select处理 预留原生处理
            if (formStructure.schema.properties[key]["ui:widget"] === "DiySelect") {
              let optionsList = formStructure.schema.properties[key].enumNames.map(
                (item, index) => ({
                  label: item,
                  value: formStructure.schema.properties[key].enum[index],
                })
              );

              formStructure.schema.properties[key].enum = [];
              formStructure.schema.properties[key].enumNames = [];
              formStructure.schema.properties[key]["ui:options"] = optionsList;
              formStructure.schema.properties[key]["ui:status"] = "add";
            }
          }
        }
        this.schema = formStructure.schema;
        this.jsonFromValue = formStructure;
        this.uiSchema = formStructure.uiSchema;
      } else {
        this.conStatus = 2;
        this.listCode = res?.code || 0;
      }

      this.loading = false;
    },
    hasArrayKey(obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key.includes("array_") && Array.isArray(obj[key])) {
            return true;
          }
        }
      }
      return false;
    },
    handlerSubmit(e) {
      this.formRef.validate(async (valid) => {
        if (valid) {
          const list = this.schema.properties;
          let postObj = {};

          for (let key in list) {
            if (
              list[key].storeName === "multSelect" ||
              (list[key].storeName === "select" &&
                list[key]["ui:widget"] === "RadioWidget") ||
              (list[key].storeName === "select" && list[key]["ui:widget"] !== "DiySelect")
            ) {
              let arrObj = {};
              if (this.formData[key] && Array.isArray(this.formData[key])) {
                this.formData[key].map((item, index) => {
                  list[key].items.enum.map((dep, depIndex) => {
                    if (dep === item) {
                      arrObj[`${item}`] = list[key].items.enumNames[depIndex];
                    }
                  });
                });
              } else {
                list[key].enum.map((dep, depIndex) => {
                  if (dep === this.formData[key]) {
                    arrObj[`${this.formData[key]}`] =
                      list[key].enumNames[depIndex] || this.formData[key];
                  }
                });
              }
              postObj[key] = arrObj;
            } else if (
              list[key].storeName === "select" &&
              list[key]["ui:widget"] !== "RadioWidget"
            ) {
              let arrObj = {};

              list[key]["ui:options"].map((dep, depIndex) => {
                if (dep.value === this.formData[key]) {
                  arrObj[`${this.formData[key]}`] =
                    list[key]["ui:options"][depIndex].label;
                }
              });
              postObj[key] = arrObj;
            } else if (list[key].storeName === "product") {
              let arr = [];
              if (this.formData[key].length) {
                this.formData[key].map((item, index) => {
                  list[key]["ui:options"].map((dep, depIndex) => {
                    if (dep.value === item) {
                      arr.push({ value: item, label: dep.label });
                    } else {
                      dep.children.map((childen) => {
                        if (childen.value === item) {
                          arr.push({ value: item, label: childen.label });
                        }
                      });
                    }
                  });
                });
              }

              postObj[key] = arr;
            } else if (list[key].storeName === "countryProvince") {
              let arr = [];
              if (this.formData[key]) {
                const list = useStore().countryList || [];
                await Promise.all(
                  this.formData[key].map(async (item, index) => {
                    if (index === 0) {
                      list.map((dep, depIndex) => {
                        if (dep.value === item) {
                          arr.push({ value: item, label: dep.label });
                        }
                      });
                    } else {
                      if (item === "0") {
                        arr.push({ value: item, label: "None" });
                      }
                      const res = await getListProvince({
                        countryId: this.formData[key][0],
                      });
                      let provinceList = res?.data || [];
                      provinceList.map((dep, depIndex) => {
                        if (dep.value === item) {
                          arr.push({ value: item, label: dep.label });
                        }
                      });
                    }
                  })
                );
              }
              postObj[key] = arr;
            } else if (list[key].storeName === "country") {
              let arrObj = {};
              if (this.formData[key]) {
                useStore().countryList.map((item) => {
                  if (item.value === this.formData[key]) {
                    arrObj[`${this.formData[key]}`] = item.label;
                  }
                });
              }
              postObj[key] = arrObj;
            } else {
              postObj[key] = this.formData[key];
            }
          }

          const res = await putFormDataEdit(this.$route.params.id, postObj);
          if (res?.success) {
            this.$message.success("提交成功");
            this.formRef.resetFields();
          }
          this.conStatus = 2;
          this.listCode = res?.code || 0;
        } else {
          // 滚动到对应位置
          this.$nextTick(() => {
            // const formElement = this.formRef; // 获取表单元素的引用
            const requiredFields = document.querySelectorAll(".is-error");
            if (requiredFields.length > 0) {
              const firstRequiredField = requiredFields[0]; // 获取第一个必填项
              // 使用原生 JavaScript 的滚动方法将视图滚动到必填项位置
              firstRequiredField.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  position: relative;
  min-height: 100%;
  height: calc(100vh - 60px);
  width: 100%;
}
.mainCon{
  height: calc(100vh - 115px);
  width: 100%;
  overflow-x: hidden;
}
.con {
  width: 820px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 20px;
  margin: 48px auto;
  padding: 33px 70px;
  display: flex;
  flex-direction: column;
  // align-items: center;
}

.conTitle {
  color: rgba(80, 80, 80, 1);
  font-size: 24px;
  padding: 30px 0 40px;
  text-align: center;
  font-weight: bold;
}
.conNumber {
  color: rgba(80, 80, 80, 1);
  font-size: 16px;
}
.bottomRow {
  z-index: 5;
  position: absolute;
  right: 0;
  bottom: 0;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
}
.tipTextRow {
  padding-top: 90px;
}
.successLogo {
  margin: 0 auto;
  padding: 80px 0 30px;

  height: 82px;
  width: 82px;
}
.tipText {
  color: rgba(80, 80, 80, 1);
  font-size: 18px;
  line-height: 150%;
  text-align: center;
}

@media (max-width: 992px) {
  .con {
    width: calc(100% - 28px);
    margin: 38px 14px;
    padding: 33px 22px;
    box-sizing: border-box;
  }

  .conTitle {
    font-size: 14px;
    padding: 20px 0 20px;
  }

  .tipTextRow {
    padding-top: 90px;
    font-size: 14px;
  }
  .successLogo {
    margin: 0 auto;
    padding: 80px 0 12px;
    height: 82px;
    width: 82px;
  }
  .tipText {
    font-size: 18px;
  }

  .bottomRow {
    right: 0;
    bottom: 0;
    height: 80px;
    width: 100%;
  }
}
</style>
