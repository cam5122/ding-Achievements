<!--datePicker  -->
<!-- <date-picker title="考评类型" 
    placeholder="请选择"
    :defaultSelected=""
    @changeData="changeData"
    :isBottomLine="true"
    :isStart="true" // 为开始时间是 要传结束时间 反之亦然
    endTime=""
    ></date-picker> -->
<template>
    <div class="picker-wrapper">
        <div class="picker" :class="{'line': isBottomLine}" @click="selectData">
            <div class="title">{{title}}</div>
            <div class=" placeholder" v-if="!selectedData">{{placeholder}}<span class="icon"></span></div>
            <div class="value" v-else>{{selectedData | formateDate}}<span class="icon"></span></div>
        </div>
    </div>
</template>

<script>
import * as dd from 'dingtalk-jsapi'
export default {
    data () {
        return {
            selectedData: '',
            sendData: ''
        };
    },

    props: {
        title:{
            type: String,
            default: '请选择'
        },
        placeholder:{
            type: String,
            default: '请选择'
        },
        defaultSelected: {
            type: [String, Date],
            default: ''
        },
        isBottomLine: {
            type: Boolean,
            default: false
        },
        startTime: { //开始时间
            type: [String, Date],
            default: null
        },
        endTime: { // 结束时间
            type: [String, Date],
            default: null
        },
        isStart: {
            type: Boolean,
            default: false
        },
        isEnd: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this.selectedData = this.defaultSelected;
    },
    components: {},

    computed: {},

    methods: {
        selectData () {
            dd.biz.util.datepicker({
                format: 'yyyy-MM-dd',
                value: this.defaultSelected, //默认显示日期
                onSuccess: (result) => {
                    if (this.checkTime(result.value)) {
                        this.sendData = this.selectedData = result.value;
                    } else {
                        this.sendData = this.selectedData = "";
                    }
                    this.$emit('changeDate', this.sendData);
                },
                onFail: (err) => {}
            });
        },
        checkTime (val) {
            if (this.isStart) {
                if (this.endTime) {
                    let start = new Date (val),
                        end = new Date (this.endTime);
                    if (start < end) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }else if (this.isEnd) {
                if (this.startTime) {
                    let start = new Date (this.startTime),
                        end = new Date (val);
                    if (start < end) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return true;
        },
    },
    filters: {
        formateDate(time){
            let date = new Date(time).Format('yyyy-MM-dd');
            return date;
        }
    },
}

</script>
<style lang="less" scoped>
@import "../less/mixins.less";
.picker-wrapper {
    background: #ffffff;
    position: relative;
    &:active {
        background: #ECECEC;
    }
}
.picker {
    position: relative;
    padding-right: 15px;
    margin-left: 15px;
    font-size: 17px;
    line-height: 48px;
    height: 48px;
    display: flex;
    justify-content: space-between;
    &.line {
        .border-1px(rgba(25, 31, 37, 0.08));
    }
    .placeholder, .value {
        padding-right: 15px;
    }
    .placeholder {
        color: #999;
    }
    .value {
        font-size: 15px;
    }
}
.icon {
    display: inline-block;
    position: relative;
    top: -6px;
    right: -15px;
    &::after {
        content: " ";
        display: inline-block;
        height: 6px;
        width: 6px;
        border-width: 2px 2px 0 0;
        border-color: #c8c8cd;
        border-style: solid;
        -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        position: relative;
        top: -2px;
        position: absolute;
        top: 50%;
        margin-top: -4px;
        right: 2px;
    }
}
</style>