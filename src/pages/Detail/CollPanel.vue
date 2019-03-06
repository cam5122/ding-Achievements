<template>
    <div class="detail-panel-box">
        <div class="detail-panel-type">
            {{ typeName[item.type - 1] + (item.sort||'') }}
        </div>
        <div class="detail-panel">
            <div class="datail-panel-head">
                <h3 class="datail-panel-head-title">{{item.name}}</h3>
            </div>
            <div class="detail-panel-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['item'],
    data() {
        return {
            typeName: ["量化指标", "行为指标", "加分项", "扣分项"]
        };
    },
}
</script>

<style lang="less">
.detail-panel-type{
    padding: 15px 15px 6px;
    font-size: 13px;
    color: rgba(25,31,37,0.40);
}
.detail-panel {
    // border-top: 1px solid #E0E0E0;
    // border-bottom: 1px solid #E0E0E0;
    background-color: #fff;

    .datail-panel-head {
        padding: 10px 15px 10px 0;
        margin-left: 15px;
        display: flex;
        border-bottom: 1px solid rgba(25,31,37,0.08);
        .datail-panel-head-title {
            flex-grow: 1;
            font-size: 16px;
            font-weight: normal;
        }
        .datail-panel-head-options {
            width: 30px;
            color: #999;
        }
    }
    .detail-panel-body {
        // border-top: .5px solid #ECECEC;
        padding: 0 15px 15px 15px;
    }
}
</style>
