<template>
  <div class="my-item" @click="toDetail()">
    <div class="avatar-column">
        <avatar :name="userName" :avatar="userAvatar" width="40" />
    </div>
    <div class="content-column">
        <h3>{{item.title}}</h3>
        <div class="result-info">
            <span class="result-title">绩效结果：</span>
            <span class="result-content">{{item.perfRs || '-'}}</span>
        </div>
        <div class="result-info">
            <span class="result-title">绩效等级：</span>
            <span class="result-content">{{item.perfGrade || '-'}}</span>
        </div>
        <div class="status-info" v-if="!item.isImport">
            <span class="yellow" v-if="item.currentState === 1">绩效目标制定</span>
            <span class="yellow" v-if="item.currentState === 2">绩效目标确认</span>
            <span class="yellow" v-if="item.currentState === 3">员工自评</span>
            <span class="yellow" v-if="item.currentState === 4">评分人评分</span>
            <span class="green" v-if="item.currentState === 5">考核结束</span>
        </div>
        <div class="status-info" v-if="item.isImport"><span class="green">考核结束</span></div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar'

export default {
  props: ['item','userName', 'userAvatar'],
  data() {
      return {};
  },
  components: {Avatar},
  methods: {
      toDetail() {
        let processId = this.item.id || '';
        this.$router.push({
            path: '/detail',
            query: {processId}
        });
      }
  }
}
</script>

<style lang="less">
.my-item {
    padding: 15px 8px;
    // background-color: #fff;
    display: flex;
    
    .avatar-column {
        width: 40px;
        margin-right: 18px;
        margin-left: 15px;
    }
    .content-column {
        flex-grow: 1;

        h3 {
            font-weight: normal;
        }

        .result-info {
            .result-title {
                color: #999;
            }
        }
        h3 + .status-info {
            margin-top: 10px;
        }
    }
}
</style>
