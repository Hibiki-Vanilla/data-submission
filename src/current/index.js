export const listStatus = [
  {
    value: 0,
    label: "未发布",
    type: "info",
  },
  {
    value: 1,
    label: "收集中",
    type: "",
  },
  {
    value: 2,
    label: "已停止",
    type: "danger",
  },
];

export const fillInList = [
  {
    value: 0,
    label: "所有内部账号",
  },
  {
    value: 1,
    label: "指定内部账号",
  },
  {
    value: 2,
    label: "所有外部账号",
  },
  {
    value: 3,
    label: "指定外部账号",
  },
  {
    value: 4,
    label: "所有获取链接的账号",
  },
];



export const submitTimesList = [
  {
    value: 0,
    label: "不限制",
  },
  {
    value: 1,
    label: "仅可提交1次",
  },
  {
    value: 2,
    label: "每天可提交1次",
  },

];

export function isObjectEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
        return true; // Field is empty
      }
    }
  }
  return false; // No empty fields found
}