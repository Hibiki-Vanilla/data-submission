import axios from "axios";
import { Message } from "element-ui";
import { decryptByDES } from "./aes.js";
const service = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8", // 'application/x-www-form-urlencoded;charset=UTF-8'
    "uwell-app-id": "1760580848534081637",
  },
});

// 请求拦截
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("dst") || "";
    const baerer = decryptByDES(token, "dst");

    if (baerer === null && config.url !== '/u/uwell-auth/oauth2/token') {
      localStorage.removeItem("dst");
      localStorage.removeItem("dsn");
      const url = location.origin;
      window.location.replace(url + "/");
    } else {
      token && (config.headers.Authorization = `Bearer ${baerer}`);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 返回拦截
service.interceptors.response.use(
  (response) => {
    Message.closeAll();
    let langList = {
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
    // const isLanguageMatched = Object.keys(langList).includes(
    //   navigator.language
    // );
    // const dslocale =
    //   localStorage.getItem("dslocale") ||
    //   (isLanguageMatched ? navigator.language : "zh-CN");
    const res = response.data;
    if (res?.code === 1) {
      return res;
    } else if (
      res?.code === 10220 ||
      res?.code === 10223 ||
      res?.code === 10224 ||
      res?.code === 10225 ||
      res?.code === 10226
    ) {
      Message.error({
        duration: 3000,
        message: res.msg || "",
      });
      localStorage.removeItem("dst");
      localStorage.removeItem("dsn");
      setTimeout(() => {
        const url = location.origin;
        window.location.replace(url + "/");
      }, 1500);
    } else if (
      res?.code === 33100 ||
      res?.code === 50002 ||
      res?.code === 50010 ||
      res?.code === 50011 ||
      res?.code === 50012 ||
      res?.code === 50013 ||
      res?.code === 108500 ||
      res?.code === 108501 ||
      res?.code === 108502 ||
      res?.code === 108503 ||
      res?.code === 108507
    ) {
      return res;
    } else {
      setTimeout(() => {
        Message.warning({
          duration: 3000,
          message: res.msg || "",
        });
      }, 200);

      return res;
    }
  },
  (error) => {
    const { response } = error;
    console.log("网络请求异常，请稍后重试!");
    return response;
  }
);
export default service;
