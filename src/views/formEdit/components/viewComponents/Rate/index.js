/**
 * Created by Liu.Jun on 2019/9/29 19:01.
 */

 import genSchema from "../genSchema.js";
 
 export default {
   viewSchema: {
     title: "评分",
     type: "number",
     storeName:'number',
     'ui:widget': 'el-rate',
   },
   propsSchema: genSchema(),
 };
 