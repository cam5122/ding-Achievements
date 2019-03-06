<!-- 工作台header组件 -->
<template>
    <div class="station-header flex">
          <router-link class="item" to="/settings/launchAssessment" v-if="userAuth.includes(3) || userAuth.includes(4)">
            <img width="25" height="25" src="@/assets/launchAssessment.png" alt="">
            <span class="text">发起考核</span>
        </router-link>
        <router-link class="item" to="/settings/factorSettings" v-if="userAuth.includes(3) || userAuth.includes(4)">
            <img width="25" height="25" src="@/assets/factorSettings.png" alt="">
            <span class="text">指标库</span>
        </router-link>
        <router-link class="item" to="/settings/reviewSettings" v-if="userAuth.includes(3) || userAuth.includes(4) || userAuth.includes(6)">
            <img width="23" height="24" src="@/assets/reviewSettings.png" alt="">
            <span class="text">考评组</span>
        </router-link>
        <router-link class="item" to="/settings/basicSettings" v-if="userAuth.includes(3) || userAuth.includes(4)">
            <img width="25" height="26" src="@/assets/basicSettings.png" alt="">
            <span class="text">基础设置</span>
        </router-link>
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
        userAuth () {
            return this.$store.state.userAuthData.userAuth;
        }
    },

    methods: {}
}

</script>
<style lang="less" scoped>
.station-header {
    width: 100%;
    height: 75px;
    background-color: #fff;
    text-align: center;
}
.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.text {
    display: block;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #000000;
}
</style>
