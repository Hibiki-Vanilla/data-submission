import Vue from "vue";
import App from "./App.vue";

// store
import { createPinia, PiniaVuePlugin } from "pinia";
Vue.use(PiniaVuePlugin);
const pinia = createPinia();
// 路由
import VueRouter from "vue-router";
import routes from "./router";
Vue.use(VueRouter);
// Ui
import "@/assets/bootstrap.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
// i18n
import VueI18n from "vue-i18n";
import { messages } from "@/i18n";
Vue.use(VueI18n);
import locale from "element-ui/lib/locale";
import langZh from "element-ui/lib/locale/lang/zh-CN";
import langRu from "element-ui/lib/locale/lang/ru-RU";
import langEn from "element-ui/lib/locale/lang/en";
import langFr from "element-ui/lib/locale/lang/fr";
import langIt from "element-ui/lib/locale/lang/it";
import langEs from "element-ui/lib/locale/lang/es";
import langPt from "element-ui/lib/locale/lang/pt";
import langKo from "element-ui/lib/locale/lang/ko";
import langJa from "element-ui/lib/locale/lang/ja";
import langAr from "element-ui/lib/locale/lang/ar";
import langId from "element-ui/lib/locale/lang/id";
const langList = {
  en: langEn,
  ru: langRu,
  "zh-CN": langZh,
  fr: langFr,
  it: langIt,
  es: langEs,
  pt: langPt,
  ko: langKo,
  ja: langJa,
  ar: langAr,
  id: langId,
};
let list = {
  "zh-CN": "数据提报系统",
  en: "Data Submission System",
  ru: "Система отправки данных",
  fr: "Système de soumission des données",
  it: "Sistema di invio dati",
  es: "Sistema de envío de datos",
  pt: "Sistema de envio de dados",
  ko: "데이터 전송 시스템",
  ja: "データ送信システム",
  ar: '"نظام إرسال البيانات',
  id: "Sistem Pengiriman Data",
};
const isLanguageMatched = Object.keys(langList).includes(navigator.language);
const text = localStorage.getItem("dslocale") || false;
const isListLang = text ? Object.keys(langList).includes(text) : false;
const dslocale = isListLang
  ? text
  : isLanguageMatched
  ? navigator.language
  : "zh-CN";
console.log(dslocale);
locale.use(langList[dslocale]);
document.title = list[dslocale] || list["zh-CN"];
const i18n = new VueI18n({
  messages,
  locale: dslocale ? dslocale : "zh-CN",
});

// 组件
import UploadStringWidget from "@/views/formEdit/components/viewComponents/Upload/UploadStringWidget.vue";
Vue.component("UploadStringWidget", UploadStringWidget);
import UploadImgWidget from "@/views/formEdit/components/viewComponents/UploadImg/UploadImgWidget.vue";
Vue.component("UploadImgWidget", UploadImgWidget);
import CountryProvinceSelect from "@/views/formEdit/components/viewComponents/SingleSelect/CountryProvinceSelect.vue";
Vue.component("CountryProvinceWidget", CountryProvinceSelect);
import CountrySelect from "@/views/formEdit/components/viewComponents/SingleSelect/CountrySelect.vue";
Vue.component("CountrySelect", CountrySelect);
import DiySelect from "@/views/formEdit/components/viewComponents/SingleSelect/DiySelect.vue";
Vue.component("DiySelect", DiySelect);

Vue.config.productionTip = false;

import { inAuthority } from "@/utils/authority";
Vue.prototype.$inAuthority = inAuthority;
new Vue({
  pinia,
  i18n,
  router: new VueRouter({
    mode: "history",
    routes,
    scrollBehavior() {
      return { x: 0, y: 0 };
    },
  }),
  render: (h) => h(App),
}).$mount("#app");
