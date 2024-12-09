<template>
  <section v-loading="loading" class="page">
    <TopRow
      :form-data="formData"
      :con-status="conStatus"
      @on-save="saveSubmit"
    />
    <div class="mainCon">
      <div v-if="conStatus === 1" class="con">
        <div class="conTitle">{{ formName }}</div>
        <VueJsonFrom
          v-model="formData"
          :ui-schema="uiSchema"
          :schema="schema"
          :form-footer="formFooter"
          :form-props="jsonFromValue ? jsonFromValue.formProps : {}"
          @on-form-mounted="formMounted"
          @on-submit="handlerSubmit"
          :error-schema="errorSchema"
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
      <el-button v-if="conStatus === 1" @click="saveSubmit()">
        {{ $t("editFill.save") }}
      </el-button>
      <el-button v-if="conStatus === 1" type="primary" @click="handlerSubmit()">
        {{ $t("editFill.submit") }}
      </el-button>
      <el-button v-if="conStatus === 2" type="primary" @click="returnChange()">
        {{ $t("editUpdate.returnList") }}
      </el-button>
      <el-button
        v-if="conStatus === 2 && listCode === 1 && submitTimes === 0"
        @click="fillAgainChange()"
      >
        {{ $t("editFill.fillAgain") }}
      </el-button>
    </div>
  </section>
</template>

<script>
import {
  getFormDataEditInit,
  getformStructureGet,
  postFormDataAddStatus,
  getListProvince,
} from "@/api";
import TopRow from "./components/TopRow.vue";
import VueJsonFrom from "@lljj/vue-json-schema-form";
import dayjs from "dayjs";
import { useStore } from "@/store";
export default {
  name: "FillInEidtPage",
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
      formName: "",
      submitTimes: 0,
      createBy: "",
      updateTime: "",
      customNumbers: null,

      formRef: null,
      formData: {},
      formFooter: { show: false },
      schema: {},
      uiSchema: {},
      errorSchema: {},
    };
  },
  mounted() {
    // 判断是否有copyId
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
        text = "editFill.invalid";
      } else if (code === 50003) {
        text = "editFill.noTime";
      } else if (code === 50010) {
        text = "editFill.failedStop";
      } else if (code === 50011) {
        text = "editFill.failedNot";
      } else if (code === 50012) {
        text = "editFill.failedPassed";
      } else if (code === 50013) {
        text = "editFill.failedOnce";
      } else if (code === 1) {
        text = "editFill.submitSuccess";
      }

      return this.$t(text);
    },
    returnChange() {
      this.$router.push("/fillIn");
    },
    fillAgainChange() {
      this.conStatus = 1;
      this.getInfo();
    },
    async getInfo() {
      this.loading = true;
      const res = this.$route.params.copyId
        ? await getFormDataEditInit(this.$route.params.copyId)
        : await getformStructureGet(this.$route.params.id);
      if (res?.success) {
        this.conStatus = 1;
        this.formName = res.data.formName;
        this.createBy = res.data.createBy;
        this.updateTime = res.data.updateTime;
        this.submitTimes = res.data.submitTimes;
        this.customNumbers = res?.data?.customNumbers || null;

        let formStructure = JSON.parse(res.data.formStructure);
        let errorSchema = {};
        for (let key in formStructure.schema.properties) {
          if (formStructure.schema.properties[key].storeName === "product") {
            formStructure.schema.properties[key]["ui:options"] =
              useStore().productList;
          }
          formStructure.schema.properties[key]["err:required"] =
            this.$t("editFill.noempty");
          if (
            formStructure.schema.properties[key].storeName === "select" &&
            formStructure.schema.properties[key]["ui:widget"] !== "RadioWidget"
          ) {
            // 自定义Select处理 预留原生处理
            if (
              formStructure.schema.properties[key]["ui:widget"] === "DiySelect"
            ) {
              let optionsList = formStructure.schema.properties[
                key
              ].enumNames.map((item, index) => ({
                label: item,
                value: formStructure.schema.properties[key].enum[index],
              }));
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
        this.errorSchema = errorSchema;
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
              (list[key].storeName === "select" &&
                list[key]["ui:widget"] !== "DiySelect")
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
          if (this.customNumbers) {
            postObj.customNumbers = this.customNumbers;
          }
          const res = await postFormDataAddStatus(
            this.$route.params.id,
            postObj,
            1
          );
          if (res?.success) {
            this.$message.success(this.$t("editFill.submitSuccess"));
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
              firstRequiredField.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          });
        }
      });
    },
    async saveSubmit() {
      const list = this.schema.properties;
      let postObj = {};
      for (let key in list) {
        if (
          list[key].storeName === "multSelect" ||
          (list[key].storeName === "select" &&
            list[key]["ui:widget"] === "RadioWidget")
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
          // 新旧分类
          if (list[key]["ui:options"]) {
            list[key]["ui:options"].map((dep, depIndex) => {
              if (dep.value === this.formData[key]) {
                arrObj[`${this.formData[key]}`] =
                  list[key]["ui:options"][depIndex].label;
              }
            });
            postObj[key] = arrObj;
          } else {
            list[key]?.enum.map((dep, depIndex) => {
              if (dep === this.formData[key]) {
                arrObj[`${this.formData[key]}`] = list[key].enumNames[depIndex];
              }
            });
            postObj[key] = arrObj;
          }
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
                  const provinceList = res?.data || [];
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
      if (this.customNumbers) {
        postObj.customNumbers = this.customNumbers;
      }
      const res = await postFormDataAddStatus(
        this.$route.params.id,
        postObj,
        0
      );
      if (res?.success) {
        this.$message.success(this.$t("editFill.submitSuccess"));
        this.formRef.resetFields();
      }
      this.conStatus = 2;
      this.listCode = res?.code || 0;
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
.mainCon {
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
    padding: 0px 0 20px;
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
