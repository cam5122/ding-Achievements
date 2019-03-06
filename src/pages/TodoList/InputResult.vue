<!-- 结果值录入 -->
<template>
    <div>
        <div class="result-input" v-if="createdFinish">
            <tab default-color="rgba(25,31,37,0.56)" bar-active-color="#3296FA" active-color="#191F25">
                <tab-item :selected="setResultInput.down === 0" @on-item-click="onTabClick(0)">未录入（{{resultInputData.needNum}}）</tab-item>
                <tab-item :selected="setResultInput.down === 1" @on-item-click="onTabClick(1)">已录入（{{resultInputData.completedNum}}）</tab-item>
            </tab>
            <div class="result-main" :class="{'fullScreen': setResultInput.down === 1}" ref="contentWrapper" @scroll="scrollMore">
                <result-item v-if="resultInputData.itemList.length > 0" :resultList="needResultList"></result-item>
                <no-data v-else msg="暂无数据"></no-data>
            </div>
            <footer-button2 v-if="setResultInput.down === 0 && resultInputData.needNum > 0" cancel="取消" confirm="确定" @cancelData="cancelSubmit" @confirmData="confirmResult"></footer-button2>
        </div>
    </div>
</template>

<script>
import { Tab, TabItem } from 'vux';
import resultItem from './resultItem';
import footerButton2 from '@/components/FooterButton2';
import noData from "@/components/NoData";
export default {
    data () {
        return {
            createdFinish: false,
            setResultInput: {
                down: 0, // 0 未录入 1已录入
                pageNo: 1,
                pageSize: 15,
                queryId: '',
                userId: '',
                scrolling: false
            },
            addList: [], // 暂存录入的数据
            resultInputData: {
                itemList: []
            }
        };
    },

    components: {
        Tab,
        TabItem,
        resultItem,
        footerButton2,
        noData
    },

    computed: {
        needResultList() {
            let list = {};
            // console.log("needList", this.todoList)
            this.resultInputData.itemList.forEach(item => {
                // console.log("item", item);
                if (list[item.userName]) {
                    list[item.userName].other.push(item);
                } else {
                    list[item.userName] = {};
                    list[item.userName].userName = item.userName;
                    list[item.userName].avatar = item.avatar;
                    list[item.userName].dept = item.dept;
                    list[item.userName].other = [];
                    list[item.userName].other.push(item);
                }
                // console.log("list",list);
            });
            // console.log("list",list);
            return list;
        }
    },
    created() {
        this.initPageInfo();
    },
    beforeRouteUpdate(to, from, next) {
        next();
        this.initPageInfo();
    },
    methods: {
        initPageInfo() {
            let query = this.$route.query;
            this.setResultInput.queryId = query.queryId;
            this.setResultInput.userId = query.userId;
            this.getResultInput().then(() => {
                this.createdFinish = true;
                }).catch((error) => {
                    this.$Toast(error);
                })
        },
        // 切换tab
        onTabClick (index) {
            if (this.setResultInput.down !== index) {
                this.setResultInput.down = index;
                this.setResultInput.pageNo = 1;
                this.getResultInput().then(() => {});
            }
        },
        // 获取数据
        getResultInput(){
            let url = `${window.apiBasePath}/app/perf/user/check/resultTargets`,
                param = this.setResultInput;
            // console.log("param", this.setResultInput);
            return this.$Ajax({
                url,
                param
            }).then(res=>{
                if (!res) return;
                // totalCount count在down状态不同情况下对应不同 未录入 已录入
                if (this.setResultInput.down === 0) {
                    res.data.needNum = res.data.totalCount;
                    res.data.completedNum = res.data.count;
                } else {
                    res.data.needNum = res.data.count;
                    res.data.completedNum = res.data.totalCount;
                }
                // resultItem需要判断状态
                res.data.itemList.forEach(item => {
                    item.down = this.setResultInput.down;
                })
                if (res.data.pageNo > 1) {
                    res.data.itemList = this.resultInputData.itemList.concat(res.data.itemList);
                }
                this.resultInputData = res.data;
                // console.log("result", this.resultInputData);
            }).catch( (err) => {
                console.log(err, "check/resultTargets");
            });
        },
        cancelSubmit() {
            this.$router.replace('/todoList')
        },
        // 提交
        confirmResult(){
            // 处理填值的数据
            this.addList = [];
            for (let key in this.needResultList) {
                this.needResultList[key].other.map(item => {
                    if (item.itemResult) {
                        this.addList.push(item);
                    }
                })
            }
            // console.log(this.addList)
            if(this.addList.length === 0) {
                this.$Toast("请至少输入一项结果值数据");
                return;
            }
            let url = `${window.apiBasePath}/app/perf/user/check/submitResultTargets`,
                data = this.addList;
            this.$Ajax({
                type: 'post',
                url,
                data
            }).then(res=>{
                if (!res) return;
                if (this.resultInputData.needNum - this.addList.length === 0) {
                    this.$getTodoNext().then(res => {
                        if (res.length === 0) {
                            this.setResultInput.down = 1;
                            this.getResultInput().then(() => {
                                this.$Toast('录入成功',true);
                            });
                        } else {
                            this.$Toast("录入成功，3S后将自动打开下一条待办", true, 3000);
                        }
                        });
                } else {
                    this.setResultInput.down = 1;
                    this.getResultInput().then(() => {
                        this.$Toast('录入成功',true);
                    });
                }
            }).catch( (err) => {
                console.log(err, "submitResultTargets");
            });
        },
        scrollMore() {
            let content = this.$refs.contentWrapper;
            /* console.log('offset',content.offsetHeight);
            console.log('top',content.scrollTop);
            console.log('height',content.scrollHeight); */
            if (content.offsetHeight + content.scrollTop === content.scrollHeight) {
                if (this.setResultInput.pageNo < this.resultInputData.totalPages && !this.scrolling) {
                this.scrolling = true; // 滚动加载中
                this.$showLoading("加载下一页");
                this.setResultInput.pageNo++;
                this.getResultInput ()
                    .then(() => {
                        this.scrolling = false;
                    })
                    .catch(err => {
                        this.$Toast(err);
                    });
                }
            }
        }
    }
}

</script>
<style lang="less" scoped>
.result-main {
    position: absolute;
    top: 44px;
    bottom: 64px;
    width: 100%;
    padding-bottom: 10px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    &.fullScreen {
        bottom: 0;
    }
}
</style>