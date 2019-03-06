<!--picker  -->
<template>
    <div>
        <div class="select" @click="selectData" :class="{'emphasis': isEmphais && !disabled, 'disabled': disabled}">
            <div class=" placeholder" v-if="!selectedData">{{placeholder}}</div>
            <div class="value" v-else>{{selectedData}}</div>
            <span class="icon"></span>
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
        isEmphais: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    created() {
        // this.selectedData = this.defaultSelected;
    },
    components: {},

    computed: {},

    methods: {
        selectData () {
            if (this.disabled) {
                return;
            }
            dd.biz.util.chosen({
                source: this.sourceData,
                selectedKey: this.defaultSelected, // 默认选中的key
                onSuccess: (result) => {
                    //onSuccess将在点击完成之后回调
                    this.selectedData = result.key;
                    this.$emit('input', result.key);
                    this.$emit('changeData', result.value);                 
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
.select {
    position: relative;
    background: #ffffff;
    height: 48px;
    padding: 0 10px;
    border: 1px solid rgba(25,31,37,0.4);
    border-radius: 2px;
    font-size: 15px;
    line-height: 48px;
    display: flex;
    justify-content: space-between;
    &.disabled {
        background: #F3F3F3;
    }
    &.emphasis {
        border: 1px solid #F25643;
    }
    &:active {
        background: #ECECEC;
    }
    .placeholder, .value {
        padding-right: 10px;
    }
    .placeholder {
        color: #999;
    }
}
.icon {
    display: inline-block;
    position: relative;
    &::after {
        content: " ";
        display: inline-block;
        height: 6px;
        width: 6px;
        border-width: 0 2px 2px 0;
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