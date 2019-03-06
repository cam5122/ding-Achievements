<template>
  <div :class="{'avatar':true, 'avatar-name': !avatar}" :style="avaStyle">
      <span class="name" v-if="!avatar">{{userName}}</span>
      <img class="img" :class="{'height100': height100}" :src="avatar" v-else >
  </div>
</template>

<script>

export default {
    props: ['avatar', 'name', 'width'],
    data() {
        return {
            avaStyle: {
                'width': (this.width || 55) + 'px',
                'height': (this.width || 55) + 'px',
                'line-height': (this.width || 55) + 'px'
            },
            avatarSize: {
                width: '',
                height: ''
            },
        }
    },
    computed: {
        height100 () { // width > height height100, width < height width100
            let size = [];
            this.avatar.match(/\_\d+/g).forEach(item => {
                size.push(item.substr(1));
            });
            if (size[0] > size[1]) {
                return true;
            } else {
                return false;
            }
        },
        userName() {
            let showName = this.name || '';
            // return name ? (name.length < 3 ? name : name.substring(name.length - 2, name.length)) : '?'
            let arr = [];
            let _isEnglish = showName.match(/^([a-zA-Z]|\s|,|\.)+$/) !== null ? true : false;

            if (_isEnglish) {
                // 英文名字
                //将“,.”转为空格 & 将连续空格转换为单个空格
                showName = showName.replace(/,|\./g, ' ').replace(/\s+/g, ' ');
                arr = showName.split(' ');
                if (arr.length === 1) {
                    return showName.slice(0, 2);
                }
                return arr[0].slice(0, 1) + arr[1].slice(0, 1);
            }
            // 中文名字 - 取后两位
            return showName.replace(/,|\.|\s+/g, '').slice(-2);
        }
    }
}
</script>

<style lang="less">
    .avatar {
        border-radius: 50%;
        background-color: #fff;
        color: #fff;
        text-align: center;
        overflow: hidden;
        .name {
            width: 100%;
            font-size: 15px;
        }
        .img {
            width: 100%;
            &.height100 {
                height: 100%;
                width: auto;
            }
        }
    }
    .avatar-name {
        background-color: #3F9AF4;
    }
</style>
