<template>
  <section v-loading="loading">
    <TopRow :route-value="$route.params.topId" />
    <div class="con">
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
      ></VueJsonFrom>
      <div class="conTop">
        <span>{{ $t("editInfo.createBy") }}: {{ createBy }}</span>
        <span>{{ $t("editInfo.updateTime") }}: {{ timeChange(updateTime) }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import { getFormDataDetails } from "@/api";
import TopRow from "./components/TopRow.vue";
import configTools from "@/views/formEdit/components/config/tools";
import VueJsonFrom from "@lljj/vue-json-schema-form";
import dayjs from "dayjs";
import { useStore } from "@/store";
export default {
  name: "DetailsPage",
  components: {
    TopRow,
    VueJsonFrom,
  },
  data() {
    return {
      loading: false,
      configTools,

      jsonFromValue: null,
      numberName: "",
      customNumbers: "",
      formName: "",
      createBy: "",
      updateTime: "",
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
    buildValue(data) {},
    async getInfo() {
      this.loading = true;
      const res = await getFormDataDetails(this.$route.params.id);
      if (res?.success) {
        this.numberName = res.data.numberName || "";
        this.customNumbers = res.data.customNumbers || "";
        this.formName = res.data.formName;
        this.createBy = res.data.createBy;
        this.updateTime = res.data.updateTime;
        const formStructure = JSON.parse(res.data.formStructure);
        for (let key in formStructure.schema.properties) {
          if (formStructure.schema.properties[key].storeName === "product") {
            formStructure.schema.properties[key]["ui:options"] = useStore().productList;
          }
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
      }

      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
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
.conTop {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 16px;
  color: rgba(80, 80, 80, 1);
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

@media (max-width: 992px) {
  .con {
    width: calc(100% - 28px);
    margin: 38px 14px;
    padding: 33px 22px;
    box-sizing: border-box;
  }
  .conTop {
    flex-direction: column;
    font-size: 16px;
    span + span {
      margin-top: 10px;
    }
  }
  .conTitle {
    font-size: 14px;
    padding: 20px 0 20px;
  }
}
</style>
