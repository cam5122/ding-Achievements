<!-- 底部按钮 -->
<template>
    <div class="footer-btn" v-if="btnInfo.length > 0" :class="{'thin': btnInfo.length >= 3}">
        <div v-for="item in btnInfo" :key="item.id" class="icon" :class="{'danger': item.color === 'danger' &&  btnInfo.length === 2}" @click="submitData(item.id)">{{item.name}}</div>
    </div>
</template>

<script>
export default {
    data () {
        return {
        };
    },
    props: {
        btnInfo: {
            type: Array,
            required: true
        }
    },

    components: {},

    computed: {},

    methods: {
        submitData(id){
            this.$emit("submitData", id);
        }
    }
}

</script>
<style lang="less" scoped>
.footer-btn {
    position: fixed;
    z-index: 100;
    transform: translate3d(0,0,0);
    bottom: 0;
    left: 0;
    width: 100%;
    height: 64px;
    text-align: center;
    background: #FFFFFF;
    display: flex;
    padding: 8px 16px;
    border-top: 1px solid rgba(25, 31, 37, 0.12);
    &.thin {
        height: 44px;
        align-items: center;
        padding: 0;
        .icon {
            font-size: 16px;
            background: #FFFFFF;
            color: #3296FA;
            border: none;
            letter-spacing: -0.39px;
            text-align: center;
            flex: 1;
            & + .icon {
                border-left: 1px solid rgba(25,31,37,0.12);
                margin-left: 0;
            }
        }
    }
    .icon {
        background: #3296FA;
        border: 1px solid rgba(25,31,37,0.12);
        border-radius: 3px;
        color: #FFFFFF;
        font-size: 17px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        &.danger {
            background: rgba(242, 86, 67, 0.16);
            color: #F25643;
        }
        & + .icon {
            margin-left: 15px;
        } 
    }
}
</style>