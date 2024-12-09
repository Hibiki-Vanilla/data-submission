/**
 * Created by Liu.Jun on 2020/12/10 15:53.
 */
import genSchema from "../genSchema.js";
export default {
  viewSchema: {
    title: "国家/州省",
    type: "array",
    "ui:widget": "CountryProvinceWidget",
    storeName:'countryProvince',
    items: {
      type: 'string'
    }
  },
  propsSchema: genSchema({
    options: {
      type: "object",
      title: "选项",
      required: [],
      properties: {
        schemaOptions: {
          type: "object",
          properties: {
          },
        },
      },
    },
  }),
};
