<!-- basicSettings -->
<template>
    <div class="basic-settings">
        <div class="settings-path">
            <p class="text">移动端基础设置功能正在开发中，可前往钉钉桌面版-工作台-智能绩效-设置-基础设置处进行设置</p>
        </div>
        <div class="basic-content">
            <ul>
                <li class="item" v-show="!corpAuth">
                    <span class="title">评分人设置</span>
                    <span class="desc">{{reviewerRate}}</span>
                </li>
               <!--  <li class="item">
                    <span class="title">指标评分计算方式</span>
                    <span class="desc">{{calcTitles[basicSettings.scoreCalc-1] || '-'}}</span>
                </li> -->
                <li class="item">
                    <span class="title">计算规则</span>
                    <span class="desc">{{ruleTitles[basicSettings.scoreRule-1]}}</span>
                </li>
                <li class="item">
                    <span class="title">绩效等级</span>
                    <span class="desc">{{switchTitles[basicSettings.showGrade]}}</span>
                </li>
                <li class="item">
                    <span class="title">对接智能人事</span>
                    <span class="desc">{{switchTitles[basicSettings.syncHrm]}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            basicSettings: {
                flowType: [], //评分人
                flowWeight: [], //评分人权重
                scoreCalc: 1, // 计算方式 
                scoreRule: 1, // 计算规则
                showGrade: false, // 绩效等级
                syncHrm: false, // 智能人事
            },
            weightTitles: ["自评", "一级评分人", "二级评分人", "三级评分人", "四级评分人"],
            ruleTitles: ["合并计算", "分开计算"],
            calcTitles: ["加和计算", "加权计算"],
            switchTitles: {
                'true': '开', 
                'false': '关'
            }

        };
    },
    created () {
        this.getBaseSetDatas();
    },
    components: {},

    computed: {
        // 是否为高级版用户
        corpAuth () {
            return this.$store.state.userAuthData.corpAuth;
        },
        reviewerRate () {
            let reviewer = this.basicSettings.flowType,
                rate = this.basicSettings.flowWeight,
                result = [];

            for (let i=0; i < reviewer.length; i++) {
                let item = this.weightTitles[reviewer[i]] + rate[i] + '%';
                result.push(item);
            }
            return result.join();
        }
    },

    methods: {
        // 获取基础设置数据
        getBaseSetDatas() {
            let url = window.apiBasePath + "/app/perf/template/detail";
            this.$Ajax({ url }).then(res => {
                if (!res) return;
                let basicSettings = {
                    flowType: JSON.parse(res.data.flowType),
                    flowWeight: JSON.parse(res.data.flowWeight),
                    scoreCalc: res.data.scoreCalc,
                    scoreRule: res.data.scoreRule,
                    showGrade: res.data.showGrade,
                    syncHrm: res.data.syncHrm,
                };
                Object.assign(this.basicSettings, basicSettings)
                
            }).catch( (err) => {
                console.log(err, "/template/detail");
            });
        }
    }
}

</script>
<style lang="less" scoped>
.basic-settings{
    .settings-path {
        padding: 17px 15px 9px;
        .text {
            font-size: 13px;
            color: rgba(25,31,37,0.40);
            line-height: 19px;
        }
    }
    .basic-content {
        .item {
            height: 48px;
            width: 100%;
            background-color: #ffffff;
            padding-right: 16px;
            padding-left: 21px;
            .title {
                font-size: 17px;
                color: #191F25;
                line-height: 48px;
            }
            .desc {
                font-size: 15px;
                color: rgba(25,31,37,0.76);
                line-height: 48px;
                float: right;
                max-width: 180px;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap
            }
        }
        .item + .item {
            margin-top: 8px;
        }
    }
}
</style>