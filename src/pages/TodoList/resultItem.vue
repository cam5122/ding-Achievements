<!-- 结果值组件 -->
<template>
    <div>
        <div class="result-main" v-for="(val, key, index) in resultList" :key="'list'+index">
            <div class="result-avatar">
                <app-avatar :avatar="val.avatar" :name="val.userName" :width="24"></app-avatar>
                <div class="name pad-left">{{val.userName}}</div>
                <div class="dept pad-left">{{val.dept}}</div>
            </div>
            <div class="result-item" v-for="(item, i) in val.other" :key="'other'+i">
                <div class="title">{{ item.name }}</div>
                <div class="show-item" v-if="item.itemTarget">
                    <span class="name">{{titleIndex.itemTarget}}：</span>
                    <span>{{item.itemTarget}}{{item.unit}}</span>
                </div>
                <div class="input-border" v-if="item.down === 0">
                    <input type="number" v-if="item.scoreMethod===2" class="needsclick input" placeholder="请输入结果值（数字）" oninput="this.value=this.value.replace(/[^0-9.]+/,'');" v-model="item.itemResult"/>
                    <input type="text" v-else class="needsclick input" placeholder="请输入结果值" v-model="item.itemResult"/>
                    <div class="unit" v-if="item.unit">{{item.unit}}</div>
                </div>
                <div class="show-item" v-else>
                    <span class="name">结果值：</span>
                    <span>{{item.itemResult}}{{item.unit}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import appAvatar from '@/components/Avatar';
export default {
    data () {
        return {
            titleIndex: {
                itemTarget: '目标值'
            }
        };
    },
    props: {
        resultList: {
            type: Object,
            required: true
        }
    },
    components: {
        appAvatar
    },

    computed: {},

    methods: {},
    
    created() {
        // console.log(this.resultList)
    }
}

</script>
<style lang="less" scoped>
.result-main {
    margin-top: 8px;
    background: #ffffff;
    .result-avatar {
        display: flex;
        align-items: center;
        margin-left: 16px;
        height: 55px;
        border-bottom: 1px dashed rgba(25,31,37,0.08);
        // border-bottom: 1px solid rgba(25,31,37,0.14);
        .name {
            font-size: 15px;
            color: #000000;
            line-height: 21px;
        }
        .dept {
            font-size: 13px;
            color: rgba(0,0,0,0.56);
            line-height: 21px;
        }
        .pad-left {
            margin-left: 7px;
        }
    }
    .result-item {
        padding: 13px 16px;
        border-bottom: 1px solid rgba(25,31,37,0.16);
        &:last-child {
            border-bottom: none;
        }
        .title {
            font-size: 15px;
            color: #000000;
            line-height: 21px;
        }
        .show-item {
            margin-top: 7px;
            .name { 
                color: rgba(25, 31, 37, 0.56);
            }
        }
        .input-border {
            position: relative;
            margin-top: 7px;
            .input {
                height: 43px;
                width: 100%;
                border: 1px solid rgba(25,31,37,0.20);
                outline: none;
                padding-left: 10px;
                background: #ffffff;
                font-size: 15px;
                appearance: none;
                -webkit-tap-highlight-color:transparent;
                flex: 1;
                &.emphasis {
                    border: 1px solid #F25643;
                }
                &:focus {
                    border: 1px solid #3296FA;
                }
            }
            .unit {
                position: absolute;
                right: 0px;
                top: 10px;
                max-width: 80px;
                line-height: 21px;
                border-left: 1px solid rgba(25,31,37,0.12);
                padding: 0 9px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
            }
        }
        .result-show {
            display: flex;
            .title {
                color: rgba(25,31,37,0.56);
            }
        }

    }
}
</style>