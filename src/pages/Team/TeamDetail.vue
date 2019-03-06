<!-- 考核详情 -->
<template>
<div>
    <div class="station-detail" v-if="!isSearching">
        <div class="filter-wrapper">
            <div class="search item" @click="changeSearchStatus">
                <img width="16" height="16" src="@/assets/search.png" class="tip">
                <span class="text tip">搜索</span>
            </div>
             <div class="filter item" @click="selectDept">
                <img width="16" height="16" src="@/assets/filter.png" class="tip">
                <span class="text tip">筛选</span>
            </div>
        </div>
        <div class="content-wrapper" ref="contentWrapper" @scroll="scrollMore" v-if="createdFinish">
            <div class="condition" v-show="!isSelected">
                <div class="text">
                    <span class="title">参与考核：</span>
                    <span class="desc">{{prefGetData.totalNum || 0}}人</span>
                </div>
            </div>
            <div class="condition" v-show="isSelected">
                <div class="text">
                    <span class="title">筛选条件：</span>
                    <span class="desc">{{department.name}} | 共{{prefGetData.totalNum || 0}}人</span>
                </div>
                <img class="icon" width="14" height="14" src="@/assets/close.png" @click="closeCondition">
            </div>
            <ul class="content-list" v-if="prefGetData.records.length > 0">
                <li class="person" v-for="item in prefGetData.records" :key="item.userId" @click="toDetail(item.processId, item.userId)">
                    <div class="inline">
                        <app-avatar :avatar="item.avatar" :name="item.userName" :width="35"></app-avatar>
                    </div>
                    <div class="desc inline">
                        <span class="name">{{item.userName}}</span>
                        <span class="dept">{{item.deptName}}</span>
                    </div>
                    <!-- <div class="result inline orange" :class="{'green': item.status ===5}">
                        {{status[item.status].key}}
                    </div> -->
                </li>
            </ul>
            <div v-else>
                <no-data></no-data>
            </div>
        </div>
    </div>
    <div class="search-detail" v-else>
         <search-data :tips="'按人名搜索'" @search="searchPeople" @hideContent="hideContent" @goback="goback"></search-data>
        <div class="contentlist-wrapper" v-show="isInputing">
            <ul class="content-list" v-if="prefGetData.records.length > 0">
                <li class="person" v-for="item in prefGetData.records" :key="item.userId" @click="toDetail(item.processId, item.userId)">
                    <div class="inline">
                        <app-avatar :avatar="item.avatar" :name="item.userName" :width="35"></app-avatar>
                    </div>
                    <div class="desc inline">
                        <span class="name">{{item.userName}}</span>
                        <span class="dept">{{item.deptName}}</span>
                    </div>
                    <!-- <div class="result inline orange" :class="{'green': item.status ===5}">
                        {{status[item.status].key}}
                    </div> -->
                </li>
            </ul>
            <div v-else>
                <no-data :msg="'搜索无此人'"></no-data>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import * as dd from 'dingtalk-jsapi'
import appAvatar from '@/components/Avatar';
import noData from '@/components/NoData';
import searchData from '@/components/Search';

export default {
    data () {
        return {
            searchName: '',
            createdFinish: false,
            isSelected: false,
            isInputing: false,
            isSearching: false,
            scrolling: false,
            status: [
                { value: 0, key: "全部" },
                { value: 1, key: "目标已制定" },
                { value: 2, key: "目标已确认" },
                { value: 3, key: "已自评" },
                { value: 4, key: "评分人已评分" },
                { value: 5, key: "已结束" }
            ],
            prefSetData: {
                queryId: '', // 当前选中的团队绩效id
                deptId: '',
                status: 0, // 状态
                searchKey: '',
                pageNo: 1,
                pageSize: 15

            },
            prefGetData: {
                records: []
            },
            department: {
                id: '',
                name: ''
            },
            disabledDepartments: []
        };
    },
    created () {
        this.prefSetData.queryId = this.$route.query.queryId;
        this.getPerfList().then(res => {
            this.hideFn()
        })
        .catch(err => {
            this.hideFn()
        });
        // this.limitDepts();
    },
    components: {
        appAvatar,
        noData,
        searchData
    },

    computed: {
        corpId () {
            return window.corpId;
        },
        appId () {
            return window.appId;
        }
    },

    methods: {
        // 限制选择部门
        limitDepts() {
            let url = window.apiBasePath + "/app/perf/org/getAuthDepts";
            this.$Ajax({ url }).then(res => {
                if (!res) return;
                if (res.data !== 1) { // 1是可选部门
                    this.disabledDepartments = res.data; // 返回的是可选部门
                }
            }).catch( (err) => {
                console.log(err, "org/getAuthDepts");
            });
        },
        // 搜索
        searchPeople(newValue){
            this.prefSetData.searchKey = newValue;
            this.getPerfList().then(res => {
                this.isInputing = true;
                this.hideFn();
            })
            .catch(err => {
                this.hideFn()
            });
        },
        hideContent () {
            this.isInputing = false;
        },
        //恢复原页面
        goback () {
            if (this.prefSetData.searchKey !== '') {
                this.prefSetData.searchKey= '';
                this.getPerfList().then(res => {
                    this.hideFn()
                })
                .catch(err => {
                    this.hideFn()
                });
            }
            this.isSearching = false;
            this.searchName = '';
            this.isInputing = false;
        },
        //改变搜索状态
        changeSearchStatus () {
            this.isSearching = !this.isSearching;
        },
        // 清空搜索
        clear () {
            this.searchName = '';
            this.isInputing = false;
        },
        // 加载
        hideFn () {
            this.createdFinish = true;
            setTimeout(() => {        
                this.$hideLoading();
            }, 200);
        },
        // 获取绩效列表
        getPerfList(pageNo, pageSize) {
            let url = window.apiBasePath + "/app/perf/group/showDetailList",
                param = this.prefSetData;
            return this.$Ajax({ url, param, type: "post" }).then(res => {
                // this.$Alert({text: JSON.stringify(res)})
                if (!res || !res.data) return;
                if (!res.data.records) {
                    res.data.records = [];
                }
                if (res.data.pageNo > 1) {
                    res.data.records = this.prefGetData.records.concat(res.data.records);
                }
                this.prefGetData = res.data;
                this.scrolling = false;
            }).catch( (err) => {
                console.log(err, "group/showDetailList");
            });
        },
        // 滚动加载下一页
        scrollMore() {
            let content = this.$refs.contentWrapper;
            /* console.log('offset',content.offsetHeight);
            console.log('top',content.scrollTop);
            console.log('height',content.scrollHeight); */
            if (content.offsetHeight + content.scrollTop === content.scrollHeight) {
                if (this.prefSetData.pageNo < this.prefGetData.totalPages && !this.scrolling) {
                this.scrolling = true; // 滚动加载中
                this.$showLoading("加载下一页");
                this.prefSetData.pageNo++;
                this.getPerfList ()
                    .then(() => {
                        this.$hideLoading();
                    })
                    .catch(err => {
                        this.$hideLoading();
                    });
                }
            }
        },
        // 筛选 部门
        selectDept () {
            console.log(appId, corpId);
            dd.biz.contact.departmentsPicker({
                title:"选择部门",            //标题
                corpId: corpId,              //企业的corpId
                multiple:false,            //是否多选
                limitTips:"超出了最多部门",          //超过限定人数返回提示
                maxDepartments:100,            //最大选择部门数量
                pickedDepartments:[],          //已选部门
                disabledDepartments: [],        //不可选部门
                requiredDepartments:[],        //必选部门（不可取消选中状态）
                appId:appId,              //微应用的Id
                permissionType:"GLOBAL",          //选人权限，目前只有GLOBAL这个参数
                onSuccess: (result) => {
                    this.isSelected = true;
                    if (result.departments[0].id === -1) {
                        result.departments[0].id = 0;
                    }
                    this.prefSetData.deptId = result.departments[0].id;
                    this.department = result.departments[0];
                    // this.$Alert({text: this.prefSetData});
                    this.getPerfList().then(res => {
                        this.hideFn()
                    })
                    .catch(err => {
                        this.hideFn()
                    });
                   
                },
                onFail : (err) => {
                    this.$Alert({text: err});
                }
            });
        },
        // 关闭筛选
        closeCondition () {
            this.isSelected = false;
            this.prefSetData.deptId = '';
            this.getPerfList().then(res => {
                this.hideFn()
            })
            .catch(err => {
                this.hideFn()
            });
        },
        // 详情页
        toDetail(process, user) {
            console.info('processId', process);
            let processId = process || '',
                userId = user || '';
            this.$router.push({
                path: '/detail',
                query: {
                    processId,
                    userId
                }
            });
        }
    }
}

</script>
<style lang="less" scoped>
@import "../../less/mixins.less";
.station-detail {
    .filter-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        padding: 13px 0;
        background-color: #ffffff;
        z-index: 10;
        box-shadow: 0px 8px 14px rgba(0, 0, 0,0.05);
        .item {
            flex: 1;
            text-align: center;
            &:first-child {
                border-right: 1px solid rgba(25,31,37,0.12);
            }
            .text {
                font-size: 15px;
                color: rgba(25,31,37, 0.76);
                line-height: 21px;
            }
            .tip {
                vertical-align: middle;
            }
        }
    }
    .content-wrapper {
        position: fixed;
        top: 54px;
        bottom: 0;
        width: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .condition {
            height: 41px;
            padding: 0 13px;
            .text {
                display: inline-block;
                font-size: 13px;
                color: rgba(25,31,37,0.40);
                line-height: 40px;
            }
            .icon {
                float: right;
                padding: 13px 5px;
            }
        }
    }
}
.contentlist-wrapper {
    padding-top: 8px;
}
.content-list {
    background-color: #ffffff;
    padding-left: 18px;
    &.margin {
        margin-top: 8px;
    }
    .person {
        padding-right: 18px;
        height: 64px;
        display: flex;
        align-items: center;
        .border-1px(rgba(25,31,37, 0.12));
        &:last-child {
            .border-none();
        }
        .inline {
            display: inline-block;
            font-size: 0;
        }
        .desc {
            padding-left: 10px;
            .name {
                font-size: 15px;
                color: #000000;
                line-height: 21px;
            }
            .dept {
                display: block;
                font-size: 13px;
                color: rgba(0,0,0,0.56);
                line-height: 18px;
            }
        }
        .result {
            padding-top: 22px;
            float: right;
            font-size: 14px;
            &.orange {
                color: #FF943E;
            }
            &.green {
                color: #15BC83;
            }
        }
    }
 }
</style>