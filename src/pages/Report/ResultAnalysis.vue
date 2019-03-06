<!-- 直方图统计 -->
<template>
    <div>
        <tab default-color="rgba(25,31,37,0.56)" bar-active-color="#3296FA" active-color="#191F25">
            <tab-item v-for="(tab, index) in tabTitleIndex" :key="'tab'+index" :selected="tab.key === currentTab" @on-item-click="onTabClick(tab)">{{tab.value}}</tab-item>
        </tab>
        <!-- 直方图 -->
        <div id="chartAnalysis" class="chart-wrapper"></div>

        <div class="chart-content" v-if="currentTab === 'teamAnalaysis'">
            <div class="title">参与考核部门人数</div>
            <ul class="desc">
                <li class="desc-item" v-for="(dept, index) in teamAnalaysis" :key="'dept'+index">
                    <span class="rank">{{index + 1}}</span>
                    <div class="desc-detail">
                        <div class="dept">{{dept.deptName}}</div>
                        <div class="num">{{dept.count}}人</div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="chart-content" v-else-if="currentTab === 'personalAnalysis'">
            <div class="title">绩效排名</div>
            <ul class="desc">
                <li class="desc-item" v-for="(item, index) in rankData" :key="'rank'+index">
                    <span class="rank">{{item.sort}}</span>
                    <div class="desc-detail">
                        <app-avatar :avatar="item.avatar" :name="item.userName" :width="35"></app-avatar>
                        <div class="info-wrapper">
                            <div class="name">{{item.userName}}</div>
                            <div class="dept">{{item.deptName}}</div>
                        </div>
                        <div class="num">
                            {{item.score || '-'}} /
                            <span class="good" v-if="item.grade">{{item.grade}}</span>
                            <span class="comm" v-else>无等级</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { Tab, TabItem } from 'vux';
import appAvatar from '@/components/Avatar';
// 引入 ECharts 主模块
const echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
    data () {
        return {
            tabTitleIndex: [
                {key: 'teamAnalaysis', value: '考核人数分析'},
                {key: 'personalAnalysis', value: '结果分析'},
            ],
            currentTab: 'teamAnalaysis',
        };
    },

    mounted() {
        this.createBarChart(this.teamAnalaysis);
    },

    watch: {
        currentTab(newValue) {
            this.createBarChart(this[newValue]);
        },
        personalAnalysis(newValue) {
            this.createBarChart(this[this.currentTab]);
        },
        teamAnalaysis(newValue) {
            this.createBarChart(this[this.currentTab]);
        }

    }, 

    props: {
        personalAnalysis: { // 结果分析（图）
            type: Array,
            required: true
        },
        rankData: { // 个人排序
            type: Array,
            required: true
        },
        teamAnalaysis: {
            type: Array,
            required: true
        }
    },

    components: {
        Tab,
        TabItem,
        appAvatar
    },

    methods: {
        onTabClick (item) {
            if (item.key !== this.currentTab) {
                this.currentTab = item.key;
                // this.createBarChart(this[item.key]);
            }
        },
        createBarChart(arr) {
            let xData = [];
            let yData = [];
            if(arr.length == 0) return;
            arr.forEach(item => {
                xData.push(item.name);
                yData.push(item.value);
            });
            let myChart = echarts.init(document.getElementById("chartAnalysis"));
            let option = {
                color: ["#3BA1FF"],
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: "{b}: {c}人"
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    top: "10%",
                    bottom: "15%",
                    containLabel: true
                },
                xAxis: [
                    {
                        type: "category",
                        data: xData,
                        lineStyle: { type: "dashed" },
                        axisLabel: {
                            // inside: true,
                            // textStyle: {
                            //   color: '#fff'
                            // },
                            // interval: 0, // 标题间隔设置为0
                            // rotate: 15  // 标题旋转
                        },
                        axisTick: {
                            // 刻度
                            show: false,
                            alignWithLabel: true
                        },
                        axisLine: {
                            // 坐标轴
                            // show: false
                            lineStyle: {
                                color: "#ababaf"
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        minInterval: 1,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            lineStyle: {
                                type: "dashed",
                                color: "#e8e8e8"
                            }
                        },
                        axisLabel: {
                            formatter: "{value}"
                        }
                    }
                ],
                series: [
                    {
                        type: "bar",
                        name: "图表",
                        barMaxWidth: "30", // 最大宽度
                        data: yData
                    }
                ]
            };
            myChart.setOption(option);
            window.onresize = function() {
                myChart.resize();
            };
        },
    }
}

</script>
<style lang="less" scoped>
.chart-content {
    position: relative;
    background: #ffffff;
    padding-left: 14px;
    .title {
        font-size: 15px;
        color: #191F25;
        line-height: 23px;
    }
    .desc {
        padding: 13px 0;
        .desc-item {
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(25,31,37,0.08);
            padding: 13px 16px 13px 0;
            &:last-child {
                border-bottom: none;
            }
            .rank {
                font-size: 12px;
                color: #191F25;
                width: 20px;
            }
            .desc-detail {
                flex: 1;
                display: flex;
                // justify-content: space-between;
                font-size: 15px;
                color: #000000;
                line-height: 21px;
                align-items: center;
                .info-wrapper {
                    margin-left: 10px;
                    .dept {
                        font-size: 13px;
                        color: rgba(0,0,0,0.56);
                    }
                }
                .num {
                    flex: 1;
                    align-self: center;
                    text-align: right;
                    font-size: 12px;
                    color: #191F25;
                    .good {
                        color: orange;
                    }
                    .comm {
                        color: rgba(25,31,37, 0.76);
                    }
                }
            }
        }
    }
}
.chart-wrapper {
    width: 100%;
    height: 280px;
    padding-top: 10px;
    background: #ffffff;
}
</style>