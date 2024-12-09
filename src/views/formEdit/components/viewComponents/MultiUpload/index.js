/**
 * Created by Liu.Jun on 2020/11/27 11:03 下午.
 */

import genSchema from '../genSchema.js';
let c_token = localStorage.getItem("dst") || "";
import { decryptByDES } from "@/utils/aes";
const viewSchema = {
    title: '多文件',
    type: 'array',
    storeName:'upload',
    items: {
        type: 'string'
    },
    'ui:widget': 'UploadWidget',
    "ui:headers":{
        Authorization: `Bearer ${decryptByDES(c_token, "dst")}`,
    }
};
export default {
    viewSchema,
    propsSchema: genSchema({
        options: {
            type: 'object',
            title: '选项',
            storeName:'upload',
            required: [],
            properties: {
                uiOptions: {
                    type: 'object',
                    required: ['action'],
                    properties: {
                        action: {
                            title: '上传接口',
                            type: 'string',
                            format: 'uri',
                            default: "http://10.10.68.204:10010/u/drs/file/upload/dataFilling",
                        },
                        btnText: {
                            title: '上传按钮文案',
                            type: 'string'
                        }
                    }
                }
            }
        }
    })
};
