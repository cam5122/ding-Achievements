<!-- 搜索组件 
:tips placeholder信息
@search 搜索事件
@goback 取消
@hideContent 内容为空隐藏结果
-->
<template>
    <div class="input-wrapper">
        <div class="input-search">
            <input type="text" class="input" :placeholder="tips" v-model.trim="searchName"/>
            <i class="icon-search">
                <img class="icon-search" width="14" height="14" src="@/assets/SearchGlyph.png">
            </i>
            <i class="icon-close" v-show="isInputing" @click="clear">
                <img width="16" height="16" src="@/assets/close.png">
            </i>
        </div>
        <span class="text" @click="goback">取消</span>
    </div>
</template>

<script>
export default {
    data () {
        return {
            searchName: '',
            isInputing: false
        };
    },
    props: {
        tips: {
            type: String,
            defalut: ''
        }
    },
    watch: {
        searchName(newValue) {
            if (newValue) {
                this.isInputing = true;
                this.$emit('search', newValue);
            } else {
                this.isInputing = false;
                this.$emit('hideContent')
            }
        }
    },
    components: {},

    computed: {},

    methods: {
        goback(){
            this.searchName = '';
            this.$emit('goback');
        },
        clear () {
            this.searchName = '';
        }
    }
}

</script>
<style lang="less" scoped>
.input-wrapper {
    display:flex;
    align-items: center;
    background: #FFFFFF;
    height: 52px;
    margin-bottom: 8px;
    box-shadow: 0px 8px 14px rgba(0, 0, 0,0.05);
    .input-search {
        font-size: 0;
        padding: 0 5px 0 5vw;
        .input {
            background-color: rgba(25,31,37,0.08);
            border-radius: 4px;
            width: 80vw;
            height: 36px;
            font-size: 14px;
            color: #191F25;
            border: none;
            padding-left: 35px;
            padding-top: 1px;
            outline: none;
        }
        .icon-search {
            display: inline-block;
            position: absolute;
            left: 17px;
            top: 10px;
        }
        .icon-close {
            display: inline-block;
            padding: 5px;
            position: absolute;
            top: 12px;
            right: 18vw;
        }
    }
    .text {
        color: #3296FA;
        font-size: 17px;
        padding: 0 5px;
        line-height: 52px;
    }
}
input::-webkit-input-placeholder {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(25,31,37,0.40);
}
</style>