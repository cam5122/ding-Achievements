<!-- 底部按钮两个 -->
<!-- :first="'删除'"
    :second="'编辑'"
    :third="沟通"
    @onFirstClick="deleteFactor"
    @onSecondClick="goEdit"
    @onThirdClick=""
-->
<template>
    <div class="footer-btn">
        <div class="btn-item" @click="firstClick">{{first}}</div>
        <div class="btn-item" @click="secondClick">{{second}}</div>
        <div class="btn-item" @click="thirdClick">{{third}}</div>
    </div>
</template>

<script>
export default {
    data () {
        return {
        };
    },
    props: {
        first: {
            type: String,
            default: '取消'
        },
        second: {
            type: String,
            default: '确定'
        },
        third: {
            type: String,
            default: '确定'
        },
    },

    components: {},

    computed: {},

    methods: {
        firstClick () {
            this.$emit('onFirstClick');
        },
        secondClick () {
            this.$emit('onSecondClick');
        },
        thirdClick () {
            this.$emit('onThirdClick');
        },
        
    }
}

</script>
<style lang="less" scoped>
.footer-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    transform: translate3d(0,0,0);
    width: 100%;
    height: 44px;
    z-index: 10;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    box-shadow: inset 0 1px 0 0 rgba(25,31,37,0.12);
    .btn-item {
        font-size: 16px;
        color: #3296FA;
        letter-spacing: -0.39px;
        text-align: center;
        flex: 1;
        & + .btn-item {
            border-left: 1px solid rgba(25,31,37,0.12);
        }
    }
}
</style>