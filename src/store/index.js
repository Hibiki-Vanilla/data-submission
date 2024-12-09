import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => {
    return {
      isInit:true,
      countryList: [{ value: "1", label: "..." }],
      productList: [],
      sitekey:'6Le-XZQpAAAAAP3ssSO7Y70aZIlipDTFpo0DvtsZ'
    };
  },
  getters: {},
  actions: {
    setCountryList(list) {
      this.countryList = list;
    },
    setProductList(list) {
      this.productList = list;
    },
  },
});
