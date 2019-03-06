<!-- 底部按钮两个 -->
<!-- :cancel="'删除'"
    :confirm="'编辑'"
    @cancelData="deleteFactor"
    @confirmData="goEdit"
-->
<template>
    <div class="footer-btn" :class="{'fixed': isFixed}" id="footer-btn">
        <button name="cancel" class="grey" :class="{'danger': isDanger}" type="button" @click="cancelData">{{cancel}}</button>
        <button name="sure" class="blue" type="button" @click="confirmData">{{confirm}}</button>
    </div>
</template>

<script>
export default {
    data () {
        return {
        };
    },
    props: {
        cancel: {
            type: String,
            default: '取消'
        },
        confirm: {
            type: String,
            default: '确定'
        },
        isDanger: {
            type: Boolean,
            default: false
        },
        isFixed: {
            type: Boolean,
            default: true
        }
    },

    components: {},

    computed: {},

    methods: {
        cancelData () {
            this.$emit('cancelData');
        },
        confirmData () {
            this.$emit('confirmData');
        }
    }
}

</script>
<style lang="less" scoped>
.footer-btn {
    width: 100%;
    height: 64px;
    z-index: 10;
    background: #FFFFFF;
    box-shadow: inset 0 1px 0 0 rgba(25,31,37,0.12);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4%;
    &.fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        // transform: translate3d(0,0,0);
    }
    .grey {
        width: 48%;
        height: 44px;
        background: #F6F6F6;
        border: 1px solid rgba(25,31,37,0.16);
        border-radius: 3px;
        font-size: 17px;
        color: #191F25;
        &.danger {
            background: rgba(242, 86, 67, 0.16);
            color: #F25643;
        }
    }
    .blue {
        width: 48%;
        height: 44px;
        background: #3296FA;
        border: 1px solid rgba(25,31,37,0.12);
        border-radius: 3px;
        font-size: 17px;
        color: #FFFFFF;
    }
}
</style>