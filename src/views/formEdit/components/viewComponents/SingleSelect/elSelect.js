/**
 * Created by Liu.Jun on 2020/12/10 15:41.
 */

import baseRadio from "./index";

const viewSchema = {
  title: "单选",
  type: "string",
  "ui:widget": "SelectWidget",
  storeName: "select",
  "ui:clearable":true
};

export default {
  viewSchema,
  propsSchema: baseRadio.propsSchema,
};
