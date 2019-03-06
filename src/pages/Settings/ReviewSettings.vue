<!-- reviewSettings -->
<template>
    <div class="review-settings">
        <div class="settings-path">
            <p class="text">移动端考评组设置功能正在开发中，可前往钉钉桌面版-工作台-智能绩效-设置-考评组设置处进行设置</p>
        </div>
        <div class="review-content" v-if="createdFinish">
            <ul v-if="groupGetData.groups.length > 0">
                <li class="review-list" v-for="item in groupGetData.groups" :key="item.id">
                    <h2 class="name">{{item.name}}</h2>
                    <div class="item">
                        <span class="title">
                            <span class="img-wrapper">
                                <img width="17" height="12" src="@/assets/people.png">
                            </span>
                            <span class="text">参与人数：</span>
                        </span>
                        <span class="desc">{{item.personNum}}</span>
                    </div>
                    <div class="item">
                        <span class="title">
                            <span class="img-wrapper">
                                <img width="14" height="13" src="@/assets/date.png">
                            </span>
                            <span class="text">考核类型：</span>
                        </span>
                        <span class="desc">{{typeTitle[item.checkType-1]}}</span>
                    </div>
                    <div class="item">
                        <span class="title">
                            <span class="img-wrapper">
                                <img width="15" height="15" src="@/assets/target.png">
                            </span>
                            <span class="text">目标制定方式：</span>
                        </span>
                        <span class="desc">{{item.makeType}}</span>
                    </div>
                    <div class="item">
                        <span class="title">
                            <span class="img-wrapper">
                                <img width="15" height="14" src="@/assets/person.png">
                            </span>
                            <span class="text">考评组负责人：</span>
                        </span>
                        <span class="desc">{{ item.principal || '-' }}</span>
                    </div>
                </li>
            </ul>
            <div class="empty-data" v-else>
                <span class="empty-tips">暂无考评组数据</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            createdFinish: false,
            groupGetData: {
                groups: []
            },
            groupSetData: {
                pageNo: 1,
                pageSize: 15,
                userAuth: 0,
                searchKey: '', // 搜索字段
                orderb: '', // 排序字段
                isDesc: false //true降序  false升序
            },
            typeTitle: ["月度", "季度", "半年度", "年度", "试用期"]
        };
    },
    created () {
        this.getGroupData()
            .then(() => {
                this.hideFn();
            })
            .catch(() => {
                this.hideFn();
            })
    },

    components: {},

    computed: {
        userAuth () {
            return window.userAuthData.userAuth;
        }
    },

    methods: {
        hideFn () {
            this.createdFinish = true;
            setTimeout(() => {        
                this.$hideLoading();
            }, 200);
        },
        // 获取所有考评组
        getGroupData(pageNo, pageSize) {
            let url = window.apiBasePath + "/app/perf/configuration/group/list",
            param = {
                pageNo: this.groupSetData.pageNo,
                pageSize: this.groupSetData.pageSize,
                // userAuth: window.userAuthData.userAuth,
                searchKey: this.groupSetData.searchKey,
                orderb: this.groupSetData.orderb,
                isDesc: this.groupSetData.isDesc,
            };
            return this.$Ajax({ url, param, type: "post" }).then(res => {
                if (!res) return;
                this.groupGetData.groups = res.data.groups;
                console.log(this.groupGetData.groups);
            }).catch( (err) => {
                console.log(err, "/group/list");
            });
        },
    }
}

</script>
<style lang="less" scoped>
@import "../../less/mixins.less";
.review-settings{
    .settings-path {
        padding: 17px 15px 9px;
        .text {
            font-size: 13px;
            color: rgba(25,31,37,0.40);
            line-height: 19px;
        }
    }
    .review-content {
        .review-list {
            background-color: #ffffff;
            padding-left: 20px;
            border-top: 1px solid rgba(25,31,37,0.08);
            border-bottom: 1px solid rgba(25,31,37,0.08);
            .name {
                font-size: 16px;
                font-weight: normal;
                color: #191F25;
                line-height: 50px;
                .border-1px(rgba(25,31,37,0.08));
            }
            .item {
                font-size: 14px;
                color: rgba(25,31,37,0.76);
                padding-top: 12px;
                line-height: 14px;
                &:last-child {
                    padding-bottom: 27px;
                }     
                .title {
                    display: inline-block;
                    width: 130px;
                    vertical-align: top;
                    .img-wrapper {
                        display: inline-block;
                        width: 20px;
                        vertical-align: top;
                    }
                }
            }
        }
    }
    .review-list + .review-list {
        margin-top: 9px; 
    }
    .empty-data {
        background-image: url("../../assets/empty-box-4.png");
        background-position: 50% 50%;
        background-repeat: no-repeat;
        background-size: 130px;
        min-height: 250px;
        text-align: center;
    }
    .empty-tips {
        padding-top: 190px;
        display: block;
        color: #cdcdcd; //#bfbfbf
        font-size: 15px;
    }
}
</style>