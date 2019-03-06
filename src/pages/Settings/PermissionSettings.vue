<!-- PermissionSettings -->
<template>
    <div class="permission-settings">
        <div class="subauth">
            <h2 class="auth-title">智能绩效主管理员</h2>
            <div class="desc">
                <ul class="auth-members">
                    <li v-for="obj in priAdmin" :key="obj.userId">
                        <app-avatar :avatar="obj.avatar" :name="obj.userName" :width="45"></app-avatar>
                        <div class="auth-mem-name">{{ obj.userName }}</div>
                    </li>
                </ul>
                <p class="auth-tip">绩效应用的主管理员，可由钉钉主管理员设置，绩效主管理员具有应用所有权限，且可以设置智能绩效应用子管理员</p>
            </div>
        </div>
        <div class="subauth">
            <h2 class="auth-title">智能绩效子管理员</h2>
            <div class="desc">
                <ul class="auth-members">
                    <li v-for="obj in subadmin" :key="obj.userId">
                        <app-avatar :avatar="obj.avatar" :name="obj.userName" :width="45"></app-avatar>
                        <div class="auth-mem-name">{{ obj.userName }}</div>
                    </li>
                </ul>
                <p class="auth-tip">可把绩效应用的日常管理工作交给绩效子管理员，绩效子管理员可由绩效主管理员设置</p>
            </div>
        </div>
        <div class="subauth">
            <h2 class="auth-title">企业负责人</h2>
            <div class="desc">
                <ul class="auth-members">
                    <li v-for="obj in authBoss" :key="obj.name">
                        <app-avatar :avatar="obj.avatar" :name="obj.name" :width="45"></app-avatar>
                        <div class="auth-mem-name">{{ obj.name }}</div>
                    </li>
                </ul>
                <p class="auth-tip">企业负责人可以看到全公司的绩效目标制定，绩效考评统计</p>
            </div>
        </div>
        <div class="subauth">
            <h2 class="auth-title">部门主管</h2>
            <p class="auth-tip">让部门主管看到自己部门的绩效考核状况与统计，可在通讯录-部门编辑-设置主管，进行设置</p>
        </div>
        <div class="subauth">
            <h2 class="auth-title">员工</h2>
            <p class="auth-tip">员工可见自己的绩效考核数据情况</p>
        </div>
    </div>
</template>

<script>
import appAvatar from '@/components/Avatar';
export default {
    data () {
        return {
            priAdmin: [],
            authBoss: [],
            subadmin: []
        };
    },
    created () {
        this.getSubadmin();
        this.getBoss();
        this.getPerAdmin();
    },
    components: {
        appAvatar
    },

    computed: {},

    methods: {
        // 智能绩效主管理员
        getPerAdmin() {
            let url = window.apiBasePath + "/app/perf/org/authScope/mainAdmin";
            this.$Ajax({ url }).then(res => {
                if (!res) return;
                this.priAdmin = [];
                this.priAdmin.push(res.data);
            });
        },
        // 子管理员
        getSubadmin() {
            let url = window.apiBasePath + "/app/perf/org/authScope/list";
            this.$Ajax({ url }).then(res => {
                if (!res) return;
                this.subadmin = res.data;
            });
        },
        getBoss() {
            let url = window.apiBasePath + '/app/perf/org/boss';
            this.$Ajax({url}).then((res)=>{
                if(!res) return;
                this.authBoss = res.data;
            });
        }
    }
}

</script>
<style lang="less" scoped>
@import "../../less/mixins.less";
.permission-settings {
    margin-top: 9px;
    .subauth {
        padding-bottom: 28px;
        background-color: #ffffff;
        box-shadow: 0 -1px 0 0 rgba(0,0,0,0.05);
        .auth-title {
            padding-left: 18px;
            height: 42px;
            font-size: 16px;
            color: #191F25;
            line-height: 42px;
            font-weight: normal;
            .border-1px(rgba(25,31,37,0.12));
        }
        .desc {
            padding: 0 18px;
            .auth-members {
                padding-top: 20px;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                & > li {
                    margin-right: calc(~"(100vw - 45px * 5 - 18px * 2) / 4");
                    // margin-right: 20px;
                    margin-bottom: 10px;
                    &:nth-child(5n) {
                        margin-right: 0;
                    }
                    .auth-mem-name {
                        text-align: center;
                        width: 45px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
            .auth-tip {
                padding: 3px 0 0;
            }
        }
        .auth-tip {
            font-size: 14px;
            color: rgba(25,31,37,0.76);
            line-height: 20px;
            padding: 17px 18px 0;
        }

    }
}
.subauth + .subauth {
    margin-top: 9px;
}

</style>