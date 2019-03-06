<!-- 标签过滤组件
:mutiSelect 分类可多选 或 单选
@filterTags 点击确认之后
isSelectType 是否可以选择指标类型
type    默认指标类型
datas   默认数据（一条指标：新增标签）
tagDatas 已选数据（标签库）
isAll   是否可全选指标
-->
<template>
    <div class="filter-tags">
        <div class="filter-content" v-if="getTagFinish">
            <div class="filter-item" v-if="isSelectType">
                <div class="dingtem-filter-head">
                    <span class="dingtem-filter-tip-icon green"></span>
                    <span>分类</span>
                </div>
                <ul class="dingteam-filter-list green">
                    <li :class="selected.selectedFactors.indexOf(1)>-1?'active':''" @click="selectFactor(1)">量化指标</li>
                    <li :class="selected.selectedFactors.indexOf(2)>-1?'active':''" @click="selectFactor(2)">行为价值观指标</li>
                    <li v-if="corpAuth" :class="selected.selectedFactors.indexOf(3)>-1?'active':''" @click="selectFactor(3)">加分项</li>   
                    <li v-if="corpAuth" :class="selected.selectedFactors.indexOf(4)>-1?'active':''" @click="selectFactor(4)">扣分项</li>     
                </ul>
            </div>
            <div class="filter-item">
                <div class="dingtem-filter-head">
                    <span class="dingtem-filter-tip-icon blue"></span>
                    <span>标签</span>
                </div>
                <ul class="dingteam-filter-list blue">
                    <li :class="selected.selectTagIds.length===0?'active':''" @click="selected.selectTagIds=[]" v-if="isAll">全部</li>
                    <li v-for="obj in viewTagList" :key="obj.id" :class="selected.selectTagIds.indexOf(obj.id)>-1?'active':''"
                        @click="selectTag(obj)">{{obj.name}}</li>
                </ul>
            </div>
        </div>
        <div class="footer-icon">
            <button name="addIndex" class="submit" type="button" @click="filterTags">确定</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selected: {
                selectedFactors: [1], // 分类
                selectTagIds: [], // 标签
                selectData: [] // 全部数据
            },
            selectData: [],
            targetType: 1, // 1是量化 2是行为
            getTagFinish: false,
            viewTagList: [],
            tagType: "", // 传给state
        };
    },
    props: {
        mutiSelect: {
            type: Boolean,
            default: false
        },
        isSelectType: {
            type: Boolean,
            default: true
        },
        type: {
            type: Number,
            default: 1
        },
        datas: {
            type: Array,
            default: () => []
        },
        tagDatas: {
            type: Array,
            default: () => []
        },
        isAll: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        this.targetType = this.type;
        this.selected.selectedFactors = [];
        this.selected.selectedFactors.push(this.targetType);
        if(this.tagDatas.length !== 0){
            this.selected.selectTagIds = this.tagDatas;
        }
        if (this.datas.length !== 0) {
            this.selected.selectData = this.datas;
            this.selected.selectData.forEach(item => {
                //后端返回数据乱  两类处理
                if(item.targetId){
                    this.selected.selectTagIds.push(item.tagId);
                }else{
                    this.selected.selectTagIds.push(item.id);
                }
                
            });
        }
    },
    created() {
        this.getTags()
            .then(res => {
                this.getTagFinish = true;
            })
            .catch(error => {
                this.$Toast(error);
            });
    },
    components: {},

    computed: {
        corpAuth() {
            return this.$store.state.userAuthData.corpAuth;
        }
    },

    methods: {
        // 标签库
        getTags() {
            let url =
                window.apiBasePath + "/app/perf/tag/list";
            return this.$Ajax({
                url
            }).then(res => {
                if (!res) return;
                this.viewTagList = res.data.sysTags;
            }).catch( (err) => {
                console.log(err, "tag/list");
            });
        },
        selectFactor(id) {
            if (this.mutiSelect) {
                let index = this.selected.selectedFactors.indexOf(id);
                if (index > -1) {
                    this.selected.selectedFactors.splice(index, 1);
                } else {
                    this.selected.selectedFactors.push(id);
                }
            } else {
                this.targetType = id;
                this.selected.selectedFactors = [];
                this.selected.selectedFactors.push(id);
            }
        },
        selectTag(obj) {
            let index = this.selected.selectTagIds.indexOf(obj.id);
            if (index > -1) {
                this.selected.selectTagIds.splice(index, 1);
                this.selected.selectData.splice(index, 1);
            } else {
                this.selected.selectTagIds.push(obj.id);
                this.selected.selectData.push(obj);
            }
        },
        // 跳转
        filterTags() {
            this.$emit("filterTags", this.selected);
        }
    }
};
</script>
<style lang="less" scoped>
.filter-tags {
    padding-bottom: 74px;
}
.filter-content {
    background: #ffffff;
    overflow: auto;
}

.dingtem-filter-head {
    font-size: 14px;
    margin: 15px 10px;
    clear: both;
}

.filter-item + .filter-item {
    margin-top: 20px;
}

.dingtem-filter-tip-icon {
    width: 12px;
    height: 12px;
    display: inline-block;
    border-radius: 50%;
    margin-right: 5px;

    &.green {
        background-color: #15bc83;
    }

    &.blue {
        background-color: #3296fa;
    }
}

.dingteam-filter-list {
    position: relative;
    overflow: hidden;
    padding-bottom: 12px;
}

.dingteam-filter-list > li {
    height: 50px;
    line-height: 50px;
    background: #f4f4f4;
    border-radius: 8px;
    margin-left: 5%;
    margin-bottom: 15px;
    text-align: center;
    color: rgba(25, 31, 37, 0.56);
    font-size: 15px;
    float: left;
    width: 43%;
}

.dingteam-filter-list.blue > li.active {
    background-color: rgba(50, 150, 250, 0.12);
    color: rgb(50, 150, 250);
}

.dingteam-filter-list.green > li.active {
    background-color: rgba(21, 188, 131, 0.12);
    color: rgb(21, 188, 131);
}

.footer-icon {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 64px;
    text-align: center;
    line-height: 64px;
    background: #ffffff;

    .submit {
        width: 90%;
        background: #3296fa;
        border: 1px solid rgba(25, 31, 37, 0.12);
        border-radius: 3px;
        height: 48px;
        color: #ffffff;
        font-size: 17px;
        font-weight: 300;
    }
}
</style>
