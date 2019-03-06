<!-- 暂无数据页面 -->
<template>
    <div class="empty-data">
        <span class="empty-tips">{{msg}}</span>
    </div>
</template>

<script>
export default {
    data () {
        return {
        };
    },
    props: {
        msg: {
            type: String,
            default: "暂无数据"
        }
    },
    components: {},

    computed: {},

    methods: {}
}

</script>
<style scoped>
.empty-data {
    background-image: url("../assets/empty-box-4.png");
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 130px;
    min-height: 250px;
    text-align: center;
}
.empty-tips {
    padding: 190px 15px 0;
    display: block;
    color: #cdcdcd;
    font-size: 15px;
}
</style>