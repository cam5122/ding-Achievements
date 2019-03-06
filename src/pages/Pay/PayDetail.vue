<template>
    <div class="pay-detail">
        <div>
            <div class="app-select">
                <div class="app-header">
                    <div class="name">你好，{{packageData.corpName}}</div>
                    <div class="txt">通讯录人数：{{packageData.userCount}}人</div>
                </div>
                <div class="pay-content">
                    <div class="tit">规格</div>
                    <div class="tits">已根据企业人数自动选择套餐</div>
                    <ul class="list">
                        <li v-for="(item,index) in packageData.priceList" :key="index" @click="select(item,index)" :style="{backgroundColor:selectIndex==index?'#4d97f3':'#ededee',color:selectIndex==index?'#ffffff':'#78797b'}">{{item.aliasName}}</li>
                    </ul>
                </div>
                <div class="pay-content">
                    <div class="tit">周期</div>
                    <ul class="list">
                        <li v-for="(item,index) in years" :key="index" @click="yearsSelect(item)" :style="{backgroundColor:yearsItem.num-1==index?'#4d97f3':'#ededee',color:yearsItem.num-1==index?'#ffffff':'#78797b'}">{{item.label}}</li>
                    </ul>
                </div>
                <div class="tips">
                    <div class="tits">发票：购买完成后，可获取发票</div>
                    <div class="tits">备注说明：</div>
                    <div class="tits">1.企业人数按钉钉通讯录人数为准；</div>
                    <div class="tits">2.产品按年付费，从购买之日起计算日期；</div>
                    <div class="tits last">3.产品每周一次小迭代，每月一次大迭代；</div>
                </div>
            </div>
        
            <div class="app-btns">
                <div class="desc">
                    <div class="contact">￥{{getTotalPrice}}</div>
                    <div class="desc-detail">
                        <div class="detail-title">已选：<span>{{selectPackage.aliasName}}</span></div>
                        <div class="detail-title">到期时间：<span>{{getExpireDate}}</span></div>
                    </div>
                </div>
                <div class="pay" @click="goPay">支付</div>
            </div>
        </div>

        <div class="pay-mask" v-if="showPayWeb">
            <div class="pay-box">
                <div class="pay-title">
                    <strong></strong>
                    <x-icon type="ios-close-empty" size="30" @click="showPayWeb=false">></x-icon>
                </div>
                <div class="web">
                    <flexbox>
                        <flexbox-item>
                            <x-button type="primary" @click.native="paySuccess">支付完成</x-button>
                        </flexbox-item>
                        <flexbox-item>
                            <x-button type="default" class="title" @click.native="payAgain">重新支付</x-button>
                        </flexbox-item>
                        </flexbox>
                </div>
            </div>
        </div>

        <div class="pay-mask" v-if="showPaySuc">
            <div class="pay-suc">
                <div class="title">支付成功</div>
                <div class="text">欢迎开通高级版，您现在可以与客服联系，获取专属服务，高级版将不再使用钉钉审批绩效考评流程（含绩效考评套件的流程），将启用绩效应用“评分步骤”功能，请前往考评组设置评分步骤。</div>
                
                <x-button type="primary" @click.native="reflashWeb">知道了</x-button>
              
            </div>
        </div>
    </div>
</template>

<script>
import * as dd from 'dingtalk-jsapi'
import { XButton, Flexbox, FlexboxItem } from 'vux'
export default {
    props: {},
    data() {
        return {
            oid: "", //支付返回oid
            showPayInfo: false,
            showPayWeb: false,
            showPaySuc: false,
            packageData: {},
            years: [
                {
                    label: "一年",
                    num: 1
                },
                {
                    label: "两年",
                    num: 2
                }
            ],
            selectIndex: 0,
            yearsItem: {
                label: "一年",
                num: 1
            },
            selectPackage: {
                aliasName: "",
                price: 0,
                expireDate: "",
                id: "1",
                giveMonth: 0
            }
        };
    },
    components: {
        XButton,
        Flexbox,
        FlexboxItem
    },
    created() {
        this.getPriceList();
    },
    computed: {
        //获取总价格
        getTotalPrice() {
            return  this.yearsItem.num * this.selectPackage.price;
        },
        //获取到期年限
        getExpireDate() {
            const nowDate = new Date();
            nowDate.setFullYear(nowDate.getFullYear() + this.yearsItem.num);
            nowDate.setMonth(
                nowDate.getMonth() +
                    this.selectPackage.giveMonth * this.yearsItem.num
            );
            return nowDate.Format("yyyy/MM/dd");
        },
    },
    methods: {
        //轮循请求数据
        async cycData() {
            return new Promise((resolve, reject) => {
                let url =
                    window.apiBasePath +
                    "/app/perf/pay/getOrderStatus?oid=" +
                    this.oid;
                let setTime = 0;
                let timer = setInterval(() => {
                    if (!this.showPayWeb) {
                        resolve(0);
                        clearInterval(timer);
                    }
                    this.$Ajax({
                        url,
                        hideLoad: true
                    }).then(res => {
                        //status 0 等待 1成功
                        setTime++;
                        if (setTime >= 40) {
                            clearInterval(timer);
                            resolve(0);
                            return;
                        }
                        if (res.data == 0) return;
                        clearInterval(timer);
                        resolve(1);
                    });
                }, 1500);
            });
        },
        paySuccess() {
            let url =
                window.apiBasePath +
                "/app/perf/pay/getOrderStatus?oid=" +
                this.oid;
            this.$Ajax({
                url
            }).then(res => {
                if (!res) return;
                if (res.data == 1) {
                    this.$Toast("支付成功！", true);
                    this.showPaySuc = true;
                } else {
                    this.showPayWeb = false;
                    this.$Toast("支付未成功！", false);
                }
            });
        },
        reflashWeb() {
            this.$router.replace({
                path: "/"
            });
            location.reload();
        },
        payAgain() {
            this.showPayWeb = false;
            this.goPay();
        },
        //点击购买打开iframe
        goPay() {
            let url =
                window.apiBasePath +
                "/app/perf/pay/createOrder?pid=" +
                this.selectPackage.id +
                "&year=" +
                this.yearsItem.num;
            this.$Ajax({
                url
            }).then(res => {
                if (!res) return;
                const self = this;
                this.oid = res.data.oid;
                dd.biz.util.openLink({
                    url: res.data.url, //要打开链接的地址
                    onSuccess: function(result) {
                        self.showPayWeb = true;
                    },
                    onFail: function() {
                        self.$Toast("打开支付界面系统异常", "error");
                    }
                });
            });
        },
        // 选择年限
        yearsSelect(item) {
            this.yearsItem = item;
        },
        //选择套餐
        select(item, index) {
            this.selectIndex = index;
            this.selectPackage.aliasName = item.aliasName;
            this.selectPackage.price = item.price;
            this.selectPackage.id = item.id;
            this.selectPackage.giveMonth = item.giveMonth;
        },
        getPriceList() {
            let url = window.apiBasePath + "/app/perf/pay/priceList";
            this.$Ajax({
                url
            }).then(res => {
                if (!res) return;
                this.packageData = res.data;
                res.data.priceList.forEach((item, index) => {
                    if (index == 0) {
                        this.selectPackage.aliasName = item.aliasName;
                        this.selectPackage.price = item.price;
                        this.selectPackage.totalPrice = item.price;
                        this.selectPackage.giveMonth = item.giveMonth;
                        this.selectPackage.id = item.id;
                    }
                    return;
                });
            });
        }
    }
};
</script>
<style scoped lang="less">
.pay-detail{
    position: relative;
    .app-select {
        position: relative;
        .app-header {
            background: #fff;
            padding: 17px 20px;
            margin-bottom: 8px;
            .name {
                line-height: 21px;
                font-weight: bold;
                color: #191f25;
                font-size: 17px;
            }
            .txt {
                padding-top: 5px;
                font-size: 14px;
                color: rgba(25, 31, 37, 0.76);
                line-height: 20px;
            }
        }
        .pay-content {
            background: #fff;
            padding: 17px 20px;
            margin-bottom: 8px;
            .tit {
                font: bold 16px/22px "";
                color: #191f25;
                margin-bottom: 5px;
            }
            .tits {
                color: rgba(25,31,37,0.76);
                font: normal 14px/22px "";
            }
            .last {
                margin-bottom: 68px;
            }
            .list {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                flex-wrap: wrap;
                margin-top: 20px;
                li {
                    width: 28%;
                    height: 40px;
                    border-radius: 8px;
                    color: #78797b;
                    text-align: center;
                    line-height: 40px;
                    font-size: 14px;
                    background-color: #ededee;
                    margin: 0 8% 20px 0;
                    @media only screen and (max-width:320px) {
                        font-size: 11px;
                    }
                }
                li:nth-child(3n){
                    margin: 0 0 20px;;
                }
            }
        }
        .tips {
            padding: 17px 20px 68px;
            margin-bottom: 8px;
            .tit {
                font: bold 13px/22px "";
                color: #191f25;
                margin-bottom: 5px;
            }
            .tits {
                color: rgba(25,31,37,0.76);
                font: normal 13px/22px "";
            }
        }
    }
    .app-btns {
        position: fixed;
        right: 0;
        bottom: 0;
        width: 100%;
        display: flex;
        height: 60px;
        background: #fff;
        justify-content: space-around;
        align-items: center;
        .desc {
            .contact {
                font-size: 17px;
                color: #F25643;
            }
            .desc-detail {
                font-size: 13px;
                color: rgba(25,31,37,0.76);
                .detail-title{
                    display: inline-block;
                    font-size: 13px;
                    & + .detail-title {
                        padding-left: 5px;
                        @media only screen and (max-width:320px) {
                            padding-left: 0;
                        }
                    }
                    @media only screen and (max-width:320px) {
                        display: block;
                        padding-left: 0;
                    }
                }
            }
        }
        .pay {
            width: 90px;
            height: 44px;
            background: #3296FA;
            border: 1px solid rgba(25,31,37,0.12);
            border-radius: 3px;
            font-size: 17px;
            color: #FFFFFF;
            text-align: center;
            line-height: 44px;
        }
    }
}
.pay-mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 500;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    .pay-suc {
        width: 85%;
        background-color: #fff;
        border-radius: 5px;
        padding: 15px;
        .title {
            font-size: 18px;
            line-height: 1;
            color: #303133;
            text-align: center;
        }
        .text {
            color: #999999;
            font-size: 14px;
            margin: 15px 0;
        }
        .btn {
            margin-top: 22px;
            text-align: right;
            width: 100%;
        }
    }
    .pay-box {
        width: 85%;
        background-color: #fff;
        border-radius: 5px;
        .pay-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            // border-bottom: 1px solid #dcdfe6;
            padding: 6px;
            font-size: 20px;
            strong {
                margin-left: 10px;
            }
            i {
                cursor: pointer;
                padding: 10px;
            }
        }
        .web {
            width: 85%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            padding-bottom: 20px;
        }
    }
}
</style>
