/**
 * Created by Liu.Jun on 2020/11/27 11:03 下午.
 */

import genSchema from "../genSchema.js";

const viewSchema = {
  title: "多媒体上传",
  type: "array",
  storeName: "upload",
  items: {
    type: 'string'
  },
  "ui:widget": "UploadImgWidget",
};

export default {
  viewSchema,
  propsSchema: genSchema({
    options: {
      type: "object",
      title: "选项",
      required: [],
      properties: {
        uiOptions: {
          type: "object",
          required: [],
          properties: {
            btnText: {
              title: "上传按钮文案",
              type: "string",
            },
          },
        },
      },
    },
  }),
};
// export default {

//   propsSchema: genSchema({
//     options: {
//       type: "object",
//       title: "选项",
//       storeName:'upload',
//       required: [],
//       properties: {
//         uiOptions: {
//           type: "object",
//           required: ["action"],
//           properties: {
//             action: {
//               title: "上传接口",
//               type: "string",
//               format: "uri",
//               default: "http://10.10.68.204:10010/u/drs/file/upload/dataFilling",
//             },
//             btnText: {
//               title: "上传按钮文案",
//               type: "string",
//             },
//           },
//         },
//       },
//     },
//   }),
// };
