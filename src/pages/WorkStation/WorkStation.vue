<!-- 工作台 -->
<template>
    <div class="workstation" ref="workStation">
        <div class="header" ref="header">
            <div class="img-wrapper" v-if="userAuthData.corpAuth || userAuthData.userAuth.includes(2) || userAuthData.userAuth.includes(3) || userAuthData.userAuth.includes(4) || userAuthData.userAuth.includes(6)">
                <img height="80" width="100%" class="header-bg" src="@/assets/header-bg.png">
            </div>
           <!--  待办事项入口 -->
            <todo-entry></todo-entry>
            <div class="tabbar"  v-if="userAuthData.userAuth.includes(3) || userAuthData.userAuth.includes(4) || userAuthData.userAuth.includes(6)">
                <!-- <div class="pay-wrapper" v-if="!userAuthData.corpAuth" @click="goPayEntry">
                    <img height="49.5" width="87" class="pay-entry" src="@/assets/pay-entry.png">
                </div> -->
                <h2 class="title">绩效工作台</h2>
                <station-header></station-header>
            </div>
        </div>
        <div v-if="userAuthData.userAuth.includes(3) || userAuthData.userAuth.includes(4) || userAuthData.userAuth.includes(5)">
            <div class="content-filter sticky" @click="selectDateType" :class="{'fixed': isFixed}" ref="contentFilter">
                <span class="text">{{dateTypes[teamSetData.typeSelected].key}}</span>
                <span class="tags-icon-down"></span>
            </div>
            <div class="work-content" v-if="createdFinish">
                <ul class="content-list" v-if="teamPrefList.length > 0">
                    <li class="list-item" v-for="(item, index) in teamPrefList" :key="index" @click="goTeamDeatil(item.queryId, item.title)">
                        <h2 class="name">{{item.title}}</h2>
                        <div class="number">
                            <span class="icon">
                                <img width="14" height="12" src="@/assets/team.png">
                            </span>
                            <span class="text">{{item.participateNumber}}人参与</span>
                        </div>
                    </li>
                </ul>
                <div v-else>
                    <no-data msg="暂无绩效考核数据"></no-data>
                </div>    
            </div>
        </div>
    </div>
</template>

<script>
import * as dd from 'dingtalk-jsapi'
import stationHeader from '@/components/StationHeader';
import noData from '@/components/NoData';
import todoEntry from './TodoEntry';

import { postBury } from '@/utils'

export default {
    name: "workStation",
    data () {
        return {
            isFixed: false, //滚动固定
            // scrolling: false,
            createdFinish: false,
            teamPrefList: [],
            teamGetData: {
                totalPages: 0,
            },
            teamSetData: {
                pageNo: 1,
                pageSize: 10,
                typeSelected: 0,
            },
            dateTypes: [
                { value: 0, key: "全部" },
                { value: 1, key: "月度" },
                { value: 2, key: "季度" },
                { value: 3, key: "半年度" },
                { value: 4, key: "年度" },
                { value: 5, key: "试用期" }
            ],
        };
    },
    /* beforeCreate () {
        this.$showLoading();
    }, */
    created () {
        postBury(202003);
        this.getTeamData().then(res => {
            this.hideFn();
        })
        .catch(err => {
            this.hideFn()
        });
    },
    mounted() {
        // document.body.onscroll = this.scrollMore
    },
    components: {
        stationHeader,
        noData,
        todoEntry
    },

    computed: {
        typeSelected () {
            return this.teamSetData.typeSelected;
        },
        userAuthData () {
            return this.$store.state.userAuthData;
        }
    },
    beforeRouteUpdate(to, from, next) {
        if (!this.userAuthData.userAuth || (this.userAuthData.userAuth.includes(1) && this.userAuthData.userAuth.length === 1)) {
          this.$router.replace({path: '/my'});
        }
    },
    methods: {
        // 加载
        hideFn () {
            this.createdFinish = true;
            setTimeout(() => {        
                this.$hideLoading();
            }, 200);
        },
        // 获取团队绩效列表
        getTeamData() {
            let url = window.apiBasePath + "/app/perf/group/showList";
            let param = {
                type: this.typeSelected || 0,
                pageNo: this.teamSetData.pageNo, // 虽然已经去掉翻页，后端还需要这个参数，前端暂时写死
                pageSize: this.teamSetData.pageSize // 虽然已经去掉翻页，后端还需要这个参数，前端暂时写死
            };
            return this.$Ajax({ url, type: "post", param }).then(res => {
                // console.log(res.data.groupListSummury);
                if (!res) return;
                this.$store.commit("saveAllTeamData", res.data);
                /* if (res.data.pageNo > 1) {
                    res.data.groupListSummury = this.teamPrefList.concat(res.data.groupListSummury);
                } */
                this.teamPrefList = res.data.groupListSummury;
            }).catch( (err) => {
                console.log(err, "/group/showList");
            });;
        },
        // 选择时间
        selectDateType () {
            dd.biz.util.chosen({
                source: this.dateTypes,
                selectedKey: this.dateTypes[this.teamSetData.typeSelected].key, // 默认选中的key
                onSuccess: (result) => {
                    //onSuccess将在点击完成之后回调
                   this.teamSetData.typeSelected = result.value;
                   this.getTeamData().then(res => {
                        this.hideFn()
                    })
                    .catch(err => {
                        this.hideFn()
                    });
                },
                onFail: (err) => {
                    this.$Alert(err);
                }
            });
        },
        // 进入详情页
        goTeamDeatil (queryId, title) {
            this.$router.push({
                path: '/teamDetail', 
                query: {
                    queryId: queryId,
                    title: title
                }
            });
        },
        goPayEntry () {
            this.$router.push({
                path: '/payActivity'
            });
        }
    }
}

</script>
<style lang="less" scoped>
@import "../../less/mixins.less";
.workstation {
    position: relative;
    padding-bottom: 50px;
    width: 100%;
    height: 100%;
    .header {
        position: relative;
        .img-wrapper {
            font-size: 0;
            position: relative;
            z-index: -1;
        }
        .tabbar {
            position: relative;
            background: #FFFFFF;
            padding: 14px 35px 17px;
            .title {
                font-size: 14px;
                color: #191F25;
                font-weight: bold;
            }
        }
    }
    .content-filter {
        display: flex;
        width: 100%;
        background-color: #fff;
        height: 49px;
        margin-top: 12px;
        align-items: center;
        justify-content: center;
        .border-1px(rgba(25,31,37,0.08));
        &.sticky {
            position: sticky;
            top: 0;
            transform: translate3d(0,0,0);
        }
        .text {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #191F25;
            padding-right: 15px;
        }
        .icon {
            position: relative;
            display: inline-block;
            padding-left: 4px;
            top: -3px;
        }

    }
    .work-content {
        .content-list {
            background: #FFFFFF;
            .list-item {
                padding: 22px 35px;
                box-shadow: 0 7px 11px rgba(25,31,37,0.04);
            }
            .name {
                font-size: 15px;
                line-height: 21px;
                font-weight: normal;
            }
            .number {
                padding-top: 4px;
                span {
                    display: inline-block;
                    vertical-align: middle;
                }
                .text {
                    font-size: 13px;
                    color: rgba(0,0,0,0.56);
                    line-height: 18px;
                }
            }
        }
    }
}
.pay-wrapper {
    position: absolute;
    top: -47px;
    right: 45px;
}
.tags-icon {
    display: inline-block;
    position: relative;
    top: -5px;
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
</style>