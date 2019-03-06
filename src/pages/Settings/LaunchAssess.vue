<!-- 发起考核 -->
<template>
    <div class="assessment">
        <div class="assessment-type" v-if="!isSelected">
            <div class="group">
                <picker title="考评类型" :sourceData="reviewType" :defaultSelected="currentType" @changeData="changeType"></picker>
            </div>
            <div class="group">
                <picker title="考评时间" :sourceData="chainTime" :defaultSelected="currentTime" :isBottomLine="true" @changeData="changeTime"></picker>
                <date-picker class="popup-picker" title="开始时间" :defaultSelected="assessData.startTime" :isStart="true" :endTime="assessData.endTime" :isBottomLine="true" @changeDate="changeStart"></date-picker>
                <date-picker title="结束时间" :defaultSelected="assessData.endTime" :isEnd="true" :startTime="assessData.startTime" @changeDate="changeEnd"></date-picker>
            </div>
            <group v-if="corpAuth" class="group">
                <x-switch title="沟通反馈" v-model="assessData.communication"></x-switch>
            </group>
            <div class="group">
                <picker title="评分信息是否公开" :sourceData="publishInfo" :defaultSelected="currentInfo" @changeData="changeInfo"></picker>
                <div class="tips">包括评分人的评分、意见等信息</div>
            </div>
            <div v-if="corpAuth" class="group">
                <picker title="评分结果是否公开" :sourceData="publishResult" :defaultSelected="currentResult" @changeData="changeResult"></picker>
                <div class="tips">设置考核结果何时对被考核人可见</div>
            </div>
            <div class="group" @click="isSelected = true" v-if="assessData.configGroups.length === 0">
                <group>
                    <cell title="被考核对象" value="请选择" is-link></cell>
                </group>
            </div>
            <div class="tags" @click="isSelected = true" v-if="assessData.configGroups.length > 0">
                <div class="tags-title">被考核对象</div>
                <div class="tags-row">
                    <div class="tags-list">
                        <span class="tag" v-for="(item, index) in assessData.configGroups" :key="index">{{item.name}}</span>
                    </div>
                    <div class="tags-icon"></div>
                </div>
            </div>
            <footer-button iconContent="发起考核" @submitData="submitAssessment"></footer-button>
        </div>
        <div class="reviewer" v-if="createdFinish && isSelected">
            <h2 class="title">选择参与考评组</h2>
            <div class="reviewer-content" v-if="reviewerList.length > 0">
                <div class="item-wrapper" v-for="item in reviewerList" :key="item.id" @click="selectReviewer(item)">
                <div class="reviewer-item">
                    <span class="square" :class="{'active': selectedReviewer.includes(item.id)}"></span>
                    <span class="name">{{item.name}}</span>
                </div>
                <div class="empty"></div>
                </div>
            </div>
            <no-data v-else :msg="'暂无考评组数据'"></no-data>
            <!-- <footer-button iconContent="确定" @submitData="isSelected = false"></footer-button> -->
            <footer-button2 confirm="确定" cancel="取消" @confirmData="isSelected = false" @cancelData="clearData"></footer-button2>
        </div>
    </div>
</template>

<script>
/*  月份 1-2018-M9
*   季度 2-2018-Q4
*   半年度 3-2018-H1
*   年度 4-2029-0
*   试用期 5-2018-P7 
*/
import { Cell, Group, XSwitch } from 'vux';
import footerButton from '@/components/FooterButton';
import footerButton2 from '@/components/FooterButton2';
import noData from '@/components/NoData';
import picker from '@/components/Picker';
import datePicker from '@/components/DatePicker';
export default {
    data () {
        return {
            createdFinish: false,
            currentType: "月度",
            reviewerList: [], // 考评组
            selectedReviewer: [], //选中考评组
            reviewType: [
                { id: 1, key: "月度", value: "monthTime" },
                { id: 2, key: "季度", value: "quarterTime" },
                { id: 3, key: "半年度", value: "halfYearTime" },
                { id: 4, key: "年度", value: "fullYearTime" },
                { id: 5, key: "试用期", value: "probationPeriod" }
            ],
            typeMap: {
                monthTime: 1,
                quarterTime: 2,
                halfYearTime: 3,
                fullYearTime: 4,
                probationPeriod: 5
            },
            chainTime: [], //联动时间
            currentTime: "",
            monthTime: [],
            quarterTime:[],
            halfYearTime: [],
            fullYearTime: [],
            probationPeriod: [],
            checkType: 1, //考评类型
            assessData: {
                queryId: "",
                startTime: "",
                endTime: "",
                communication: true,
                infoPublic: 1,
                resultPublic: 1,
                configGroups: [] //考评组
            },
            startTime: "",
            endTime: "",
            publishInfo: [
                { key: "对被考核人公开", value: 0 },
                { key: "对被考核人不公开", value: 1 }
            ],
            currentInfo: "对被考核人公开",
            publishResult: [
                { key: "考核结束后自动公开", value: 0 },
                { key: "管理员公示结果", value: 1 }
            ],
            currentResult: "考核结束后自动公开",
            isSelected: false,

        };
    },
    created(){
        this.createTimeData();
        this.getReviewers().then(()=>{
            this.createdFinish = true;
        });
    },
    components: {
        Cell,
        Group,
        XSwitch,
        footerButton,
        footerButton2,
        noData,
        picker,
        datePicker
    },

    computed: {
        corpAuth () {
            return this.$store.state.userAuthData.corpAuth;
        },
    },
    watch: {
        checkType(newValue){
            this.assessData.configGroups = [];
            this.selectedReviewer = [];
            this.assessData.queryId = this.currentTime = "";
            this.getReviewers().then( (res) => {
                console.log(res)
            });
        }
    },

    methods: {
        changeType (obj) {
            this.checkType = this.typeMap[obj.value];
            console.log("type", this.currentType)
            // this.chainTime = [];
            this.currentType = obj.key;
            this.chainTime = this[obj.value];
        },
        changeTime(obj){
            this.currentTime = obj.key;
            this.assessData.queryId = obj.value;
        },
        // 造数据(考评时间)
        createTimeData(){
            let nowDate = new Date(),
                year = nowDate.getFullYear(),
                month = nowDate.getMonth()+1;
            
            if (month <= 3) {
                this.halfYearTime.push({
                    key: (year-1)+'下半年', value: '3-'+(year-1)+'-H1'
                })

                this.quarterTime.push({
                    key: (year-1)+'-Q4',
                    value: '2-'+ (year-1) +'-Q4'
                })

                for (let i = 10 ; i <=12 ; i ++) {
                    this.monthTime.push({
                        key: (year-1) +'-'+('00'+i).substr(i.toString().length),
                        value: '1-'+ (year-1) +'-M'+i
                    })
                    this.probationPeriod.push({
                        key: (year-1) +'-'+('00'+i).substr(i.toString().length),
                        value: '5-'+ (year-1) +'-P'+i
                    })
                }
            }
            this.halfYearTime.push(
                { key: year+'上半年', value: '3-'+year+'-H1' },
                { key: year+'下半年', value: '3-'+year+'-H2' },
            );
            if(month >= 10) {
                // 半年度
                this.halfYearTime.push({
                    key: (year+1)+'上半年', value: '3-'+(year+1)+'-H1'
                })
                // 季度
                this.quarterTime.push({
                    key: (year+1)+'-Q1',
                    value: '2-'+ (year+1) +'-Q1'
                })

                for (let i = 1; i <=3; i ++) {
                    this.monthTime.push({
                        key: (year-1) +'-'+('00'+i).substr(i.toString().length),
                        value: '1-'+ (year-1) +'-M'+i
                    })

                    this.probationPeriod.push({
                        key: (year-1) +'-'+('00'+i).substr(i.toString().length),
                        value: '5-'+ (year-1) +'-P'+i
                    })
                }
            }
            for(var q=1;q<5;q++){
                this.quarterTime.push({
                    key: year+'-Q'+q,
                    value: '2-'+ year +'-Q'+q
                })
            }
            
            for(var m=1; m<13; m++){
                this.monthTime.push({
                    key: year +'-'+('00'+m).substr(m.toString().length),
                    value: '1-'+ year +'-M'+m
                })
                this.probationPeriod.push({
                    key: year +'-'+('00'+m).substr(m.toString().length),
                    value: '5-'+ year +'-P'+m
                })
            }
            // 年度
            for(var i=year-1; i<year+2; i++){
                this.fullYearTime.push({
                    key: i+'年',
                    value: '4-'+i+'-0'
                });
            }
            this.chainTime = this.monthTime;
            // console.log('year', this.fullYearTime);
        },
        // 获取考评组
        getReviewers() {
            let url = window.apiBasePath + "/app/perf/management/getConfigGroup";
            let param = {
                checkType: this.checkType
            };
            return this.$Ajax({ url, param }).then(res => {
                if (!res) return;
                this.reviewerList = res.data.groups;
                // console.log(this.reviewerList);
            }).catch( (err) => {
                console.log(err, "management/getConfigGroup");
            });
        },
        selectReviewer (item) {
            let index = this.selectedReviewer.indexOf(item.id);
            if (index > -1) {
                this.selectedReviewer.splice(index, 1);
                this.assessData.configGroups.splice(index, 1);
            } else {
                this.selectedReviewer.push(item.id);
                this.assessData.configGroups.push(item);
            }
            console.log("selectedReviewer", this.selectedReviewer);
            console.log("configGroups", this.assessData.configGroups);
        },
        checkData () {
            if(this.currentType.length===0){
                this.$Alert({
                    tit: '提示',
                    text: '考核类型不能为空'
                })
                return false;
            }
            if(this.currentTime.length===0){
                this.$Alert({
                    tit: '提示',
                    text: '考核时间不能为空'
                })
                return false;
            }
            if(this.assessData.configGroups.length===0){
                this.$Alert({
                    tit: '提示',
                    text: '考核组不能为空'
                })
                return false;
            }
            return true;

        },
        // 解析queryId
        getQueryTitle(id) {
            let type = id.slice(0, 1);
            let title = id.slice(2, 6) + "年";
            if (type == 1) {
                title += id.slice(6).replace("-M", "0").substr(-2) + "月";
            } else if (type == 2) {
                title += "第" + id.slice(-1) + "季度";
            } else if (type == 3) {
                title += id.slice(6).replace("-H1", "上半年").replace("-H2", "下半年");
            } else if (type == 5) {
                title +=id.slice(6).replace("-P", "0").substr(-2) + "月试用期";
            }
            console.log(title);
            return title+'绩效考核';
        },
        // 发起 
        submitAssessment(){
            if (this.checkData()) {
                let url = window.apiBasePath + "/app/perf/management/postConfigGroup?queryId="+this.assessData.queryId,
                    data = this.assessData;
                this.$Ajax({ type: "post", url, data }).then(res => {
                    if (!res) return;
                    this.$router.replace({
                        path: '/teamDetail',
                        query: {
                            queryId: this.assessData.queryId,
                            title: this.getQueryTitle(this.assessData.queryId),
                        }
                    })
                    this.$Toast('发起成功', true);
                }).catch( (err) => {
                    console.log(err, "management/postConfigGroup");
                });
            }
        },
        changeStart (date) {
            if (date) {
                this.assessData.startTime = date;
            } else {
                this.$Alert("开始时间不能晚于结束时间！");
                this.assessData.startTime = "";
            }
        },
        changeEnd (date) {
            if (date) {
                this.assessData.endTime = date;
            } else {
                this.$Alert("结束时间不能早于开始时间！");
                this.assessData.endTime = "";
            }
            console.log("end", date);
        },
        changeInfo (obj) {
            this.currentInfo = obj.key;
            this.assessData.infoPublic = obj.value;
        },
        changeResult (obj) {
            this.currentResult = obj.key;
            this.assessData.resultPublic = obj.value;
        },
        clearData () {
            this.isSelected = false;
            this.assessData.configGroups = [];
            this.selectedReviewer = [];
        }
    }
}

</script>
<style lang="less" scoped>
@import "../../less/mixins.less";
.assessment-type {
  margin-top: 8px;
  margin-bottom: 84px;
}
.group + .group {
  margin-top: 8px;
  position: relative;
}
.reviewer {
  .title {
    margin-left: 17px;
    font-size: 13px;
    color: rgba(25, 31, 37, 0.56);
    font-weight: normal;
    height: 42px;
    line-height: 42px;
  }
  .item-wrapper {
      &:last-child {
        .reviewer-item{
            .border-none();
        }
      }
  }
  .reviewer-content {
    background: #ffffff;
    .reviewer-item {
      display: flex;
      align-items: center;
      height: 48px;
      margin-left: 17px;
      .border-1px(rgba(25, 31, 37, 0.08));
     /*  &:active {
        background-color: #ECECEC;
      } */
      .square {
        display: inline-block;
        height: 17px;
        width: 17px;
        border: 1px solid #aaaaaa;
        border-radius: 2px;
        &.active {
          background: #2185ef url("../../assets/right.png") no-repeat center;
          background-size: 9px 8px;
          border-radius: 2px;
          border: 1px solid #2185ef;
        }
      }
      .name {
        display: inline-block;
        padding-left: 10px;
        font-size: 17px;
        color: #191f25;
      }
    }
  }
}
 .tags {
    margin-bottom: 1px;
    padding: 8px 11px 14px 17px;
    background-color: #fff;
    margin-top: 8px;
    .tags-title {
        font-size: 15px;
        color: #191F25;
    }

    .tags-row {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .tags-list {
            margin-top: 6px;

            .tag {
                display: inline-block;
                background: rgba(0, 135, 253, 0.1);
                border-radius: 4px;
                padding: 0 6px;
                font-size: 12px;
                height: 21px;
                line-height: 21px;
                color: #0087fd;
                margin-bottom: 6px;

                & + .tag {
                    margin-left: 6px;
                }
            }
        }

        .tags-icon {
            padding-right: 13px;
            position: relative;

            &::after {
                content: " ";
                display: inline-block;
                height: 6px;
                width: 6px;
                border-width: 2px 2px 0 0;
                border-color: #c8c8cd;
                border-style: solid;
                -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                position: relative;
                top: -2px;
                position: absolute;
                top: 50%;
                margin-top: -4px;
                right: 2px;
            }
        }
    }
}
.tips {
    line-height: 17px;
    padding: 7px 17px;
    font-size: 13px;
    color: rgba(25, 31, 37, 0.56);
}
.item-wrapper:active {
    background-color: #ECECEC;
}
.assessment-type /deep/.weui-cells {
  &::before {
    display: none;
  }
  &:after {
    display: none;
  }
}
.assessment-type /deep/ .weui-label {
  font-family: PingFangSC-Regular;
  font-size: 17px;
  color: #191f25;
}
.assessment-type /deep/ .vux-cell-primary {
  font-family: PingFangSC-Regular;
  font-size: 17px;
  // color: rgba(25, 31, 37, 0.56);
}
.assessment-type /deep/ .vux-cell-value {
    color: #191f25;
    font-size: 17px;
}
</style>