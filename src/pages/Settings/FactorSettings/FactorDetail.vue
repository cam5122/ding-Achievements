<!-- 指标详情 -->
<template>
<div class="factordetail-wrapper">
    <div class="factor-detail">
        <div class="factor-item">
            <h2 class="title">指标类型</h2>
            <div class="tags-list">
                <span class="tag green">{{typeTitle[factorDetail.type - 1]}}</span>
            </div>
        </div>
        <div class="factor-item">
            <h2 class="title">指标名称</h2>
            <div class="desc">{{factorDetail.name}}</div>
        </div>
        <div class="factor-item flex" v-if="factorDetail.type===1 || factorDetail.type === 2">
            <h2 class="title">权重</h2>
            <div class="desc">{{factorDetail.scoreWeight > 0 ? factorDetail.scoreWeight+'%' : '-'}}</div>
        </div>
        <div class="factor-item">
            <h2 class="title">{{standardTitle[factorDetail.type - 1]}}</h2>
            <div class="desc" v-html="factorDetail.remark ? factorDetail.remark.replace(/\n/g,'<br>') : '-'"></div>
        </div>
        <div class="factor-item">
            <h2 class="title">标签</h2>
            <div class="tags-list" v-if="factorDetail.tagNames && factorDetail.tagNames.length>0">
                <span class="tag" v-for="(item, index) in factorDetail.targetTags" :key="item.id+index">{{item.name}}</span>
            </div>
            <div v-else class="desc">暂无标签</div>
        </div>
        <div class="factor-item flex" v-if="userAuthData.corpAuth && factorDetail.type === 1">
            <h2 class="title">门槛值</h2>
            <div class="desc">{{factorDetail.itemBarrier > 0 ? factorDetail.itemBarrier : '-'}}</div>
        </div>
        <div class="factor-item flex" v-if="factorDetail.type === 1">
            <h2 class="title">目标值</h2>
            <div class="desc">{{factorDetail.itemTarget > 0 ? factorDetail.itemTarget : '-'}}</div>
        </div>
        <div class="factor-item flex" v-if="userAuthData.corpAuth && factorDetail.type === 1">
            <h2 class="title">挑战值</h2>
            <div class="desc">{{factorDetail.itemChallenge > 0 ? factorDetail.itemChallenge : '-'}}</div>
        </div>
        <div class="factor-item flex" v-if="factorDetail.type === 3 || factorDetail.type === 4">
            <h2 class="title">{{additionalScore[factorDetail.type - 3]}}</h2>
            <div class="desc">{{factorDetail.itemLimit > 0 ? factorDetail.itemLimit : '-'}}</div>
        </div>
        <div class="factor-item flex" v-if="userAuthData.corpAuth && factorDetail.type === 1">
            <h2 class="title">评分方式</h2>
            <div class="desc">{{factorDetail.scoreMethod ? scoreMethodTitle[factorDetail.scoreMethod - 1] : "-"}}</div>
        </div>
        <!-- <div class="factor-item flex" v-if="userAuthData.corpAuth && factorDetail.type === 1">
            <h2 class="title">结果值来源</h2>
            <div class="desc">{{resultTypeTitle[factorDetail.resultType - 1]}}</div>
        </div> -->
        <div class="factor-item flex" v-if="userAuthData.corpAuth && factorDetail.resultType===3">
            <h2 class="title">指定成员</h2>
            <div class="desc">{{factorDetail.resultUserName}}</div>
        </div>
        <div class="factor-item flex"  v-if="userAuthData.corpAuth && factorDetail.type !== 2">
            <h2 class="title">指定评分人</h2>
            <div class="desc">{{ factorDetail.checkUserName ? factorDetail.checkUserName : '-'}}</div>
        </div>
        <footer-button2 cancel="删除" confirm="编辑" @cancelData="deleteFactor" @confirmData="goEdit"></footer-button2>
    </div>
</div>
</template>

<script>
import footerButton2 from '@/components/FooterButton2';
export default {
    data () {
        return {
            typeTitle: ['量化指标', '行为价值观指标', '加分项', '扣分项'],
            scoreMethodTitle: ['直接评分', '公式计算'],
            resultTypeTitle: ["员工自己", "部门主管", "指定成员"],
            standardTitle: ["考核标准", "考核标准",  "加分标准", "扣分标准"],
            additionalScore: ["加分上限", "扣分上限"],
        };
    },
    components: {
        footerButton2
    },

    computed: {
        factorDetail () {
            return this.$store.state.factorDetail;
        },
        userAuthData() {
            return this.$store.state.userAuthData;
        },
    },

    methods: {
        deleteFactor() {
            this.$Confirm({
                title: '确认删除',
                text: '确认删除该指标？',
                succ: () => {
                    let url = window.apiBasePath + "/app/perf/target/delete",
                        param = {
                            id: this.factorDetail.id
                        } ;
                    this.$Ajax({ url, param }).then(res => {
                        if (!res) return;
                        this.$router.go(-1);
                        this.$Toast("删除成功", true);
                    }).catch( (err) => {
                        console.log(err, "/target/delete");
                    });
                }
            });
        },
        goEdit () {
            this.$router.push({
                path: '/settings/addFactor',
                query: {title: '修改指标'}
            });
        }

    }
}

</script>
<style lang="less" scoped>
.factordetail-wrapper {
    padding-bottom: 70px;
}
.factor-detail {
    margin-top: 8px;
    padding: 21px 21px 35px 17px;
    background: #ffffff;
    .factor-item {
        & + .factor-item {
            padding-top: 12px;
        }
        &.flex {
            display: flex;
            .desc {
                padding-top: 0;
            }
            .title {
                min-width: 50px;
                max-width: 80px
            }
        }
        .title {
            font-size: 14px;
            color: rgba(25,31,37,0.56);
            font-weight: normal;
            line-height: 20px;
            margin-right: 5px;
        }
        .desc {
            padding-top: 5px;
            font-size: 14px;
            color: #191F25;
            line-height: 20px;
        }
    }

}
.tags-list {
    margin-top: 6px;
    .tag {
        display: inline-block;
        background: rgba(0,135,253, 0.1);
        border-radius: 4px;
        padding: 0 6px;
        font-size: 12px;
        height: 21px;
        line-height: 21px;
        color: #0087FD;
        margin-bottom: 6px;
        & + .tag {
            margin-left: 6px;
        }
        &.green {
            color: #15BC83;
            background: rgba(21, 188, 131, 0.1);
        }
    }
}
</style>