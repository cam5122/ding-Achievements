<!--picker  -->
<!-- <picker title="考评类型" 
    placeholder="请选择"
    :sourceData="reviewType"
    :defaultSelected="reviewType[0].key"
    @changeData="changeData"
    ></picker> -->
<template>
    <div class="picker-wrapper">
        <div class="picker" :class="{'line': isBottomLine}" @click="selectData">
            <div class="title">{{title}}</div>
            <div class=" placeholder" v-if="!selectedData">{{placeholder}}<span class="icon"></span></div>
            <div class="value" v-else>{{selectedData}}<span class="icon"></span></div>
        </div>
    </div>
</template>

<script>
import * as dd from 'dingtalk-jsapi'
export default {
    data () {
        return {
            selectedData: ''
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
        sourceData: {
            type: Array,
            required: true
        },
        defaultSelected: {
            type: String,
            default: ''
        },
        isBottomLine: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this.selectedData = this.defaultSelected;
    },
    watch: {
        defaultSelected(newValue) {
            if (!newValue) {
                this.selectedData = "";
            }
        }
    },
    components: {},

    computed: {},

    methods: {
        selectData () {
            dd.biz.util.chosen({
                source: this.sourceData,
                selectedKey: this.defaultSelected, // 默认选中的key
                onSuccess: (result) => {
                    //onSuccess将在点击完成之后回调
                    this.selectedData = result.key;
                    this.$emit('changeData', result);                 
                },
                onFail: (err) => {
                    this.$Alert(err);
                }
            });
        },
    }
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