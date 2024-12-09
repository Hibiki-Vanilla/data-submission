/**
 * Created by Liu.Jun on 2020/10/30 17:11.
 */

import genSchema from '../genSchema.js';

const viewSchema = {
    title: '标题与描述',
    type: 'object',
    storeName:'title'
    // required: [],
    // properties: {},
    // 'ui:order': []
};

export default {
    viewSchema,
    propsSchema: genSchema({}, 'object')
};
