<!-- 待办事项入口 -->
<template>
    <div>
        <div class="todoList" v-if="userAuthData.corpAuth" @click="goTodoList">
            <h2 class="title">待办事项</h2>
            <div class="desc">
                <span class="num" v-if="todoCount.needCount">{{todoCount.needCount}}条</span>
                <span v-else class="num null">无待办事项</span>
                <span class="tags-icon"></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
        };
    },

    components: {},

    computed: {
        todoCount () {
            return this.$store.state.todoCount;
        },
        userAuthData () {
            return this.$store.state.userAuthData;
        }
    },

    methods: {
        //进入代办事项
        goTodoList () {
            this.$router.push({
                path: '/todoList'
            });
        },
    }
}

</script>
<style lang="less" scoped>
.todoList {
    position: relative;
    width: 90%;
    height: 75px;
    padding: 0 25px;
    background-color: #fff;
    border-radius: 11px;
    box-shadow: 0 7px 11px rgba(25,31,37,0.05);
    margin: -29px auto 15px;
    .title {
        display: inline-block;
        font-size: 18px;
        color: #191F25;
        line-height: 75px;
    }
    .desc {
        position: relative;
        float: right;
        line-height: 75px;
        .num {
            font-size: 14px;
            color: #FF943E;
            display: inline-block;
            vertical-align: top;
            padding-right: 10px;
            &.null {
                color: rgba(25, 31, 37, 0.56);
            }
        }
    }
}
</style>