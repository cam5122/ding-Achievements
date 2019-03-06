<!-- 新增指标 -->
<template>
    <div class="target">
        <div class="target-wrapper" v-if="!isSelect">
            <div class="target-content">
                <group class="target-select">
                    <popup-picker :title="'指标类型'" :data="factorType" v-model="currentType" :show-name="true" @on-change="changeType" :disabled="isEdit ? true : false"
                        :placeholder="'请选择'">
                    </popup-picker>
                </group>
                <input-text v-model.trim="addOptions.name" title="* 指标名称" class="input"></input-text>
                <div v-if="addOptions.type===1 || addOptions.type === 2">
                    <input-text v-if="currentType[0]==='1' || currentType[0]==='2'" v-model.trim="addOptions.scoreWeight" title="权重（%）" inputPlace="请输入数字" class="input"></input-text>
                </div>
                <div class="margin-bottom">
                    <input-text v-model="addOptions.remark" :title="standardTitle[currentType[0]-1]" :inputPlace="'请输入'+standardTitle[currentType[0]-1]" class="input"></input-text>
                </div>
                <div v-if="addOptions.type===1">
                    <div v-if="userAuthData.corpAuth">
                        <input-text v-model.trim="addOptions.unit" title="量化指标单位" inputPlace="请输入量化指标单位  " class="input"></input-text>
                        <input-text v-model.trim="addOptions.itemBarrier" title="门槛值" inputPlace="请输入门槛值  " class="input"></input-text>
                        <input-text v-model.trim="addOptions.itemTarget" title="目标值" inputPlace="请输入目标值  " class="input"></input-text>
                        <input-text v-model.trim="addOptions.itemChallenge" title="挑战值" inputPlace="请输入挑战值  " class="input"></input-text>
                    </div>
                    <div v-else>
                        <input-text v-model.trim="addOptions.itemTarget" title="目标值" inputPlace="请输入目标值  " class="input"></input-text>
                    </div>
                </div>
                <div v-if="userAuthData.corpAuth && addOptions.type===1" class="margin-top" :class="{'margin-updown': addOptions.scoreMethod !== 1}">
                    <div class="factor-item">
                        <span class="title">评分方式</span>
                        <span class="desc">{{ scoreMethodTitle[addOptions.scoreMethod - 1] }}</span>
                    </div>
                    <div class="tips" v-if="addOptions.scoreMethod !== 2">若要设置评分公式计算，请前往pc端</div>
                </div>
                <!-- <group class="target-select" v-if="userAuthData.corpAuth && addOptions.type===1">
                    <x-switch title="结果值" v-model="addOptions.needResult" :disabled="addOptions.scoreMethod === 2"></x-switch>
                </group> -->
                <!-- 结果值开关&& addOptions.needResult -->
                <group v-if="userAuthData.corpAuth && addOptions.type===1" class="target-select">
                    <popup-picker title="结果值来源" :data="resultResource" v-model="currentResult" :show-name="true" @on-change="changeResult"
                        :placeholder="'请选择'">
                    </popup-picker>
                </group>
                <div @click="selectPer('result')" v-if="userAuthData.corpAuth && addOptions.resultType === 3">
                    <group class="target-select">
                        <cell title="指定成员" :value="addOptions.resultUser==='' ? '请选择': addOptions.resultUserName" is-link></cell>
                    </group>
                </div>
                <div v-if="addOptions.type===3 || addOptions.type === 4">
                    <input-text v-model="addOptions.itemLimit" :title="additionalScore[currentType[0]-3]" :inputPlace="'请输入'+ additionalScore[currentType[0]-3]" class="input"></input-text>
                </div>
                <group class="target-select margin-top">
                    <x-switch title="必选" v-model="addOptions.requiredFlag"></x-switch>
                </group>
                <div class="tips" v-if="addOptions.requiredFlag">选中时，此指标将作为不可修改的默认指标项，员工必须参与考评</div>
                <div @click="isSelect = true" v-if="addOptions.targetTags && addOptions.targetTags.length === 0">
                    <group class="target-select">
                        <cell title="标签" value="请选择" is-link></cell>
                    </group>
                </div>
                <div class="tags" @click="isSelect = true" v-if="addOptions.targetTags &&addOptions.targetTags.length !== 0">
                    <div class="tags-title">标签</div>
                    <div class="tags-row">
                        <div class="tags-list">
                            <span class="tag" v-for="(item, index) in addOptions.targetTags" :key="index">{{item.name}}</span>
                        </div>
                        <div class="tags-icon"></div>
                    </div>
                </div>
                <group class="target-select" v-if="userAuthData.corpAuth && !addOptions.requiredFlag && addOptions.type!=2">
                    <x-switch title="指定评分人" v-model="setPerson"></x-switch>
                </group>
                <div @click="selectPer('check')" v-if="setPerson && !addOptions.requiredFlag && addOptions.type!=2">
                    <group class="target-select">
                        <cell title="选择评分人" :value="addOptions.checkUserName === '' ? '请选择':addOptions.checkUserName"
                            is-link></cell>
                    </group>
                    <div class="tips">开启后，该指标如被制定目标引用，该指标将由指定的人进行</div>
                </div>
            </div>
            <footer-button2 class="footer-btn" cancel="取消" confirm="确认" @cancelData="cancelData" @confirmData="postData"></footer-button2>
        </div>

        <!-- 选择指标组件 -->
        <select-tags :mutiSelect="false" @filterTags="filterTags" :isSelectType="false" v-if="isSelect" :type="addOptions.type"
            :datas="addOptions.targetTags" :isAll="false"></select-tags>
    </div>
</template>

<script>
import * as dd from 'dingtalk-jsapi'
import selectTags from "@/components/SelectTags";
import InputText from "@/components/InputText";
import footerButton2 from "@/components/FooterButton2";
import { PopupPicker, Group, XSwitch, Cell, XButton } from "vux";
export default {
    data() {
        return {
            isEdit: false,
            isSelect: false,
            setPerson: false,
            addOptions: {
                //新增 修改时传递原对象
                checkUser: "", // 制定评分人
                checkUserName: "",
                itemTarget: "", // 目标值
                name: "", //名称
                newFlag: true, //是否新增
                remark: "", //考核标准
                requiredFlag: false, //必选
                scoreWeight: "", //权重
                tagIds: [], //指标ids
                targetTags: [], //指标数据 name id
                type: 1, // 1量化2行为
                itemBarrier: '', // 门槛值
                itemChallenge: '', //挑战值
                resultUser: '', // 指定值来源成员id
                resultUserName: '',
                scoreMethod: 1, //评分方式 1 直接评分 2 公式
                unit: '', //单位              
                // needResult: false // 是否需要结果值
            },
            currentType: ["1"],
            standardTitle: ["考核标准", "考核标准",  "加分标准", "扣分标准"],
            additionalScore: ["加分上限", "扣分上限"],
            resultTypeTitle: ["员工自己", "部门主管", "指定成员"],
            scoreMethodTitle: ['直接评分', '公式计算'],
            currentResult: [],
            factorType: [],
            factorTypeOfOrdinary: [ // 普通版
                [
                    {
                        name: "量化指标",
                        value: "1"
                    },
                    {
                        name: "行为价值观指标",
                        value: "2"
                    }
                ]
            ],
            factorTypeOfAdvanced: [ //高级版
                [
                    {
                        name: "量化指标",
                        value: "1"
                    },
                    {
                        name: "行为价值观指标",
                        value: "2"
                    },
                    {
                        name: "加分项",
                        value: "3"
                    },
                    {
                        name: "扣分项",
                        value: "4"
                    }
                ]
            ],
            resultResource: [
                [
                    {
                        name: "员工自己",
                        value: "1"
                    },
                    /* {
                        name: "部门主管",
                        value: "2"
                    }, */
                    {
                        name: "指定成员",
                        value: "3"
                    }
                ]
            ]
        };
    },
    created() {
        if (this.factorDetail) {
            this.addOptions = Object.assign(
                {},
                this.addOptions,
                this.factorDetail
            );
            delete this.addOptions["newFlag"];
            if (this.addOptions.type === 2) {
                this.currentType = ['2'];
                delete this.addOptions["itemTarget"];
            } else if (this.addOptions.type === 3) {
                this.currentType = ['3'];
            } else if (this.addOptions.type === 4) {
                this.currentType = ['4'];
            }
            this.isEdit = true;
            this.addOptions.targetTags.forEach(item => {
                this.addOptions.tagIds.push(item.tagId);
            });
            if (this.addOptions.checkUser) {
                this.setPerson = true;
            }
            if (this.addOptions.resultType === 1) {
                this.currentResult = ['1'];
            } else if (this.addOptions.resultType === 3) {
                this.currentResult = ['3'];
            }
        }
        if (this.userAuthData.corpAuth) {
            this.factorType = this.factorTypeOfAdvanced;
        } else {
            this.factorType = this.factorTypeOfOrdinary;
        }
    },
    components: {
        InputText,
        PopupPicker,
        Group,
        XSwitch,
        selectTags,
        Cell,
        XButton,
        footerButton2
    },

    computed: {
        userAuthData() {
            return this.$store.state.userAuthData;
        },
        factorDetail() {
            return this.$store.state.factorDetail;
        }
    },

    methods: {
        checkData() {
            // console.log(this.addOptions);
            // 校验指标名称不能为空
            if (this.addOptions.name === "") {
                this.$Toast("指标名称不能为空");
                return false;
            }

            // 校验权重位数字且不大于100
            if (
                this.addOptions.scoreWeight &&
                this.addOptions.scoreWeight != ""
            ) {
                if (
                    this.addOptions.scoreWeight &&
                    isNaN(this.addOptions.scoreWeight)
                ) {
                    this.$Toast("权重必须为数字格式");
                    return false;
                }
                if (this.addOptions.scoreWeight > 100) {
                    this.$Toast("权重不能大于100%");
                    return false;
                }
                let scoreWeight = parseFloat(
                    parseFloat(this.addOptions.scoreWeight).toFixed(2)
                );
                if (scoreWeight !== parseFloat(this.addOptions.scoreWeight)) {
                    this.$Toast("权重最多保留两位小数点");
                    return false;
                }
            }
            //选人
            if (this.setPerson && !this.addOptions.checkUser) {
                this.$Toast("请选择指定评分人");
                return;
            }
            if (
                (!this.setPerson && this.addOptions.checkUser) ||
                this.addOptions.requiredFlag
            ) {
                delete this.addOptions["checkUser"];
                delete this.addOptions["checkUserName"];
            }
            // 加（扣）分 上限必须数字
            if (this.addOptions.type === 3 || this.addOptions.type === 4) {
                if (
                    this.addOptions.itemLimit &&
                    isNaN(this.addOptions.itemLimit)
                ) {
                    this.$Toast(this.additionalScore[this.currentType[0]-3]+"必须为数字格式");
                    return false;
                }
            }
            // 必选 1.量化：权重 考核标准必填 2.加扣分：扣分标准必填
            if (this.addOptions.requiredFlag) {
                if (this.addOptions.type === 1) {
                    if (this.addOptions.scoreWeight === "") {
                        this.$Toast("指标必选时，权重不能为空");
                        return false;
                    }
                } else if (this.addOptions.type !== 2){
                    this.$Toast( "指标必选时，"+this.standardTitle[this.currentType[0]-1]+"不能为空");
                    return false;
                }
            }
            if (this.addOptions.itemBarrier || this.addOptions.itemChallenge) {
                if (this.addOptions.itemBarrier === this.addOptions.itemTarget) {
                    this.$Toast("门槛值和目标值不能相同");
                    return false;
                } else if (this.addOptions.itemTarget === this.addOptions.itemChallenge) {
                    this.$Toast("目标值和挑战值不能相同");
                    return false;
                } else if (this.addOptions.itemBarrier === this.addOptions.itemChallenge) {
                    this.$Toast("门槛值和挑战值不能相同");
                    return false;
                }
            }
           /*  // 结果值开启状态结果值不为空
            if (this.addOptions.needResult) {
                if (this.currentResult.length === 0) {
                    this.$Toast("结果值来源不能为空");
                    return false;
                }
            } */
            //量化不需要目标值和选择人员
            if (this.addOptions.type === 2) {
                delete this.addOptions["checkUser"];
                delete this.addOptions["checkUserName"];
                delete this.addOptions["itemTarget"];
            }

            return true;
        },
        //新增和编辑
        postData() {
            if (this.checkData()) {
                console.log(this.addOptions);
                let url = window.apiBasePath + "/app/perf/target/update",
                    data = this.addOptions;
                this.$Ajax({
                    type: "post",
                    url,
                    data
                }).then(res => {
                    if (!res) return;
                    this.$store.commit("setState", { factorDetail: this.addOptions });
                    this.$router.go(-1);
                    this.$Toast("新增指标成功", true);
                }).catch( (err) => {
                    console.log(err, "/target/update");
                });
            }
        },
        cancelData() {
            this.$router.go(-1);
        },
        //选择评分人
        selectPer(param) {
            dd.biz.contact.complexPicker({
                title:"选择评分人",            //标题
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
                    if (param === 'check') {
                        this.addOptions.checkUserName = data.users[0].name;
                        this.addOptions.checkUser = data.users[0].emplId;
                    } else if (param === 'result') {
                        this.addOptions.resultUserName = data.users[0].name;
                        this.addOptions.resultUser = data.users[0].emplId;
                    }
                },
                onFail: function(err) {}
            });
        },
        //选择指标返回数据
        filterTags(data) {
            this.addOptions.tagIds = data.selectTagIds;
            this.addOptions.targetTags = data.selectData;
            this.isSelect = false;
            console.log(data);
        },
        changeType(val) {
            if (Number(val[0]) !== this.addOptions.type) {
                this.addOptions.tagIds = [];
                this.addOptions.targetTags = [];
                console.log(val);
            }
            this.addOptions.type = Number(val[0]);
        },
        changeResult(val) {
            if (Number(val[0]) !== this.addOptions.resultType) {
                this.addOptions.resultType = Number(val[0]);
            }
        }
    }
};
</script>
<style scoped lang="less">
.target {
    margin-top: 8px;

    .target-content {
        position: absolute;
        top: 8px;
        bottom: 64px;
        width: 100%;
        padding-bottom: 10px;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

    .target-select {
        position: relative;
        background: #ffffff;
        margin-bottom: 1px;
    }

    .input {
        margin-bottom: 1px;
    }

    .person-score {
        background: #ffffff;
        padding: 0 19px 0px 16px;
        margin-bottom: 1px;

        &:last-child {
            padding-bottom: 40px;
        }

        .do-score {
            padding-top: 15px;
            font-size: 15px;
            line-height: 20px;
            color: rgba(25, 31, 37, 0.56);

            .red {
                font-size: 15px;
                color: #f25643;
            }
        }

        .do-input {
            padding-top: 5px;

            .input {
                height: 48px;
                width: 100%;
                border: 1px solid rgba(25, 31, 37, 0.76);
                border-radius: 4px;
                outline: none;
                padding-left: 10px;
            }

            .do-textarea {
                height: 40px;
                width: calc(~"100% - 10px");
                resize: none;
                border: 1px solid rgba(25, 31, 37, 0.76);
                border-radius: 4px;
                outline: none;
                font-size: 16px;
                color: #191f25;
                line-height: 25px;
                padding-left: 10px;
            }
        }
    }

    .margin-top {
        margin-top: 8px;
    }
    .margin-updown {
        margin: 8px 0;
    }
    .margin-bottom {
        margin-bottom: 8px;
    }
    .tips {
        line-height: 17px;
        padding: 7px 17px;
        font-size: 13px;
        color: rgba(25, 31, 37, 0.56);
    }

    .tags {
        margin-bottom: 1px;
        padding: 8px 11px 14px 17px;
        background-color: #fff;

        .tags-title {
            font-size: 12px;
            color: rgba(25, 31, 37, 0.56);
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
}
.factor-item {
    display: flex;
    height: 48px;
    line-height: 48px;
    padding: 0 15px;
    justify-content: space-between;
    background: #ffffff;
    .title {
        font-size: 17px;
    }
    .desc {
        font-size: 15px;
        text-align: right;
        color: #191F25;
    }
}
// 禁用margin-top:.8rem
.target-select /deep/.weui-cells {
    font-size: 0;

    .vux-label {
        font-size: 17px;
        color: #191f25;
    }

    .weui-cell__ft {
        font-size: 17px;
    }

    &::before {
        display: none;
    }

    &:after {
        display: none;
    }
}
.grey-space {
    height: 8px;
}
.target-select /deep/ .weui-label {
    font-family: PingFangSC-Regular;
    font-size: 17px;
    color: #191f25;
}

.target-select /deep/ .vux-cell-primary {
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: rgba(25, 31, 37, 0.56);
}
.target-select /deep/ .vux-cell-value {
    color: #191f25;
    font-size: 17px;
}
/deep/ .vux-popup-header-right {
    color: #4A90E2;
}
.target-select /deep/ .weui-cell {
    padding: 12px 15px;
}
</style>
