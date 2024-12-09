/**
 * Created by Liu.Jun on 2019/9/29 19:01.
 */

import genSchema from "../genSchema.js";

export default {
  viewSchema: {
    title: "产品选择",
    type: 'array',
    "ui:widget": "el-cascader",
    storeName: "product",
    "ui:clearable":true,
    "ui:filterable": true,
    items: {
      type: 'string'
    },
    "ui:options": {
      options: [],
    }
  },
  propsSchema: genSchema(),
};
