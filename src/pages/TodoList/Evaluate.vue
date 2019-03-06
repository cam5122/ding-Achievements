<!--高级版评分  -->
<template>
<div v-if="createdFinsh">
    <div class="evaluate" v-if="!isShowConfirm && !isShowReject && !isShowComm" :class="{'padding-b-64': setEvaluate.lookType === 3 && !isShowInput, 'padding-b-44': setEvaluate.lookType === 3 && needBtn.length >= 3 && !isShowInput}" ref="evaluateWrappper">
        <div class="header">
            <div class="person" :class="{'line-bottom': getEvaluate.totalOrder.length > 0}">
                <div class="right">
                    <div class="inline">
                        <app-avatar :avatar="getEvaluate.userInfo.avatar" :name="getEvaluate.userInfo.name" :width="40"></app-avatar>
                    </div>                      
                    <div class="desc inline">
                        <span class="name">{{getEvaluate.userInfo.name}}</span>
                        <span class="dept">{{getEvaluate.userInfo.deptName}}</span>
                    </div>
                </div>
            <!--  <div class="status"></div> -->
            </div>
            <div class="score" v-if="getEvaluate.totalOrder.length > 0">
                <div class="desc" v-for="item in needTotalOrder" :key="item">
                    <span class="name">{{getEvaluate.totalItem[item].name}}</span>
                    <span class="num">{{getEvaluate.totalItem[item].value}}</span>
                </div>
            </div>
        </div>
        <div class="process" v-if="getEvaluate.advances.length > 0">
            <h2 class="title">绩效流程</h2>
            <div class="process-flex" ref="processMain">
                <div class="process-text" :class="{'active': item.type ===1}"  v-for="(item, index) in getEvaluate.advances" :key="item.name+index" ref="processItem">
                    <div class="text">{{index+1}} {{item.name}}{{item.userName ? '：' : '' }}{{item.userName}}</div>
                    <!-- <img src="@/assets/right-grey.png" v-if="item.type ===0" class="completed"> -->
                    <img src="@/assets/right-blue.png" v-if="item.type ===0" class="completed">
                </div>
            </div>
        </div>

        <!-- 各项评分 只评总分时 其他部门评分后台onlyTotal返回false-->
        <coll-panel v-for="(item,index) in getEvaluate.targetItems" :item="item" :key="'item'+index" ref="scoreItem">
            <div class="detail-item" v-for="t in getEvaluate.targetTitle" :key="t.key" v-if="item[t.key] && t.key!=='name'">
                <div class="detail-item-title" v-if="item.type===3 && t.key==='itemLimit'">加分上限：</div>
                <div class="detail-item-title" v-else-if="item.type===4 && t.key==='itemLimit'">扣分上限：</div>
                <div class="detail-item-title" v-else>{{t.value}}：</div>
                <div v-if="t.key === 'remark'" v-html="item[t.key]?item[t.key].replace(/\n/g,'<br>'):'-'"></div>
                <div v-else-if="t.key === 'itemBarrier' || t.key === 'itemChallenge' || t.key === 'itemTarget' || t.key === 'itemResult'">{{item[t.key] || ''}}{{item.unit}}</div>
                <div v-else>{{item[t.key] || ''}}</div>
            </div>
            <div class="score-detail margin-top-15 border-top" v-if="isShowInput && !getEvaluate.scoreStep.onlyTotal && setEvaluate.lookType===3">
                <div class="person-score">
                    <div class="do-score required">评分：<span v-if="getEvaluate.scoreStep.onlyTotal">-</span></div>
                    <div class="do-input" v-if="!getEvaluate.scoreStep.onlyTotal">
                        <input v-if="(item.type===1 && getEvaluate.scoreStep.qOptionType===1) || (item.type===2 && getEvaluate.scoreStep.bOptionType===1) || item.type === 3 || item.type === 4" class="input needsclick" placeholder="请输入数字" type="number" :disabled="item.quantizationValue" oninput="this.value=this.value.replace(/[^0-9.]+/,'');" v-model="item[getEvaluate.scoreStep.valueKey]" :class="{'emphasis': redBorderIndex === index}" @focus="redBorderIndex = ''">
                        <input v-else-if="item.type===2 && getEvaluate.scoreStep.bOptionType===3" class="input needsclick" placeholder="请输入" type="text" v-model="item[getEvaluate.scoreStep.valueKey]" :class="{'emphasis': redBorderIndex === index}" @focus="redBorderIndex = ''">
                        <div v-else-if="item.type===1 && getEvaluate.scoreStep.qOptionType===2">
                            <select-data :sourceData="qOptionList" v-model="item[getEvaluate.scoreStep.valueKey]" :defaultSelected="item[getEvaluate.scoreStep.valueKey]" ref="input" :isEmphais="redBorderIndex === index" @click.native="redBorderIndex = ''" :disabled="item.quantizationValue"></select-data>
                        </div>
                        <div v-else-if="item.type===2 && getEvaluate.scoreStep.bOptionType===2" >
                            <select-data :sourceData="bOptionList" v-model="item[getEvaluate.scoreStep.valueKey]" :defaultSelected="item[getEvaluate.scoreStep.valueKey]" ref="input"
                            :isEmphais="redBorderIndex === index" @click.native="redBorderIndex = ''"></select-data>
                        </div>
                    </div>
                </div>
                <div class="person-score">
                    <div class="do-score">评分说明：<span v-if="getEvaluate.scoreStep.onlyTotal">-</span></div>
                    <div class="do-input" v-if="!getEvaluate.scoreStep.onlyTotal">
                        <textarea class="needsclick do-textarea" placeholder="请输入" v-model="item[getEvaluate.scoreStep.descKey]" :class="{'emphasis': redBorderIndex === 'text' + index}" @focus="redBorderIndex = ''"></textarea>
                    </div>
                </div>
            </div>
        </coll-panel>
               
        <!-- 总分处理 stepType=3其他部门 不需要总分 -->
        <div v-if="isShowInput && getEvaluate.scoreStep.stepType !==3 && setEvaluate.lookType===3" class="factor-wrapper" v-for="(val, key) in totalScores" :key="key" :ref="key">
            <div class="factor">
                <h2 class="title" >{{val.name}}</h2>
                <div class="factor-content">
                    <h3 class="name">{{val.name}}</h3>
                </div>
            </div>
            <div class="score-detail padding-side-15">
                <div class="person-score">
                    <div class="do-score required">评分：</div>
                    <div class="do-input">
                        <input v-if="key === 'qtotal' && getEvaluate.scoreStep.qOptionType===1 || key === 'btotal' && getEvaluate.scoreStep.bOptionType===1" class="needsclick input" placeholder="请输入数字" type="number" oninput="this.value=this.value.replace(/[^0-9.]+/,'');" v-model="val.value" :class="{'emphasis': redBorderIndex === key}" @focus="redBorderIndex = ''">
                        <input v-else-if="getEvaluate.scoreStep.bOptionType===3" class="needsclick input" placeholder="请输入" type="text" v-model.trim="val.value" :class="{'emphasis': redBorderIndex === key}" @focus="redBorderIndex = ''">
                        <div v-else-if="key==='qtotal' && getEvaluate.scoreStep.qOptionType===2" >
                            <select-data :sourceData="qOptionList" v-model="val.value" :defaultSelected="val.value" :isEmphais="redBorderIndex === key" @click.native="redBorderIndex = ''"></select-data>
                        </div>
                        <div v-else-if="key==='btotal' && getEvaluate.scoreStep.bOptionType===2">
                            <select-data :sourceData="bOptionList" v-model.trim="val.value" :defaultSelected="val.value" :isEmphais="redBorderIndex === key" @click.native="redBorderIndex = ''"></select-data>
                        </div>
                        <input v-else-if="key === 'total'" class="needsclick input" placeholder="请输入数字" type='text' oninput="this.value=this.value.replace(/[^0-9.]+/,'');" v-model="val.value" :class="{'emphasis': redBorderIndex === key}" @focus="redBorderIndex = ''">
                    </div>
                </div>
                <div class="person-score">
                    <div class="do-score">评分说明：</div>
                    <div class="do-input">
                        <textarea class="do-textarea" placeholder="请输入" v-model.trim="val.desc" :class="{'emphasis': redBorderIndex === 'text' + key}" @focus="redBorderIndex = ''"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <!-- 记录 -->
        <div class="record" v-if="records.allRecords.length > 0">
            <h2 class="title">记录</h2>
            <div class="record-wrapper">
                <div class="record-subwrapper" v-for="(item, index) in records.currentRecords" :key="index">
                    <!-- <div class="line"></div> -->
                    <div class="record-content">
                        <div class="avatar">
                            <app-avatar :avatar="item.avatar" :name="item.name" :width="28"></app-avatar>
                        </div>
                        <div class="record-item padding-left-10">
                            <div class="first-line">
                                <div class="left">
                                    <div class="name">{{item.name}}</div>
                                    <div class="behavior padding-left-10">{{item.type}}</div>
                                </div>
                                <div class="right">{{item.date | formateDate}}</div>
                            </div>
                            <div class="desc" v-if="item.remark" v-html="item.remark.replace(/\n/g,'<br>')"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="more">
                <span v-if="records.allRecords.length > 3" class="fold" @click="showAll">{{isFold[records.foldStatus]}}</span>
            </div>
        </div>
        
        <footer-button :isFixed="false" v-if=" setEvaluate.lookType === 3 && isShowInput" iconContent="提交评分" @submitData="goConfirm"></footer-button>
    </div>
    <div class="confirm-submit" v-else-if="isShowReject">   
        <textarea class="textarea-full" placeholder="请输入驳回内容（必填）" v-model.trim="remark"></textarea>
        <footer-button2 cancel="取消" confirm="确定" @cancelData="cancelSubmit" @confirmData="confirmReject"></footer-button2>
    </div>
    <div class="confirm-submit" v-else-if="isShowComm">
        <textarea class="textarea-full" placeholder="请输入沟通内容（必填）" v-model.trim="remark"></textarea>
        <footer-button2 cancel="取消" confirm="确定" @cancelData="cancelSubmit" @confirmData="confirmComm"></footer-button2>
    </div>
    <div class="confirm-submit" v-else-if="isShowConfirm">
        <textarea class="textarea-full" placeholder="请输入评分说明" v-model.trim="remark"></textarea>
        <footer-button2 cancel="取消" confirm="确定" @cancelData="cancelSubmit" @confirmData="confirmSubmit"></footer-button2>
    </div>
    <!-- 底部按钮 六种情况（沟通 评分 目标确认 驳回） 三种不同的样式 -->
    <div id="footer-btn" v-if="!isShowComm && !isShowReject && !isShowConfirm && setEvaluate.lookType===3">
        
        <footer-btn v-if="!isShowInput" :btnInfo="needBtn" @submitData="submitData"></footer-btn>
    </div>
</div>
</template>

<script>
import * as dd from 'dingtalk-jsapi';
import appAvatar from '@/components/Avatar';
import footerButton from '@/components/FooterButton';
import footerButton2 from '@/components/FooterButton2';
import footerButton3 from '@/components/FooterButton3';
import footerBtn from '@/components/FooterBtn';
import selectData from '@/components/SelectData';
import collPanel from '@/pages/Detail/CollPanel';
// import { Group, Selector } from 'vux';
export default {
    data () {
        return {
            redBorderIndex: null,
            hasReject: false, // 是否可以驳回
            isShowReject: false, // 显示驳回页面
            isShowComm: false, // 显示沟通页面
            hasBFactor: false, // 是否含有行为指标，没有则分开计算行为总分不显示（行为不一定有）
            createdFinsh: false,
            isAssign: false, //是否制定评分人
            isShowConfirm: false, //二次确认界面
            isShowEvaluate: false, // 控制是否可以评分（有input）
            remark: '', // 总体评分说明 驳回说明 沟通说明
            setEvaluate: {
                lookType: 3, // 1绩效数据-展示 2 待办事项查看（评分后的数据） 3绩效数据-评分
                userId: '',
                searchProcessId: '',
            },
            newsId: '', //为了跳转到下一条作为唯一的标识符
            getEvaluate: {
                scoreStep: {}, // type 1量化 2行为
                advances: [],
                userInfo: {},
                processInfo: {}, // 此流程
                totalItem: {}, // 已完成流程
            },
            bOptionList: [],
            qOptionList: [],
            totalScores: {},
            isFold: {
                true: "全部记录",
                false: "收起"
            },
            records: {
                allRecords: [], 
                shortRecords: [], //缩略记录（只显示三条）
                currentRecords: [],
                foldStatus: true
            },
            processWidth: [], // 流程每项宽度
        };
    },
    created(){
        let needShow = this.$route.query.needShow;
        if (needShow) {
            switch (needShow) {
                case "score":
                    this.isShowEvaluate = true;
                    break;
                case "comm":
                    this.isShowComm = true;
                    break;
            }
        }
        this.initPageInfo();
    },
    beforeRouteUpdate(to, from, next) {
        next();
        this.initPageInfo();
    },
    components: {
        appAvatar,
        footerButton,
        footerButton2,
        footerButton3,
        footerBtn,
        collPanel,
        // Group,
        // Selector,
        selectData
    },
    filters: {
        formateDate(time){
            let nowyear = new Date().getFullYear(),
                year = new Date(time).getFullYear(),
                date;
            if (nowyear === year) {
                date = new Date(time).Format('MM.dd hh:mm');
            } else {
                date = new Date(time).Format('yyyy.MM.dd hh:mm');
            }
            return date;
        }
    },
    computed: {
        isShowInput () {
            if (this.isShowEvaluate) {
                return true;
            } else if (this.hasReject || this.getEvaluate.communication || this.getEvaluate.needConfirm || this.getEvaluate.scoreStep.transfer) {
                return false;
            }
            return true;
        },
        needTotalOrder () {
            return this.getEvaluate.totalOrder.filter((item) => {
                return item !=='other';
            })
        },
        needBtn () {
            let btnInfo = [];
            if (this.getEvaluate.needConfirm) {
                btnInfo.push({ name: "确认目标", id: "confirm"});
            } else {
                btnInfo.push({ name: "评分", id: "score"});
            }
            if (this.hasReject) {
                btnInfo.push({ name: "驳回", id: "reject", color: "danger"});
            }
            if (this.getEvaluate.scoreStep.transfer) {
                btnInfo.push({ name: "转交", id: "handOver"});
            }
            if (this.getEvaluate.communication) {
                btnInfo.push({ name: "沟通", id: "comm"});
            }
            return btnInfo;
        }
    },

    methods: {
        initPageInfo() {
            this.setEvaluate.userId = this.$route.query.userId;
            this.setEvaluate.searchProcessId = this.$route.query.processId;
            this.newsId = this.$route.query.newsId;
            let needShow = this.$route.query.needShow;
            this.getEvaluateData()
            .then(() => {
                // 设置标题
                this.$setTitle(this.getEvaluate.processInfo.title);
                if (this.getEvaluate.needConfirm) {
                    this.createdFinsh = true;
                    if (this.getEvaluate.advances.length > 0) {
                        this.$nextTick( () => {
                            this._calculateWidth();
                            this._locateScroll();
                        })
                    }
                }
                // 从工作通知进入 判断是否已经评过分（needConfirm为false scoreStep.valueKey是否为空） 评过分则转到查看
                else if (!this.getEvaluate.scoreStep || !this.getEvaluate.scoreStep.valueKey) {
                    console.log("looktype2");
                    this.setEvaluate.lookType = 2;
                    this.getEvaluateData().then((res) => {
                        this.createdFinsh = true;
                        if (this.getEvaluate.advances.length > 0) {
                            this.$nextTick( () => {
                                this._calculateWidth();
                                this._locateScroll();
                            })
                        }
                    }).catch((err) => {
                        console.log("error", err)
                        // this.$Toast(err);
                    })
                } else {
                    this.getReject();
                    this.totaltitle();
                    this.createdFinsh = true;
                    if (needShow !== "comm" && this.getEvaluate.advances.length > 0){
                        this.$nextTick( () => {
                            this._calculateWidth();
                            this._locateScroll();
                        })
                    }
                }
            })
            .catch((err) => {
                console.log("23232", err)
                // this.$Toast(err);
            });
            this.getRecord();
        // console.log('options', this.options);
         
        },
        // 获取流程绩效数据
        getEvaluateData() {
            let url = window.apiBasePath +"/app/perf/user/check/info",
                param = this.setEvaluate;
            return this.$Ajax({ url, param }).then(res => {
                if (!res) {
                    return;
                }
                if (res.data.targetItems) {
                   res.data.targetItems.forEach(item => {
                        // empty_score驳回前填的数据 quantizationValue自动计算（scoreMethod为2）的数据
                        if (item.scoreMethod === 2) {
                            item[res.data.scoreStep.valueKey] = item.quantizationValue;
                        } else {
                            item[res.data.scoreStep.valueKey] = (item.quantizationValue && 1 ) || item.empty_score || null;
                        }
                        item[res.data.scoreStep.descKey] = item.empty_illustration || '';
                        if (item.type === 2) { // 是否含有行为指标
                            this.hasBFactor = true;
                        }
                   });
                }
                if (res.data.scoreStep.bOptionList) {
                    this.bOptionList = [];
                    res.data.scoreStep.bOptionList.forEach(item => {
                        this.bOptionList.push({key: item, value: item});
                    });
                }
                if (res.data.scoreStep.qOptionList) {
                    this.qOptionList = [];
                    res.data.scoreStep.qOptionList.forEach(item => {
                        // console.log("item", item)
                        this.qOptionList.push({key: item, value: item});
                    });
                }
                // console.log(this.qOptionList, this.bOptionList)
                // res.data.needConfirm = true;
                // res.data.communication = true;
                // res.data.scoreStep.scoreRule = 2;
                // res.data.scoreStep.onlyTotal = true;
                this.getEvaluate = res.data;
                // console.log(this.getEvaluate);
            }).catch( (err) => {
                console.log(err, "user/check/info");
            });
        },
        // 是否有驳回
        getReject() {
            let url = window.apiBasePath + "/app/perf/step/hasReject",
                param = {
                    processId: this.setEvaluate.searchProcessId
                };
            this.$Ajax({
                url,
                param,
                hideLoad: true
            }).then(res => {
                if(!res) return;
                this.hasReject = res.data;
            }).catch( (err) => {
                console.log(err, "perf/step/hasReject");
            });
        },
        // 转到总体评分说明
        goConfirm () {
            if(this.checkData()) {
                this.isShowConfirm = true;
            };
        },
        // 提交分数
        confirmSubmit () {
            let url = window.apiBasePath + "/app/perf/step/post/info?newsId=" + this.newsId;
                let data = this.dealData();
            this.$Ajax({ type: "post", url, data }).then(res => {
                if (!res) return;
                this.isShowConfirm = false;
                this.createdFinsh = false;
                this.remark = "";
                this.$getTodoNext().then((res) => {
                    if (res.length === 0) {
                        this.setEvaluate.lookType = 2;
                        this.getEvaluateData() 
                        .then((res) => {
                            this.createdFinsh = true;
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                        this.getRecord();
                        this.$Toast("提交成功", true);
                    } else {
                        this.$Toast("提交成功，3S后将自动打开下一条待办", true, 3000);
                    }
                }).catch(err => {
                    console.log(err, "getTodoNext提交")
                });
            }).catch( (err) => {
                console.log(err, "step/post/info");
            });
        },
        // 沟通检查 提交沟通
        confirmComm () {
            let url = `${window.apiBasePath}/app/perf/group/sendCommunication`,
                data = {
                    remark: this.remark,
                    checkRsId: this.setEvaluate.searchProcessId
                };
            if (this.remark == "") {
                this.$Toast("沟通内容不能为空!");
                return;
            } else if (this.remark.length > 500) {
                this.$Toast("沟通内容超过500字限制!");
                return;
            }
            this.$Ajax({ url, data, type: "post" }).then(res => {
                if(!res) return;
                this.isShowComm = false; 
                this.$Toast('成功提交沟通', true);  
                this.remark = "";
                this.records.foldStatus = true;
                this.getRecord();
            }).catch( (err) => {
                console.log(err, "group/sendCommunication");
            });
        },
        // 取消（驳回 评分 沟通）
        cancelSubmit () {
            this.isShowConfirm = this.isShowComm = this.isShowEvaluate = this.isShowReject = false;
        },
        // 评分
        goEvaluate () {
            this.isShowEvaluate = true;
        },
        // 转到驳回
        goReject () {
            this.isShowReject = true;
        },
        // 沟通
        goComm () {
            this.isShowComm = true;
        },
        // 目标确认
        targetConfirm () {
            let url = `${window.apiBasePath}/app/perf/step/confirm/target`,
                param = {
                    checkRsId: this.setEvaluate.searchProcessId
                };
            this.$Ajax({
                url,
                param
            }).then(res => {
                if(!res) return;
                this.initPageInfo();
                this.$Toast('目标已确认', true);    
            }).catch( (err) => {
                console.log(err, "confirm/target");
            });
        },
        // 提交驳回
        confirmReject () {
            if (this.remark == "") {
                this.$Toast("驳回意见不能为空!");
                return;
            } else if (this.remark.length > 500) {
                this.$Toast("沟通内容超过500字限制!");
                return;
            }
            let url = window.apiBasePath + "/app/perf/step/reject",
                param = {
                    processId: this.setEvaluate.searchProcessId,
                    taskUserKey: this.getEvaluate.scoreStep.valueKey,
                    remark: this.remark,
                    newsId: this.newsId
                };
            this.$Ajax({
                url,
                param
            }).then(res => {
                if(!res) return;
                this.isShowReject = false;
                this.remark = "";
                this.createdFinsh = false;
                // this.$Toast('驳回成功', true, 2000);
                this.$getTodoNext().then((res) => {
                     console.log(res, "lebgth")
                    if (res.length === 0) {
                        this.setEvaluate.lookType = 2;
                        this.getEvaluateData().then(() => {
                            this.createdFinsh = true;
                            this.$Toast('驳回成功', true);
                        });
                        this.getRecord();
                    } else {
                        this.$Toast("驳回成功，3S后将自动打开下一条待办", true, 3000);
                    }
                });
            }).catch( (err) => {
                console.log(err, "step/reject");
            });
        },
        // 只评总分 合并计算 分开计算
        totaltitle() {
            // 只评总分
            if(this.getEvaluate.scoreStep.onlyTotal) {
                if(this.getEvaluate.scoreStep.scoreRule===1) { //合并计算
                    this.totalScores = {
                        total: {name: '总分', value: null, desc: ''},
                    }
                } else {
                    this.totalScores = {
                        qtotal: {name: '量化总分', value: null, desc: ''},
                        btotal: {name: '行为总分', value: null, desc: ''},
                    }
                }
            } else {
                if(this.hasBFactor && this.getEvaluate.scoreStep.scoreRule===2) { // 分开计算
                    this.totalScores = {
                        btotal: {name: '行为总分', value: null, desc: ''},
                    }
                }
            }
        },
        // 数据验证
        checkData() {
            // 非只评总分
            let targetItems = this.getEvaluate.targetItems,
                value = this.getEvaluate.scoreStep.valueKey,
                scoreItem = this.$refs.scoreItem,
                evaluateWrappper = this.$refs.evaluateWrappper,
                desc = this.getEvaluate.scoreStep.descKey;
            if (!this.getEvaluate.scoreStep.onlyTotal) {
                for (let i = 0; i < targetItems.length; i++) {
                    let itemLimit = targetItems[i].itemLimit,
                        type = targetItems[i].type; 
                // console.log(targetItems[i][desc]);
                    if (!targetItems[i][value]) {
                        // 滚到未填处, 记录未填内容下标
                        this.redBorderIndex = i;
                        evaluateWrappper.scrollTop = scoreItem[i].$el.offsetTop;
                        // console.log(scoreItem[i].$el)
                        this.$Toast('有评分未完成');
                        return false;
                    }                
                    if (itemLimit && Number(targetItems[i][value]) > Number(itemLimit)) {
                        this.redBorderIndex = i;
                        evaluateWrappper.scrollTop = scoreItem[i].$el.offsetTop;
                        // console.log(scoreItem[i].$el)
                        this.$Toast('该指标评分不可超过评分上限：'+itemLimit+"分");
                        return false;
                        console.log("value", targetItems[i][value]);
                    }
                    if (targetItems[i][desc] && targetItems[i][desc].length>200) {
                        // 滚到未填处
                        this.redBorderIndex = "text" + i;
                        evaluateWrappper.scrollTop = scoreItem[i].$el.offsetTop; 
                        this.$Toast('评分说明超过200字限制');
                        return false;
                    }
                }
            }
            // 只评总分 合并计算 分开计算
            if (this.getEvaluate.scoreStep.stepType !==3) {
                for (let key in this.totalScores){
                // console.log(this.totalScores[key].desc)
                    if (!this.totalScores[key].value) {
                        this.redBorderIndex = key;
                        evaluateWrappper.scrollTop = this.$refs[key][0].offsetTop;
                        // console.log(this.$refs[key][0].offsetTop)
                        this.$Toast('有评分未完成');
                        return false;
                    }
                    if (this.totalScores[key].desc && this.totalScores[key].desc.length>200) {
                        this.redBorderIndex = "text" + key;
                        evaluateWrappper.scrollTop = this.$refs[key][0].offsetTop;
                        this.$Toast('评分说明超过200字限制');
                        return false;
                    }
                    
                }
            }
            return true;
        },
        // 数据处理
        dealData () {
            let tmpData =  this.getEvaluate,
                totalScores = this.totalScores,
                targetItems = tmpData.targetItems,
                value = tmpData.scoreStep.valueKey,
                desc = tmpData.scoreStep.descKey;
            tmpData.totalItem = {
                [value]: {value: ''},
                [desc]: {value: ''}
            };
             // 只评总分
            if(tmpData.scoreStep.onlyTotal) {
                if(tmpData.scoreStep.scoreRule===1) { //合并计算
                    for (let i = 0; i < targetItems.length; i++) {
                        targetItems[i][value] = totalScores.total.value;
                        targetItems[desc] = totalScores.total.desc;
                    }
                } else { // 分开计算
                    for (let i = 0; i < targetItems.length; i++) {
                        if (targetItems[i].type ===2) { // 行为
                            targetItems[i][value] = totalScores.btotal.value;
                            targetItems[i][desc] = totalScores.btotal.desc;
                        } else { // 量化 加分 扣分
                            targetItems[i][value] = totalScores.qtotal.value;
                            targetItems[i][desc] = totalScores.qtotal.desc;
                        }
                    }
                }
            } else {  // 非只评总分
                if(this.hasBFactor && this.getEvaluate.scoreStep.stepType !==3 && tmpData.scoreStep.scoreRule===2) { // 分开计算 非指定评分人
                    tmpData.totalItem = {
                        [value]: {value: totalScores.btotal.value},
                        [desc]: {value: totalScores.btotal.desc}
                    };
                }
            }
            tmpData.remark = this.remark;
            // console.log(tmpData)
            return tmpData;
        },
        // 流程定位
        _locateScroll () {
            let block = this.$refs.processMain;
            for (var i = 0; i < this.getEvaluate.advances.length; i++) {
                let item = this.getEvaluate.advances[i];
                if (item.type === 1) {
                    block.scrollLeft = this.processWidth[i];
                    break;
                }
            }
            // console.log("processWidth", this.processWidth[2])
        },
        // 计算流程每项宽度
        _calculateWidth() {
            let processItem = this.$refs.processItem;
            let width = 0;
            this.processWidth.push(width);
                for (let i = 0; i < processItem.length; i++) {
                let item = processItem[i];
                width += item.clientWidth;
                this.processWidth.push(width);
            }
            // console.log("this.processWidth", this.processWidth);
        },
        // 记录
        getRecord () {
            let url = `${window.apiBasePath}/app/perf/group/showOperationRecords?checkRsId=${this.setEvaluate.searchProcessId}`;
            this.$Ajax({
                type: 'post',
                url
            }).then( res => {
                if(!res) return;
                this.records.allRecords = res.data;
                this.records.currentRecords = this.records.shortRecords = res.data.slice(0, 3);
            }).catch( (err) => {
                console.log(err, "showOperationRecords");
            });
        },
        // 记录展开 - 收起
        showAll () {
            if (this.records.foldStatus) {
                this.records.currentRecords = this.records.allRecords;
            } else {
               this.records.currentRecords = this.records.shortRecords; 
            }
            this.records.foldStatus = !this.records.foldStatus;
        },
        // 各种按钮提交
        submitData(id) {
            switch (id) {
                case "comm":
                    this.goComm();
                    break;
                case "reject":
                    this.goReject();
                    break;
                case "confirm":
                    this.targetConfirm();
                    break;
                case "score":
                    this.goEvaluate();
                    break;
                case "handOver":
                    this.selectPerson();
                    break;
            }
        },
        // 选择转交人
        selectPerson () {
            // console.log(window.corpId, window.appId);
            dd.biz.contact.complexPicker({
                title:"选择转交给",            //标题
                corpId: window.corpId,              //企业的corpId
                multiple:false,            //是否多选
                limitTips:"超出了",          //超过限定人数返回提示
                maxUsers:1000,            //最大可选人数
                pickedUsers:[],            //已选用户
                pickedDepartments:[],          //已选部门
                disabledUsers:[],            //不可选用户
                disabledDepartments:[],        //不可选部门
                requiredUsers:[],            //必选用户（不可取消选中状态）
                requiredDepartments:[],        //必选部门（不可取消选中状态）
                appId:window.appId,              //微应用的Id
                permissionType:"GLOBAL",          //选人权限，目前只有GLOBAL这个参数
                responseUserOnly:true,        //返回人，或者返回人和部门
                startWithDepartmentId:0 ,   // 0表示从企业最上层开始，IOS不支持该字段
                onSuccess: data => {
                    this.$Confirm({
                        text: "确认将" + this.getEvaluate.userInfo.name + "的"+ this.getEvaluate.processInfo.title +"评分转交给"+ data.users[0].name + "？",
                        title: "提示",
                        succ: () => {
                            this.submitHandOver(data.users[0].emplId);
                        }
                    });
                    // this.submitHandOver(data.users[0].emplId)
                },
                onFail: function(err) {}
            });
        },
        // 转交
        submitHandOver(id) {
            let url = window.apiBasePath + "/app/perf/step/score/transfer",
                param = {
                    transferUserId: id,
                    valueKey: this.getEvaluate.scoreStep.valueKey,
                    newsId: this.newsId
                };
            this.$Ajax({
                url,
                param
            }).then(res => {
                if(!res) return;
                this.$getTodoNext().then((res) => {
                    if (res.length === 0) {
                        this.$router.replace({path: "/todoList"});
                        this.$Toast("转交成功", true);
                    } else {
                        this.$Toast("转交成功，3S后将自动打开下一条待办", true, 3000);
                    }
                });
            }).catch( (err) => {
                console.log(err, "/score/transfer");
            });
        }
    }
}

</script>
<style lang="less" scoped>
@import "../../less/mixins.less";
.evaluate{
    overflow-x: hidden;
    padding-bottom: 10px;
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    -webkit-overflow-scrolling: touch;
    &.padding-b-64{
        // padding-bottom: 74px;
        bottom: 64px;
    }
    &.padding-b-44 {
        // padding-bottom: 54px;
        bottom: 44px;
    }
    .header {
        background: #ffffff;
        .person {
            margin: 0 20px 0 17px;
            height: 85px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &.line-bottom {
                .border-1px(rgba(25,31,37,0.12));
            }
            .right {
                display: flex;
                align-items: center;
                .inline {
                    display: inline-block;
                    font-size: 0;
                }
                .desc {
                    padding-left: 10px;
                    .name {
                        display: inline-block;
                        font-size: 15px;
                        color: #000000;
                        line-height: 21px;
                        max-width: 200px;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                        @media only screen and (max-width:320px) {
                            max-width: 180px;
                        }
                    }
                    .dept {
                        display: block;
                        font-size: 13px;
                        color: rgba(0,0,0,0.56);
                        line-height: 18px;
                        max-width: 200px;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                    }
                }
            }
            .status {
                float: right;
                font-size: 13px;
                color: rgba(25,31,37,0.76);
            }
        }
        .score {
            padding: 16px 18px 24px 17px;
            .title {
                font-size: 17px;
                color: #191F25;
            }
            .desc {
                & + .desc {
                    padding-top: 10px;
                }
                .name, .num {
                    display: inline-block;
                    vertical-align: top;
                }
                .name {
                    font-size: 15px;
                    color: rgba(25,31,37,0.56);
                    line-height: 20px;
                    width: 150px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .num {
                    font-size: 15px;
                    color: #191F25;
                }
            }
        }
    }
    .process {
        .title {
            padding-left: 17px;
            height: 42px;
            line-height: 52px;
            font-size: 13px;
            color: rgba(25,31,37,0.40);
            font-weight: normal;
        }
        .process-flex {
            display: flex;
            align-items: center;
            height: 75px;
            padding:0 17px;
            overflow-x: scroll;
            -webkit-overflow-scrolling:touch;
            background: #ffffff;
            .process-text {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                // height: 43.5px;
                width: 250px;
                font-size: 15px;
                color: rgba(25,31,37,0.76);
                padding: 6px;
                box-shadow: 0 2px 3px 0 rgba(0,0,0,0.12);
                border-radius: 2px;
                background: #f0f0f0;
                &:first-child {
                    &::after {
                        display: none;
                    }
                    .text {
                        padding-left: 5px;
                    }
                }
                &::before {
                    position: absolute;
                    content: "";
                    height: 0;
                    width: 0;
                    right: -33px;
                    border: 17px solid #f0f0f0;
                    border-color: transparent transparent transparent #f0f0f0 ;
                    z-index: 10;
                }
                &::after {
                    position: absolute;
                    content: "";
                    height: 0;
                    width: 0;
                    left: -1px;
                    border: 17px solid #ffffff;
                    border-color: transparent transparent transparent #ffffff;
                }
                & + .process-text {
                    margin-left: 5px;
                }
                &.active {
                    color: #3296FA;
                    background: #EAF4FE;
                    &::before {
                        position: absolute;
                        content: "";
                        height: 0;
                        width: 0;
                        right: -33px;
                        border: 17px solid #EAF4FE;
                        border-color: transparent transparent transparent #EAF4FE;
                        z-index: 10;
                    }
                }
                .text {
                    max-width: 180px;
                    padding-left: 17px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .completed {
                    position: relative;
                    padding-left: 5px;
                    height: 13px;
                    width: 11.5px;   
                }
            }
        }
    }
    .score-detail {
        &.border-top {
            border-top: 1px dashed rgba(25,31,37,0.20);
        }
        &.padding-side-15 {
            padding: 0 15px;
        }
        &.margin-top-15 {
            margin-top: 15px;
            border-top: 1px dashed rgba(25,31,37,0.20);
        }
    }
    
    .factor-wrapper{
        background: #ffffff;
        .factor {
            .title {
                padding-left: 17px;
                height: 42px;
                line-height: 52px;
                font-size: 13px;
                color: rgba(25,31,37,0.40);
                font-weight: normal;
                background: #F4F4F4;
            }
            .factor-content {
                padding-left: 15px;
                .name {
                    padding: 12px 54px 0 0;
                    white-space: wrap;
                    font-size: 17px;
                    color: #323334;
                    font-weight: normal;
                }
            }
        }
    }
    .record {
        .padding-left-10 {
            padding-left: 10px;
        }
        .title {
            padding-left: 17px;
            height: 42px;
            line-height: 52px;
            font-size: 13px;
            color: rgba(25,31,37,0.40);
            font-weight: normal;
        }
        .record-wrapper {
            padding-top: 17px;
            background: #ffffff;
        }
        .record-subwrapper {
            padding: 0 3px 0 17px;
            position: relative;
            &:last-child {
                .record-content {
                    .record-item {
                        border-left: none;
                        padding: 0 0 15px 20px;
                    }
                }
            }
            .record-content {
                display: flex;
                // align-items: center;
                .avatar {
                    position: relative;
                    width: 28px;
                    height: 28px;
                    z-index: 10;
                }
                .record-item {
                    flex: 1;
                    border-left: 1px dashed rgba(25, 31, 37, 0.2);
                    padding: 0 0 35px 20px;
                    position: relative;
                    left: -14px;
                    top: 5px;
                    .first-line {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .left {
                            display: flex;
                            align-items: center;
                            .name {
                                font-size: 13px;
                                color: rgba(25,31,37,0.76);
                                line-height: 17px;
                                max-width: 70px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            .behavior {
                                font-size: 13px;
                                color: #15BC83;
                                line-height: 17px;
                                @media only screen and (max-width:320px) {
                                    max-width: 80px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                            }
                        }
                        .right {
                            font-size: 11px;
                            color: rgba(25,31,37,0.56);
                            text-align: right;
                            line-height: 17px;
                        }
                    }
                    .desc {
                        padding-top: 6px;
                        font-size: 15px;
                        line-height: 17px;
                        color: #191F25;
                    }
                }
            }
        }
        .more {
            background: #ffffff;
            font-size: 13px;
            color: #3296FA;
            padding: 10px 7px 17px;
            .fold {
                padding: 10px;
            }
        }
    }
}
.confirm-submit {
    padding: 10px 12px;
    background: #ffffff;
    margin-top: 8px;
    .textarea-full {
        height: 140px;
        width: 100%;
        resize: none;
        border: none;
        border-radius: 4px;
        outline: none;
        line-height: 25px;
        // padding: 5px 15px;
        color: #323334;
        font-size: 15px;
        appearance: none;
        -webkit-tap-highlight-color: transparent;
    }
}
.person-score {
    background: #ffffff;
    // padding: 0 19px 0px 16px;
    &:last-child {
        padding-bottom: 40px;
    }
    .do-score {
        padding-top: 15px; 
        font-size: 15px;
        line-height: 20px;
        color: rgba(25,31,37,0.56);
        &.font-primary {
            font-size: 17px;
            color: #191F25;
        }
    }
    .required {
        position: relative;
        &::before {
            display: inline-block;
            content: "*";
            color: #F25643;
            position: absolute;
            left: -8px;
        }
    }
    .do-input {
        padding-top: 5px; 
        font-size: 0;
        .input {
            height: 48px;
            width: 100%;
            border: 1px solid rgba(25,31,37,0.4);
            border-radius: 2px;
            outline: none;
            padding-left: 10px;
            background: #ffffff;
            font-size: 15px;
            appearance: none;
            -webkit-tap-highlight-color:transparent;
            &.emphasis {
                border: 1px solid #F25643;
            }
            &:disabled {
                background: #F3F3F3;
            }
            &:focus {
                border: 1px solid #3296FA;
            }
        }
        .do-textarea{
            height: 140px;
            width: calc(~"100% - 20px");
            resize: none;
            border: 1px solid rgba(25,31,37,0.4);
            border-radius: 2px;
            outline: none;
            line-height: 25px;
            padding: 5px 10px;
            color: #323334;
            font-size: 15px;
            appearance: none;
            -webkit-tap-highlight-color:transparent;
            &.emphasis {
                border: 1px solid #F25643;
            }
             &:focus {
                border: 1px solid #3296FA;
            }
        }
    }
}
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: rgba(25,31,37,0.40);
}
 .detail-item {
    display: flex;
    margin-top: 10px;
    // align-items: center;
}
.detail-item-title {
    width: 70px;
    min-width: 70px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 5px;
    // white-space: nowrap;
}
.do-input /deep/.weui-cells {
    font-size: 0;
    height: 48px;
    &::before {
        display: none;
    }
    &:after {
        display: none;
    }
}
.do-input /deep/.weui-select {
    font-size: 15px;
    padding-left: 10px;
}
.do-input /deep/.weui-cell {
    border: 1px solid rgba(25,31,37,0.4);
    border-radius: 2px;
}
</style>
