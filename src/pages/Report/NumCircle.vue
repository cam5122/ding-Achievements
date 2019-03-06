<!-- 人数统计 -->
<template>
    <div>
        <div class="num-circle">
            <div class="circle-wrapper">
                <div class="circle">
                    <x-circle
                    :percent="circlePercent"
                    :stroke-width="5"
                    stroke-color="#3296FA"
                    :trail-width="3">
                        <div class="desc">
                            <div class="name">完成人数 / 参与人数</div>
                            <div class="num">{{data.perfFinishCount}} / {{data.totalCount}}</div>
                            <!-- <div class="more">完成人数明细 &gt;</div> -->
                        </div>
                    </x-circle>
                </div>
            </div>
            <div class="detail-wrapper">
                <ul class="detail-main">
                    <li class="detail-item" v-for="(val, key, index) in targetTitle" :key="'item'+index">
                        <div class="num">{{data[key]}}</div>
                        <div class="title">{{val}}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { XCircle } from 'vux'
export default {
    data () {
        return { };
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    components: {
        XCircle
    },

    computed: {
        circlePercent() {
            if (this.data.perfFinishCount === 0) {
                return 0;
            } else {
                return this.data.perfFinishCount/this.data.totalCount  * 100;
            }
        },
        userAuthData() {
            return this.$store.state.userAuthData;
        },
        targetTitle() {
            let title;
            if (this.userAuthData.corpAuth) {
                title = {
                    targetMakeNum: '目标制定',
                    targetApproveNum: '目标确认',
                    selfValuationNum: '执行中',
                    resultEntryCount: '结果值录入',
                    scorerPerfCount: '评分'
                };
            } else {
                title = {
                    targetMakeNum: '目标制定',
                    targetApproveNum: '目标确认',
                    selfValuationNum: '执行中',
                    scorerPerfCount: '评分'
                }
            }
            return title;
        }
    },

    methods: {}
}

</script>
<style lang="less" scoped>
.num-circle {
    position: relative;
    background: #ffffff;
    .circle-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 38px 0 21px;
        .circle {
            width: 46%;
            .desc {
                .name {
                    font-size: 12px;
                    color: rgba(25,31,37,0.76);
                }
                .num {
                    font-family: DINCondensed-Bold;
                    font-size: 48px;
                    color: #3296FA;
                }
                .more {
                    font-size: 12px;
                    color: #3296FA;
                }
            }
        }
    }
    .detail-wrapper {
        padding-bottom: 15px;
        width: 100%;
        .detail-main {
            display: flex;
            .detail-item {
                position: relative;
                flex: 1;
                text-align: center;
               /*  &:after {
                    content: '';
                    position: absolute;
                    left: auto;
                    top: auto;
                    bottom: 20px;
                    right: 0;
                    height: 32%;
                    width: 1px;
                    background-color: rgba(25,31,37,0.12);
                }
                &:last-child::after {
                    display: none;
                } */
                .title {
                    font-size: 12px;
                    color: rgba(25,31,37,0.56);
                }
                .num {
                    font-family: DINCondensed-Bold;
                    font-size: 25px;
                    color: #191F25;
                }
            }
        }
    }
}
</style>