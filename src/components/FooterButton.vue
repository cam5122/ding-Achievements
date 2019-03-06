<!-- 底部按钮 -->
<template>
    <div class="footer-btn" :class="{'fixed': isFixed}">
        <div class="line"></div>
        <button name="addIndex" class="icon" type="button" @click="submitData">{{iconContent}}</button>
    </div>
</template>

<script>
export default {
    data () {
        return {
        };
    },
    props: {
        iconContent: {
            type: String,
            required: true
        },
        isFixed: {
            type: Boolean,
            default: true
        }
    },

    components: {},

    computed: {},

    methods: {
        submitData(){
            this.$emit("submitData");
        }
    }
}

</script>
<style lang="less" scoped>
.footer-btn {
    width: 100%;
    height: 64px;
    text-align: center;
    line-height: 64px;
    background: #FFFFFF;
    &.fixed {
        position: fixed;
        z-index: 100;
        transform: translate3d(0,0,0);
        bottom: 0;
        left: 0;
    }
    .icon {
        width: 90%;
        background: #3296FA;
        border: 1px solid rgba(25,31,37,0.12);
        border-radius: 3px;
        height: 48px;
        color: #FFFFFF;
        font-size: 17px;
        font-weight: 300;
    }
    .line {
        width: 100%;
        height: 1px;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        background: rgba(25, 31, 37, 0.12);
    }
}
</style>