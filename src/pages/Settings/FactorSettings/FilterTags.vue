<!-- 标签过滤 -->
<template>
    <div>
        <select-tags :mutiSelect="false" @filterTags="filterTags"></select-tags>
    </div>
</template>

<script>
import selectTags from '@/components/SelectTags'
export default {
    data () {
        return {
            tagType: ''
        };
    },

    components: {
        selectTags
    },

    computed: {},

    methods: {
        filterTags(selected){
            if(selected.selectedFactors.length >= 2){
                this.tagType = 0;
            } else {
                this.tagType = selected.selectedFactors.join();
            }
            this.$store.commit("changeTagIds", selected.selectTagIds);
            this.$store.commit("changeTagType", this.tagType);
            this.$router.go(-1);
            // this.$router.replace({path: '/settings/factorSettings'});
        }
    }
}

</script>
<style scoped>
</style>