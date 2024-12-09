export default {
    startTime: {
        'ui:options': {
            placeholder: '选择开始时间',
            style: {
                width: '100%'
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            }
        }
    },
}
