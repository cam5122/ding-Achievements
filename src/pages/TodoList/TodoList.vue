<!-- 待办事项 -->
<template>
    <div class="todo-list" v-if="createdFinish ">
        <div v-if="todoList.needList.length>0">
            <div class="title">当前待办
                <span class="num">（{{todoCount.needCount}}）</span>
            </div>
            <div class="content-wrapper" ref="contentWrapper" v-if="createdFinish" @scroll="scrollMore">
                <todo-item :todoList="todoList.needList" @clickItem="toDetail"></todo-item>
            </div>
        </div>
        <div v-else>
            <no-data :msg="'暂无待办事项'"></no-data>
        </div>
    </div>
</template>

<script>
import appAvatar from '@/components/Avatar';
import noData from '@/components/NoData';
import todoItem from './TodoItem';

export default {
    data () {
        return {
            scrolling: false,
            createdFinish: false,
            setTodoData: {
                type: 1, // 1待办 2 已处理
                pageNo: 1,
                pageSize: 20
            },
            todoList: {
                needList: []
            }
        };
    },
    created(){
        this.getTodoList()
            .then(() => {
                this.createdFinish = true;
            })
            .catch((error)=>{
                this.$Toast(error)
            });
        this.getTodoCount();
    },
    components: {
        appAvatar,
        noData,
        todoItem
    },
    computed: {
        todoCount () {
            return this.$store.state.todoCount;
        }
    },
    methods: {
        // 待办事项
        getTodoCount() {
            let url = window.apiBasePath + '/app/perf/step/needCount'
            return this.$Ajax({
                url,
                hideLoad: true
            }).then((res) => {
                if (!res) return
                this.$store.commit('setState', {
                    todoCount: res.data || {}
                })
            }).catch( (err) => {
                console.log(err, "step/needCount");
            });
        },
        // 获取待办列表
        getTodoList() {
            let url = window.apiBasePath + '/app/perf/step/needList',
                param = this.setTodoData;
            return this.$Ajax({url, param}).then((res)=>{
                if(!res) return;
                if (res.data.pageNo > 1) {
                    res.data.needList = this.todoList.needList.concat(res.data.needList);
                }
                this.todoList = res.data;
                this.scrolling = false;
            }).catch( (err) => {
                console.log(err, "perf/step/needList");
            });
        },
        // 滚动加载下一页
        scrollMore() {
            let content = this.$refs.contentWrapper;
           /*  console.log('offset',content.offsetHeight);
            console.log('top',content.scrollTop);
            console.log('height',content.scrollHeight); */
            if (content.offsetHeight + content.scrollTop === content.scrollHeight) {
                if (this.setTodoData.pageNo < this.todoList.totalPages && !this.scrolling) {
                this.scrolling = true; // 滚动加载中
                this.$showLoading("加载下一页");
                this.setTodoData.pageNo++;
                this.getTodoList ()
                    .then(() => {
                        this.$hideLoading();
                    })
                    .catch(err => {
                        this.$hideLoading();
                    });
                }
            }
        },
        toDetail(item){
            let processId = item.checkRsId,
                userId = item.avatarUserId,
                clickType = item.clickType,
                // title = item.title,
                newsId = item.id,
                queryId = `${item.checkType}-${item.checkYear}-${item.checkTime}`;
            // let tit = title.match(/\S+(?=需)/)[0];
            if(clickType === 'CHECK_TASK' || clickType === 'CHECK') { // CHECK_TASK 评分 CHECK目标确认
                this.$router.push({
                    path: '/evaluate',
                    query: {
                        processId,
                        userId,
                        newsId
                    }
                })
            } else if (clickType === 'MAKE') {
                this.$router.push({
                    path: '/detail',
                    query: {
                        processId,
                        userId
                    }
                });
            } else if (clickType === 'CHECK_RESULT') {
                this.$router.push({
                    path: '/inputResult',
                    query: {
                        queryId,
                        userId
                    }
                });
            }
        },
    },
    
}

</script>
<style lang="less" scoped>
.title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 45px;
    line-height: 45px;
    font-size: 13px;
    color: rgba(25, 31, 37, 0.76);
    background: #ffffff;
    padding-left: 15px;
    box-shadow: 0px 8px 14px rgba(0, 0, 0, 0.05);
    .num {
        color: #3296FA;
    }
}
.content-wrapper {
    position: fixed;
    top: 45px;
    bottom: 0;
    width: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
</style>