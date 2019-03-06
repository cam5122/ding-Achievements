<!-- 底部导航组件 -->
<template>
	<div class="navbar">
		<div class="line"></div>
		<div class="navbody">
			<a class="menu" :class="{'active': this.$route.path==='/workStation'}" @click="goPage('/workStation')">
				<p class="pt"><img width="22" height="22" v-if="this.$route.path==='/workStation'" src="@/assets/workstation_blue.png" alt="">
				<img width="22" height="22" v-else src="@/assets/workstation_grey.png" alt=""></p><p class="pu">工作台</p>
			</a>
			<a v-if="userAuthData.userAuth.includes(3) || userAuthData.userAuth.includes(4) || userAuthData.userAuth.includes(5)" class="menu" :class="{'active': this.$route.path==='/report'}" @click="goPage('/report')">
				<p class="pt"><img width="23" height="22" v-if="this.$route.path==='/report'" src="@/assets/report_blue.png" alt="">
				<img width="23" height="22" v-else src="@/assets/report_grey.png" alt=""></p><p class="pu">报表</p>
			</a>
			<a class="menu" :class="{'active': this.$route.path==='/my'}" @click="goPage('/my')">
				<p class="pt"><img width="23" height="22" v-if="this.$route.path==='/my'" src="@/assets/icon_people_blue.png" alt="">
				<img width="23" height="22" v-else src="@/assets/icon_people_grey.png" alt=""></p><p class="pu">我的</p>
			</a>
		</div>
	</div>
</template>
<script>
	export default {
        name: 'footerbar',
        props: { },
        methods: {
			goPage (path) {
				this.$router.replace({path: path});
			}
		},
		computed: {
			userAuthData() {
				return this.$store.state.userAuthData;
			}
		}
    }
</script>
<style scoped>
	.navbar{
		position:fixed;
		left:0;
		bottom:0;
		width:100%;
		height:50px;
		background-color:#fff;
		transform: translate3d(0,0,0);
	}
	.line{
		width:100%;
		height: 1px;
		transform:scaleY(0.5);
		background: rgba(25, 31, 37, 0.12);
	}
	.navbody{
		width:100%;
		height:100%;
		display: flex;
	}
	.menu{
		flex: 1;
		display:inline-block;
		width:32%;
		height:100%;
		text-align:center;
		color:rgba(25,31,37,0.40);
	}
	.menu.active{
        color: #3296FA;
	}
	.menu p.pt{
		height: 32px;
		line-height: 32px;
	}
	.menu p.pt img{
		height:20px;
		width: auto;
		vertical-align: middle;
	}
	.menu p.pu{
		font-family: 'PingFangSC-Medium';
		font-size: 10px;
		height: 12px;
		line-height: 12px;
		margin-top:2px;
	}
	.pt img{
        pointer-events: none; 
        -webkit-user-select: none;
        -moz-user-select: none;
        -webkit-user-select:none;  
        -o-user-select:none;  
        user-select:none;  
    }
</style>