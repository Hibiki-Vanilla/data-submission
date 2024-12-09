/**
 * Created by Liu.Jun on 2019/9/29 19:01.
 */

 import genSchema from "../genSchema.js";
//  import CustomWidget from "./CustomWidget.vue";


 export default {
   viewSchema: {
     title: "标签",
     type: 'string',
     "ui:widget": 'CustomWidget',
     storeName: "diy",
     "ui:options": {
        "placeholder": "Enter a value"
     }
   },
   propsSchema: genSchema(),
 };
 