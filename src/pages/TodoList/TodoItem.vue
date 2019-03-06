<!-- todoItem组件 -->
<template>
    <div>
        <div class="todo-item" v-for="(val, key, index) in dealTodoList" :key="index">
            <div class="date">{{key}}</div>
            <ul class="list-wrapper">
                <li class="item-list" v-for="(item, index) in val"  @click="clickItem(item)" :key="item.userId + index">
                    <div class="avatar-wrapper">
                        <app-avatar :avatar="item.avatar" :name="item.userName" :width="40"></app-avatar>
                    </div>                      
                    <div class="title">{{item.title}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import appAvatar from '@/components/Avatar';
export default {
    data () {
        return {
        };
    },
    props: {
        todoList: {
            type: Array,
            required: true
        }
    },

    components: {
        appAvatar
    },

    computed: {
        // 数据处理
        dealTodoList () {
            let list = {};
            // console.log("needList", this.todoList)
            this.todoList.forEach(item => {
                // console.log("item", item);
                let date = new Date(item.createDate).Format('MM月dd日');
                if (list[date]) {
                    list[date].push(item);
                } else {
                    list[date] = [];
                    list[date].push(item);
                }
            });
            // console.log(list);
            return list;
        }
    },

    methods: {
        clickItem(item) {
            // console.log(item);
            this.$emit("clickItem", item);
        }
    }
}

</script>
<style lang="less" scoped>
.date {
    padding: 15px 0 0 25px;
    // background: #F6F6F6;
    height: 42px;
    font-size: 13px;
    color: rgba(25,31,37,0.76);
}
.list-wrapper {
    background-color: #ffffff;
    .item-list {
        padding: 0 25px;
        height: 82px;
        display: flex;
        align-items: center;
        box-shadow: 0 7px 11px rgba(25, 31, 37, 0.04);
        & + .item-list {
            margin-top: 7px;
        }
        .title {
            display: inline-block;
            padding-left: 10px;
            font-size: 15px;
            color: #000000;
            line-height: 23px;
        }
    }
}
</style>