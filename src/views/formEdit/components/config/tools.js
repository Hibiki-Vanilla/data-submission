/**
 * Created by Liu.Jun on 2019/9/29 18:58.
 */

// 基础组件
import componentPackInput from "../viewComponents/Input";
import componentPackColor from "../viewComponents/Color";
import componentPackInputNumber from "../viewComponents/InputNumber";
import componentPackSlider from "../viewComponents/Slider";
import componentPackRate from "../viewComponents/Rate";
import componentPackTag from "../viewComponents/Tag";

// 是否 Boolean
// import componentPackBooleanSwitch from "../viewComponents/SelectBoolean/elSwitch";
// import componentPackBooleanCheckbox from "../viewComponents/SelectBoolean/elCheckbox";
// import componentPackBooleanSelect from "../viewComponents/SelectBoolean/elSelect";
// import componentPackBooleanRadio from "../viewComponents/SelectBoolean/elRadio";

// 单多选
import componentPackRadio from "../viewComponents/SingleSelect/elRadio";
import componentPackRadioSelect from "../viewComponents/SingleSelect/elSelect";
import componentPackCountrySelect from "../viewComponents/SingleSelect/countrySelect";
import componentPackcountryProvinceSelect from "../viewComponents/SingleSelect/countryProvinceSelect";
import componentPackDiySelect from "../viewComponents/SingleSelect/diySelect";


import componentPackMultiSelect from "../viewComponents/MultiSelect/elSelect";
import componentPackMultiCheckbox from "../viewComponents/MultiSelect/elCheckbox";
// 联级筛选
import componentPackCascader from "../viewComponents/Cascader";
// 上传
import componentPackUpload from "../viewComponents/Upload";
import componentPackMultiUpload from "../viewComponents/MultiUpload";
import componentPackUploadImg from "../viewComponents/UploadImg";


// 时间 日期
import componentPackTime from "../viewComponents/Time";

// 日期
import componentPackDate from "../viewComponents/Date";
// import componentPackDateString from "../viewComponents/Date/string";

// 日期时间
import componentPackDateTime from "../viewComponents/DateTime";
// import componentPackDateTimeString from "../viewComponents/DateTime/string";

// 日期区间
import componentPackDateRange from "../viewComponents/DateRange";
// import componentPackDateRangeString from "../viewComponents/DateRange/string";

// 日期时间区间
import componentPackDateTimeRange from "../viewComponents/DateTimeRange";
// import componentPackDateTimeRangeString from "../viewComponents/DateTimeRange/string";

// 布局 Object Array
import componentPackObject from "../viewComponents/Object";
/**
 * hidden 隐藏，不显示在工具栏
 * maxNum Number 最大可配置数
 * topDisplay Bool 最顶部显示
 * bottomDisplay Bool 最底部显示
 * onlyCanConfig Bool 是否只能配置数据，不能删除 copy
 * @type {*[]}
 */
const tools = [
    {
        groupName: '布局组件',
        componentList: [{
            title: '标题描述',
            btnClass: 'w100',
            componentPack: componentPackObject
        }]
    },
    {
        groupName: "基础组件",
        componentList: [
            {
                title: "输入框",
                componentPack: componentPackInput
            },
            // {
            //     title: '数字(slider)', // 这里顺便必须在 componentPackInputNumber 前，导入匹配的时候优先匹配
            //     componentPack: componentPackSlider
            // },
            {
                title: "数字输入框",
                componentPack: componentPackInputNumber
            },
            {
                title:"评分",
                componentPack:componentPackRate
            },
            // {
            //     title:"颜色选择",
            //     componentPack:componentPackColor
            // },
            // {
            //     title:"标签",
            //     componentPack:componentPackTag
            // }
        ]
    },
    {
        groupName: "单选/多选",
        componentList: [
            {
                title: "下拉单选(旧)",
                componentPack: componentPackRadioSelect,
                disabled:true
            },
            {
                title:"下拉单选",
                componentPack: componentPackDiySelect
            },
            {
                title: "单选框",
                componentPack: componentPackRadio
            },
            {
                title: "多选框",
                componentPack: componentPackMultiCheckbox
            },
            {
                title: "下拉多选",
                componentPack: componentPackMultiSelect
            },

            {
                title: "国家",
                componentPack: componentPackCountrySelect
            },
            {
                title: "国家/州省",
                componentPack: componentPackcountryProvinceSelect
            }
            ,{
                title: "产品",
                componentPack:componentPackCascader
            }
        ]
    },
    {
        groupName: "文件上传",
        componentList: [
            {
                title: "单文件",
                componentPack: componentPackUpload
            },
            // {
            //     title: "多个文件",
            //     componentPack: componentPackMultiUpload
            // },
            {
                title: "多媒体",
                componentPack: componentPackUploadImg
            },
        ]
    },
    {
        groupName: "时间日期",
        componentList: [
            {
                title: "日期",
                componentPack: componentPackDate
            },
            {
                title: "日期时间",
                componentPack: componentPackDateTime
            },
            // {
            //     title: "Date范围(时间戳)",
            //     componentPack: componentPackDateRange
            // },
            // {
            //     title: "DateTime范围(时间戳)",
            //     componentPack: componentPackDateTimeRange
            // },
            // {
            //     title: "Time(字符串)",
            //     componentPack: componentPackTime
            // }
        ]
    }
];

export default tools;
