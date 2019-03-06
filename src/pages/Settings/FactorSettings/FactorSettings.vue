<!-- 工作台 -->
<template>
<div>
    <div class="factor-settings" v-if="!isSelected">
        <div class="filter-wrapper" v-if="normal">
            <div class="search item" @click="goSearch">
                <img width="16" height="16" src="@/assets/search.png" class="tip">
                <span class="text tip">搜索</span>
            </div>
             <div class="filter item" @click="goFilterTags">
                <img width="16" height="16" src="@/assets/filter.png" class="tip">
                <span class="text tip">筛选</span>
            </div>
        </div>
         <div class="search-wrapper" v-else>
            <search-data :tips="'按指标名称搜索'" @hideContent="hideContent" @search="searchFactor" @goback="cannelSearch"></search-data>
        </div>
       <!--  <div class="header">
            <div class="item" :class="{'active': setIndexData.type === 1}" @click="changeIndex(1)">量化指标</div>
            <div class="item" :class="{'active': setIndexData.type === 2}" @click="changeIndex(2)">行为价值观指标</div>
        </div> -->
        <div class="content-wrapper" v-if="createdFinish && isShowList" @scroll="scrollMore" ref="contentWrapper">
            <div class="num" v-if="normal">{{getIndexData.totalCount}}个指标</div>
            <div class="num" v-else>{{getIndexData.targets.length}}个指标</div>
            <ul class="content-list" v-if="getIndexData.targets.length>0">
                <li class="list-item" v-for="item in getIndexData.targets" :key="item.id" @click="goFactorDetail(item)">
                    <div class="item-wrapper">
                        <h2 class="name">{{item.name}}</h2>
                        <div class="tags-list" v-if="!!item.tagNames || item.requiredFlag">
                            <span class="tag must" v-if="item.requiredFlag">必选</span>
                            <span class="tag" v-for="(tag, index) in item.tagNames" :key="tag+index">{{tag}}</span>
                        </div>
                    </div>
                    <div class="weight">{{item.scoreWeight>-1 ? item.scoreWeight : '-'}}{{item.scoreWeight>-1? '%' :''}}</div>
                </li>
            </ul>
            <no-data v-else :msg="'指标库暂无数据'"></no-data>
        </div>
        <footer-button :iconContent="'新增指标'" @submitData="addFactor"></footer-button>
    </div>

    <!-- 筛选组件 -->
    <select-tags v-else :type="setIndexData.type" :tagDatas="targetTags" :mutiSelect="false" @filterTags="filterTags"></select-tags>
</div>
</template>

<script>
import noData from "@/components/NoData";
import searchData from "@/components/Search";
import footerButton from "@/components/FooterButton";
import selectTags from '@/components/SelectTags';
export default {
    name: "factorSettings",
    data() {
        return {
            isSelected: false, // true选择标签页面
            normal: true, // false则搜索页面
            isShowList: true,
            scrolling: false,
            createdFinish: false,
            targetTags: [], // 标签
            setIndexData: {
                type: 1, // 指标类型  1是量化 2是行为 3加分 4扣分
                orderName: "", // 排序字段
                orderType: false, // 排序规则
                tagIds: "", // 筛选标签 以 | 分割
                pageNo: 1,
                pageSize: 15
            },
            getIndexData: {
                pageNo: 0,
                pageSize: 0,
                targets: [],
                totalCount: 0,
                totalPages: 0
            }
        };
    },
    created() {
        this.getIndexList()
            .then(() => {
                this.hideFn();
            })
            .catch(err => {
                this.hideFn();
            });
    },
    components: {
        noData,
        searchData,
        footerButton,
        selectTags
    },
    computed: {
        tagDetail() {
            return this.$store.state.filterTags;
        },
        corpId() {
            return this.$store.state.userAuthData.corpId;
        }
    },

    methods: {
        // 加载
        hideFn() {
            this.createdFinish = true;
            setTimeout(() => {
                this.$hideLoading();
            }, 200);
        },
        // 改变header
        changeIndex(index) {
            this.setIndexData.type = index;
            this.setIndexData.pageNo = 1;
            this.getIndexList()
                .then(() => {
                    this.hideFn();
                })
                .catch(err => {
                    this.hideFn();
                });
        },
        // 获取指标库列表
        getIndexList() {
            let url = window.apiBasePath + "/app/perf/target/list";
            // this.setIndexData.type = this.tagDetail.type;
            // this.setIndexData.tagIds = this.tagDetail.tagIds.join("|");
            let param = this.setIndexData;
            // console.log(this.tagDetail);
            return this.$Ajax({ url, param }).then(res => {
                if (!res) return;
                if (res.data.pageNo <= 1) {
                    this.getIndexData.targets = [];
                } else if (res.data.pageNo > 1) {
                    res.data.targets = this.getIndexData.targets.concat(
                        res.data.targets
                    );
                }
                this.getIndexData = res.data;
                this.scrolling = false;
            }).catch( (err) => {
                console.log(err, "target/list");
            });
        },
        // 滚动加载下一页
        scrollMore() {
            let content = this.$refs.contentWrapper;
            /* console.log('offset',content.offsetHeight);
            console.log('top',content.scrollTop);
            console.log('height',content.scrollHeight); */
            if (
                content.offsetHeight + content.scrollTop ===
                content.scrollHeight
            ) {
                if (
                    this.setIndexData.pageNo < this.getIndexData.totalPages &&
                    !this.scrolling && this.normal
                ) {
                    this.scrolling = true; // 滚动加载中
                    this.$showLoading("加载下一页");
                    this.setIndexData.pageNo++;
                    this.getIndexList()
                        .then(() => {
                            this.$hideLoading();
                        })
                        .catch(err => {
                            this.$hideLoading();
                        });
                }
            }
        },
        // 筛选
        goFilterTags() {
            this.isSelected = true;
        },
        // 确定筛选
        filterTags(selected){
            if(selected.selectedFactors.length >= 2){
                this.setIndexData.type = 0;
            } else {
                this.setIndexData.type = +(selected.selectedFactors.join());
            }
            this.targetTags = selected.selectTagIds;
            // console.log('targetTags', this.targetTags)
            this.setIndexData.pageNo = 1;
            this.setIndexData.tagIds = selected.selectTagIds.join("|");
            this.getIndexList().then((res)=> {
                this.isSelected = false;
            })
        },
        goSearch() {
            this.normal = false;
            this.isShowList = false;
        },
        // 搜索指标库（跨域JSONP）
        searchFactor(value) {
            let param = {
                corpId: this.corpId,
                searchKey: value,
                type: this.setIndexData.type,
                jsonpCallback: "JSONP_" + new Date().getTime()
            };
            let url = window.apiBasePath + "/app/perf/target/list/search";
            this.$Ajax({ url, param }).then(res => {
                if (!res) return;
                /* const regex1 = /\((.+?)\)/g;
                console.log(res);
                let result = JSON.parse(
                    res
                        .match(regex1)
                        .toString()
                        .replace("(", "")
                        .replace(")", "")
                ); */
                this.getIndexData.targets = res.data.targets;
                this.isShowList = true;
                // console.log('search', result);
            }).catch( (err) => {
                console.log(err, "/list/search");
            });
        },
        // 清空search 重新请求
        cannelSearch() {
            this.getIndexList().then(() => {
                this.normal = true;
                this.isShowList = true;
            });
        },
        hideContent() {
            this.isShowList = false;
        },
        //详情页
        goFactorDetail(item) {
            this.$store.commit("setState", { factorDetail: item });
            this.$router.push({ path: "/settings/factorDetail" });
        },
        // 添加指标库
        addFactor() {
            this.$store.commit("clearFactorDetail");
            this.$router.push({ path: "/settings/addFactor" });
        }
    }
};
</script>
<style lang="less" scoped>
.factor-settings {
    font-family: PingFangSC-Regular;
    .filter-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        padding: 13px 0;
        background-color: #ffffff;
        box-shadow: 0px 8px 14px rgba(0, 0, 0, 0.05);
        z-index: 10;
        .item {
            flex: 1;
            text-align: center;
            &:first-child {
                border-right: 1px solid rgba(25, 31, 37, 0.12);
            }
            .text {
                font-size: 15px;
                color: rgba(25, 31, 37, 0.76);
                line-height: 21px;
            }
            .tip {
                vertical-align: middle;
            }
        }
    }
    .search-wrapper {
        position: fixed;
        top: 0;
        width: 100%;
    }
    .header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        height: 48px;
        background: #ffffff;
        z-index: 10;
        .item {
            flex: 1;
            text-align: center;
            font-size: 15px;
            line-height: 48px;
            font-size: 15px;
            color: rgba(25, 31, 37, 0.56);
            &.active {
                color: #3296fa;
                border-bottom: 2px solid #0087fd;
            }
        }
    }
    .content-wrapper {
        position: fixed;
        top: 49px;
        bottom: 64px;
        padding-bottom: 10px;
        width: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .num {
            position: relative;
            // margin-top: 8px;
            height: 42px;
            line-height: 42px;
            font-size: 13px;
            color: rgba(25, 31, 37, 0.4);
            padding-left: 36px;
        }
        .content-list {
            background: #ffffff;
            .list-item {
                position: relative;
                height: 82px;
                padding: 0 20px 0 30px;
                display: flex;
                align-items: center;
                box-shadow: 0 7px 11px rgba(25, 31, 37, 0.04);
                .item-wrapper {
                    display: inline-block;
                    .name {
                        font-size: 16px;
                        color: #000000;
                        font-weight: normal;
                        max-width: 250px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        vertical-align: top;
                    }
                    .tags-list {
                        margin-top: 6px;
                        height: 21px;
                        overflow: hidden;
                        max-width: 250px;
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
                            &.must {
                                color: #f25643;
                                background: rgba(242, 86, 67, 0.1);
                            }
                        }
                    }
                }
                .weight {
                    position: absolute;
                    right: 20px;
                }
            }
        }
    }
}
.tag + .tag {
    margin-left: 6px;
}
.list-item + .list-item {
    margin-top: 7px;
}
</style>