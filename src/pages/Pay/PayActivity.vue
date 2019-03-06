<!-- 选择套餐 -->
<template>
    <div class="pay">
        <img width="100%" class="header-bg" src="@/assets/activity-header.jpg">
        <div class="pay-content">
            <img width="100%" class="header-bg" src="@/assets/activity-point1.png">
            <img width="100%" class="header-bg" src="@/assets/activity-point2.png">
            <img width="100%" class="header-bg" src="@/assets/activity-point3.png">
            <img width="100%" class="header-bg" src="@/assets/activity-point4.png">
        </div>
        <div class="pay-btn" @click="goPayDetail">
            <img width="100%" class="header-bg" src="@/assets/activity-btn.png">
        </div>
    </div>
</template>

<script>
import * as dd from 'dingtalk-jsapi'
export default {
    data () {
        return {
        };
    },

    components: {},

    computed: {
        corpId () {
            return this.$store.state.userAuthData.corpId;
        }
    },

    methods: {
        goPayDetail () {
            console.log(this.corpId)
            let url = `https://h5.dingtalk.com/appcenter/detail.html?showmenu=false&dd_share=false&goodsCode=FW_GOODS-1000925215&corpId=`+this.corpId;
            console.log(url)
            let self = this;
            dd.biz.util.openLink({
                url: url, //要打开链接的地址
                onSuccess: function(result) {
                    console.log(result);
                },
                onFail: function() {
                    self.$Toast("打开支付界面系统异常", "error");
                }
            });
        }
    }
}

</script>
<style lang="less" scoped>
.pay {
    background-color: #fe7972;
    font-size: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    .pay-content {
        width: 90%;
        img + img {
            padding-top: 20px;
        }
    }
    .pay-btn {
        width: 90%;
        padding: 40px 0;
    }
}
</style>