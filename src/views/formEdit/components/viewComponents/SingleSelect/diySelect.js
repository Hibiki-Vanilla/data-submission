

import baseRadio from "./index";
const viewSchema = {
  title: "下拉单选",
  type: "string",
  "ui:widget": "DiySelect",
  storeName: "select",
};

export default {
  viewSchema,
  propsSchema: baseRadio.propsSchema,
};
