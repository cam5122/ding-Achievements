<!-- 团队绩效考核 下拉联动组件 -->
<template>
    <div>
        <div class="select-perf" @click="showPopupPicker = true">
            <span class="title">{{optionTitle}}</span>
            <span class="tags-icon-down"></span>
        </div>
        <group>
            <popup-picker
                :show.sync="showPopupPicker"
                :show-cell="false"
                title="select perf"
                :data="allTeamOptions"
                v-model="optionSelected"
                :columns="2"
                show-name
                @on-change="changePerf"
            ></popup-picker>
        </group>
    </div>
</template>

<script>
import { Group, PopupPicker } from "vux";
export default {
    data() {
        return {
            showPopupPicker: false,
            optionSelected: ["annual", "4-2198-0"],
            allTeamOptions: [
                { name: "月度", value: "month", parent: 0 },
                { name: "季度", value: "quarter", parent: 0 },
                { name: "半年度", value: "semiannual", parent: 0 },
                { name: "年度", value: "annual", parent: 0 },
                { name: "试用期", value: "probation", parent: 0 }
            ],
            optParentTitle: ["month", "quarter", "semiannual", "annual", "probation"], // allTeamOptions父节点value顺序
            currentQueryId: '',
        };
    },

    props: {
        queryId: {
            type: String,
            required: true
        }
    },

    created () {
        this.getTeamData();
        this.currentQueryId = this.queryId;
    },

    components: {
        Group,
        PopupPicker
    },

    computed: {
        allTeamData() {
            return this.$store.state.allTeamData;
        },
        // 解析queryId
        optionTitle() {
            let id = this.currentQueryId,
                type = Number(id.slice(0, 1)),
                title = id.slice(2, 6) + "年";
            switch (type) {
                case 1:
                    title += id.slice(6).replace("-M", "0").substr(-2) + "月";
                    break;
                case 2:
                    title += "第" + id.slice(-1) + "季度";
                    break;
                case 3:
                    title += id.slice(6).replace("-H1", "上半年").replace("-H2", "下半年");
                    break;
                case 5:
                    title +=id.slice(6).replace("-P", "0").substr(-2) + "月试用期";
                    break;
            }
            // console.log(title);
            return title+'绩效考核';
        },
    },

    methods: {
        changePerf (value) {
            if(value[1] !== null) {
                this.currentQueryId = value[1];
                this.$emit('changeQueryId', value[1]);
            } else {
                return;
            }
            // console.log(value, this.optionSelected)
        },
        // 获取所有团队绩效列表
        getTeamData() {
            if ( this.allTeamData &&
                this.allTeamData.groupListSummury &&
                this.allTeamData.groupListSummury.length
            ) {
                this.getTeamOptions();
                return;
            }
            let url = `${window.apiBasePath}/app/perf/group/showList`;
            let param = {
                type: 0,
                pageNo: 1, // 虽然已经去掉翻页，后端还需要这个参数，前端暂时写死
                pageSize: 50 // 虽然已经去掉翻页，后端还需要这个参数，前端暂时写死
            };
            this.$Ajax({ url, type: "post", param }).then(res => {
                if (!res) return;
                this.$store.commit("saveAllTeamData", res.data);
                this.getTeamOptions();
            }).catch( (err) => {
                console.log(err, "showList");
            });
        },
        // FIXME: 优化没有子节点没有则删除父节点
        getTeamOptions() {        
            let allTeamData = this.allTeamData;
            if (
                allTeamData &&
                allTeamData.groupListSummury &&
                allTeamData.groupListSummury.length
            ) {
                allTeamData.groupListSummury.map(item => {
                    let regNum = Number (item.queryId.substr(0, 1)); // 1-5对应optParentTitle的值
                    this.allTeamOptions.push({
                        name: item.title,
                        value: item.queryId,
                        parent: this.optParentTitle[regNum - 1]
                    });
                });
                if (this.queryId) {
                    let parent = this.optParentTitle[Number(this.queryId.substr(0,1))-1];
                    this.optionSelected = [parent, this.queryId];
                    // console.log(this.optionSelected);
                }
            }
        }
    }
};
</script>
<style lang="less" scoped>
.select-perf {
    width: 100%;
    height: 45px;
    background: #ffffff;
    box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    .title {
        font-size: 15px;
        color: #191f25;
        padding-right: 15px;
    }
}
</style>