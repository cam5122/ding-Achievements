<!-- 绩效报表 -->
<template>
    <div>
        <div v-if="ajaxFinish">
            <div class="report" v-if="isShowData">
                <div class="report-header">
                    <select-perf :queryId="queryId" @changeQueryId="changeQueryId"></select-perf>
                </div>
                <div class="report-main" ref="reportArea">
                    <num-circle :data="groupNumInfo"></num-circle>
                    <div class="margin-top-12">
                        <result-analysis :personalAnalysis="groupNumInfo.gradeReport" :rankData="rankData" :teamAnalaysis="deptData"></result-analysis>
                    </div>
                </div>
            </div>
            <div v-else>
                <no-data v-if="userAuthData.userAuth.includes(3) || userAuthData.userAuth.includes(4)" msg="暂无绩效报表，您可以发起绩效考核或导入历史绩效数据，系统将会自动生成绩效报表"></no-data>
                <no-data v-else msg="暂无绩效报表"></no-data>
            </div>
        </div>
    </div>
</template>

<script>
import selectPerf from '@/components/SelectPerf';
import numCircle from './NumCircle';
import resultAnalysis from './ResultAnalysis';
import noData from "@/components/NoData";
export default {
    name: "report",
    data () {
        return {
            ajaxFinish: false,
            queryId: '',
            groupNumInfo: {},
            rankData: [],
            rankParam: {
                deptId: 0,
                status: 0,
                queryId: this.queryId,
                pageNo: 1,
                pageSize: 10000
            },
            deptData: [],
            scrolling: false
        };
    },

    components: {
        selectPerf,
        numCircle,
        resultAnalysis,
        noData
    },

    created() {
        this.getGroupNumInfo().then(() => {
            Promise.all([this.getChartData(), this.getRankData()]).then(()=> {
                this.ajaxFinish = true;
            });
            this.getTeamData();
        });
    },

    computed: {
        allTeamData() {
            return this.$store.state.allTeamData;
        },
        isShowData() {
            if ( this.allTeamData &&
                this.allTeamData.groupListSummury &&
                this.allTeamData.groupListSummury.length
            ) {
                return true;
            } else {
                return false;
            }
        },
        userAuthData() {
            return this.$store.state.userAuthData;
        },
    },

    methods: {
        // 团队绩效
        getTeamData() {
            if ( this.allTeamData &&
                this.allTeamData.groupListSummury &&
                this.allTeamData.groupListSummury.length
            ) {
                return;
            }
            let url = `${window.apiBasePath}/app/perf/group/showList`;
            let param = {
                type: 0,
                pageNo: 1, // 虽然已经去掉翻页，后端还需要这个参数，前端暂时写死
                pageSize: 50 // 虽然已经去掉翻页，后端还需要这个参数，前端暂时写死
            };
            this.$Ajax({ url, type: "post", param }).then(res => {
                if (!res) return;
                this.$store.commit("saveAllTeamData", res.data);
            }).catch( (err) => {
                console.log(err, "group/showList");
            });
        },
        // 获取数据
        getGroupNumInfo() {
            let url =
                window.apiBasePath +
                "/app/perf/group/showGroupGradeReport?deptId=0&status=0&queryId=" +
                this.queryId;
            return this.$Ajax({
                url,
                type: "post"
            }).then(res => {
                if (!res) return;
                this.queryId = this.queryId || res.data.queryId || "";
                res.data.gradeReport = res.data.gradeReport || [];
                res.data.gradeReport.forEach(item => {
                    item.name = item.name || "无等级";
                    item.value = Number(item.value);
                });
                this.groupNumInfo = res.data;
            }).catch( (err) => {
                console.log(err, "showGroupGradeReport");
            });
        },
        // 结果分析
        // FIXME: 滚动翻页
        getRankData() {
            let url = window.apiBasePath + "/app/perf/group/showGroupGradeRank";
            let param = this.rankParam;
            param.queryId = this.queryId;
            return this.$Ajax({
                url,
                param,
                type: "post"
            }).then(res => {
                if (!res) return;
                if (res.data.records && res.data.records.length > 0) {
                    res.data.records.forEach((item, index) => {
                        item.sort = (param.pageNo - 1) * param.pageSize + index + 1;
                    });
                }
                this.rankData = res.data.records;
            }).catch( (err) => {
                console.log(err, "showGroupGradeRank");
            });
        },
        // 考核人数分析
        getChartData() {
            let url =
                window.apiBasePath + "/app/perf/group/showGroupDeptReport?queryId=" +
                this.queryId;
            return this.$Ajax({ url }).then(res => {
                if (!res) return;
                this.deptData = res.data.records.map(item => {
                    item.name = item.deptName;
                    item.value = item.count;
                    return item;
                });
                // console.log("his.deptData",this.deptData)
            }).catch( (err) => {
                console.log(err, "showGroupDeptReport");
            });
        },
        // 改变queryId之后重新请求
        changeQueryId(val) {
            if (this.queryId !== val) {
                this.queryId = val;
                this.getGroupNumInfo().then(() => {
                    Promise.all([this.getChartData(), this.getRankData()]).then(()=> {});
                });
            }
        },
        // TODO: 滑动加载
        scrollMore () {
            let dom = this.$refs.reportArea;
            console.log(dom.offsetHeight, dom.scrollTop, dom.scrollHeight)
            if (dom.offsetHeight + dom.scrollTop >= dom.scrollHeight - 5) {
                if (!this.scrolling) 
                console.log(111)
            }
            // this.rankParam.pageNo ++;
        }
    }
}

</script>
<style lang="less" scoped>
.report {
    .report-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
    }
    .report-main {
        position: absolute;
        top: 45px;
        bottom: 50px;
        width: 100%;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }
    .margin-top-12 {
        margin-top: 12px;
    }
}
</style>